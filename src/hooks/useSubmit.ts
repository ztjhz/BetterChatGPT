import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { ChatInterface, MessageInterface, ModelOptions } from '@type/chat';
import { isAuthenticated, redirectToLogin, getChatCompletion, getChatCompletionStream } from '@api/api';
import { parseEventSource } from '@api/helper';
import { limitMessageTokens, updateTotalTokenUsed } from '@utils/messageUtils';
import { supportedModels, defaultTitleGenModel, _defaultChatConfig } from '@constants/chat';
import { officialAPIEndpoint, builtinAPIEndpoint } from '@constants/auth';
import { isAzureEndpoint } from '@utils/api';


export interface OpenAICompletionsConfig {
  model: string;
  max_tokens: number,
  temperature: number;
  presence_penalty: number;
  top_p: number;
  frequency_penalty: number;
}

const useSubmit = () => {
  const { t, i18n } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const apiKey = useStore((state) => state.apiKey);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating)
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  /* Prepare API Request Headers */

  const prepareApiHeaders = async (
      model: ModelOptions, 
      messages: MessageInterface[],
      purpose: string) => {

    const headers: Record<string, string> = {};
    
    if (apiEndpoint !== builtinAPIEndpoint){

      if (!apiKey || apiKey.length === 0) {
        throw new Error('API key is required but missing.');
      }

      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (isAzureEndpoint(apiEndpoint) && apiKey)
      headers['api-key'] = apiKey;

    /* If not an "official" API endpoint -> it is assumed to be a PortkeyAI Gateway */
    if (apiEndpoint !== officialAPIEndpoint)
    {
      headers['x-portkey-provider'] = supportedModels[model].portkeyProvider;
    };

    /* Built-in endpoint (/api/v1/chat/completions) */
    if (apiEndpoint === builtinAPIEndpoint)
    {
      const isAuthenticatedUser = await isAuthenticated();
      
      if (!isAuthenticatedUser) {
        console.log("User not authenticated, redirecting to login.");
        await redirectToLogin();
        throw new Error(`API Authentication Error, please reload the page`);
      }

      headers['X-api-model'] = supportedModels[model].apiAliasCurrent;
      headers['X-messages-count'] = messages.length.toString();
      headers['X-purpose'] = purpose;
    }
  
    return {headers};
  };

  const generateTitle = async ( message: MessageInterface[] ) => {
    const chats = useStore.getState().chats;
    if (!chats)
      return;
    
    let data;

    const titleGenModel = supportedModels[chats[currentChatIndex].config.model].titleGenModel;

    const titleGenConfig: OpenAICompletionsConfig = {
      model: supportedModels[titleGenModel].apiAliasCurrent,
      max_tokens: 100,
      temperature: _defaultChatConfig.temperature,
      presence_penalty: _defaultChatConfig.presence_penalty,
      top_p: _defaultChatConfig.top_p,
      frequency_penalty: _defaultChatConfig.frequency_penalty
    };

    try
    {
      const headers = await prepareApiHeaders(titleGenModel, message, 'Title Generation');

      data = await getChatCompletion(
        useStore.getState().apiEndpoint,
        message,
        titleGenConfig,
        headers.headers
      );

    } catch (error: unknown) {
      throw new Error(`Error generating title!\n${(error as Error).message}`);
    }
    return data.choices[0].message.content;
  };

  const handleSubmit = async () => {
    const chats = useStore.getState().chats;
    if (generating || !chats) return;

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));

    updatedChats[currentChatIndex].messages.push({
      role: 'assistant',
      content: '',
    });

    setChats(updatedChats);
    setGenerating(true);

    try {
      let stream;
      if (chats[currentChatIndex].messages.length === 0)
        throw new Error('No messages submitted!');

      const messages = limitMessageTokens(
        chats[currentChatIndex].messages,
        chats[currentChatIndex].config.maxPromptTokens,
        chats[currentChatIndex].config.model
      );
      if (messages.length === 0) throw new Error('Message exceeds Max Prompts Token!');
      
      const completionsConfig: OpenAICompletionsConfig = {
        model: supportedModels[chats[currentChatIndex].config.model].apiAliasCurrent,
        max_tokens: chats[currentChatIndex].config.maxGenerationTokens,
        temperature: chats[currentChatIndex].config.temperature,
        presence_penalty: chats[currentChatIndex].config.presence_penalty,
        top_p: chats[currentChatIndex].config.top_p,
        frequency_penalty: chats[currentChatIndex].config.frequency_penalty
      };

      const headers = await prepareApiHeaders(chats[currentChatIndex].config.model, messages, 'Chat Submission');
        
      stream = await getChatCompletionStream(
        useStore.getState().apiEndpoint,
        messages,
        completionsConfig,
        headers.headers
      );
  

      if (stream) {
        if (stream.locked)
          throw new Error(
            'Oops, the stream is locked right now. Please try again'
          );
        const reader = stream.getReader();
        let reading = true;
        let partial = '';
        while (reading && useStore.getState().generating) {
          const { done, value } = await reader.read();
          const result = parseEventSource(
            partial + new TextDecoder().decode(value)
          );
          partial = '';

          if (result === '[DONE]' || done) {
            reading = false;
          } else {
            const resultString = result.reduce((output: string, curr) => {
              if (typeof curr === 'string') {
                partial += curr;
              } else {
                const content = curr.choices[0]?.delta?.content ?? null;
                if (content) output += content;
              }
              return output;
            }, '');

            const updatedChats: ChatInterface[] = JSON.parse(
              JSON.stringify(useStore.getState().chats)
            );
            const updatedMessages = updatedChats[currentChatIndex].messages;
            updatedMessages[updatedMessages.length - 1].content += resultString;
            setChats(updatedChats);
          }
        }
        if (useStore.getState().generating) {
          reader.cancel('Cancelled by user');
        } else {
          reader.cancel('Generation completed');
        }
        reader.releaseLock();
        stream.cancel();
      }

      // update tokens used in chatting
      const currChats = useStore.getState().chats;
      const countTotalTokens = useStore.getState().countTotalTokens;

      if (currChats && countTotalTokens) {
        const model = currChats[currentChatIndex].config.model;
        const messages = currChats[currentChatIndex].messages;
        updateTotalTokenUsed(
          model,
          messages.slice(0, -1),
          messages[messages.length - 1]
        );
      }

      // generate title for new chats
      if (
        useStore.getState().autoTitle &&
        currChats &&
        !currChats[currentChatIndex]?.titleSet
      ) {
        const messages_length = currChats[currentChatIndex].messages.length;
        const assistant_message =
          currChats[currentChatIndex].messages[messages_length - 1].content;
        const user_message =
          currChats[currentChatIndex].messages[messages_length - 2].content;

        const message: MessageInterface = {
          role: 'user',
          content: `Generate a title in less than 6 words for the following message:\n"""\nUser: ${user_message}\nAssistant: ${assistant_message}\n"""`,
        };

        let title = (await generateTitle([message])).trim();
        if (title) // generateTitle function was able to return a non-blank Title
        {
          if (title.startsWith('"') && title.endsWith('"')) {
            title = title.slice(1, -1);
          }

          const updatedChats: ChatInterface[] = JSON.parse(
            JSON.stringify(useStore.getState().chats)
          );
          updatedChats[currentChatIndex].title = title;
          updatedChats[currentChatIndex].titleSet = true;
          setChats(updatedChats);
        }

        // update tokens used for generating title
        if (countTotalTokens) {
          const model = _defaultChatConfig.model;
          updateTotalTokenUsed(model, [message], {
            role: 'assistant',
            content: title,
          });
        }
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.log(err);
      setError(err);
    }
    setGenerating(false);
  };

  return { handleSubmit, error };
};

export default useSubmit;
