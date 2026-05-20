import React from 'react';
import useStore from '@store/store';
import { useTranslation } from 'react-i18next';
import { ChatInterface, MessageInterface } from '@type/chat';
import {
  ChatCompletionMessage,
  OpenAIFunctionDefinition,
  PluginDefinition,
} from '@type/plugin';
import { getChatCompletion, getChatCompletionStream } from '@api/api';
import { parseEventSource } from '@api/helper';
import { limitMessageTokens, updateTotalTokenUsed } from '@utils/messageUtils';
import { _defaultChatConfig } from '@constants/chat';
import { officialAPIEndpoint } from '@constants/auth';
import {
  enabledPlugins,
  parseFunctionArguments,
  pluginsToOpenAIFunctions,
  runPlugin,
} from '@utils/plugins';

const maxPluginRounds = 3;

const useSubmit = () => {
  const { t, i18n } = useTranslation('api');
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const apiKey = useStore((state) => state.apiKey);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  const generateTitle = async (
    message: MessageInterface[]
  ): Promise<string> => {
    let data;
    try {
      if (!apiKey || apiKey.length === 0) {
        // official endpoint
        if (apiEndpoint === officialAPIEndpoint) {
          throw new Error(t('noApiKeyWarning') as string);
        }

        // other endpoints
        data = await getChatCompletion(
          useStore.getState().apiEndpoint,
          message,
          _defaultChatConfig
        );
      } else if (apiKey) {
        // own apikey
        data = await getChatCompletion(
          useStore.getState().apiEndpoint,
          message,
          _defaultChatConfig,
          apiKey
        );
      }
    } catch (error: unknown) {
      throw new Error(`Error generating title!\n${(error as Error).message}`);
    }
    return data.choices[0].message.content;
  };

  const getCompletion = async (
    messages: ChatCompletionMessage[],
    config: ChatInterface['config'],
    functions?: OpenAIFunctionDefinition[]
  ) => {
    if (!apiKey || apiKey.length === 0) {
      if (apiEndpoint === officialAPIEndpoint) {
        throw new Error(t('noApiKeyWarning') as string);
      }

      return getChatCompletion(
        useStore.getState().apiEndpoint,
        messages,
        config,
        undefined,
        undefined,
        functions
      );
    }

    return getChatCompletion(
      useStore.getState().apiEndpoint,
      messages,
      config,
      apiKey,
      undefined,
      functions
    );
  };

  const updateCurrentAssistantMessage = (content: string) => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    updatedMessages[updatedMessages.length - 1].content = content;
    setChats(updatedChats);
  };

  const runPluginConversation = async (
    messages: MessageInterface[],
    config: ChatInterface['config'],
    plugins: PluginDefinition[]
  ): Promise<string> => {
    const functions = pluginsToOpenAIFunctions(plugins);
    const pluginMessages: ChatCompletionMessage[] = messages.map((message) => ({
      ...message,
    }));

    for (let round = 0; round < maxPluginRounds; round++) {
      const data = await getCompletion(pluginMessages, config, functions);
      const responseMessage = data.choices[0]?.message as
        | ChatCompletionMessage
        | undefined;

      if (!responseMessage) {
        throw new Error('OpenAI returned an empty response.');
      }

      if (!responseMessage.function_call) {
        return responseMessage.content ?? '';
      }

      const plugin = plugins.find(
        ({ name }) => name === responseMessage.function_call?.name
      );
      if (!plugin) {
        throw new Error(
          `OpenAI requested an unknown plugin: ${responseMessage.function_call.name}`
        );
      }

      updateCurrentAssistantMessage(`Running plugin: ${plugin.name}`);

      const args = parseFunctionArguments(responseMessage.function_call);
      const result = await runPlugin(plugin, args);

      pluginMessages.push({
        role: 'assistant',
        content: responseMessage.content ?? null,
        function_call: responseMessage.function_call,
      });
      pluginMessages.push({
        role: 'function',
        name: plugin.name,
        content: result,
      });
    }

    throw new Error('Plugin call limit reached before ChatGPT answered.');
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
        chats[currentChatIndex].config.max_tokens,
        chats[currentChatIndex].config.model
      );
      if (messages.length === 0) throw new Error('Message exceed max token!');

      const activePlugins = enabledPlugins(useStore.getState().plugins);

      if (activePlugins.length > 0) {
        const finalContent = await runPluginConversation(
          messages,
          chats[currentChatIndex].config,
          activePlugins
        );
        updateCurrentAssistantMessage(finalContent);
      } else {
        // no api key (free)
        if (!apiKey || apiKey.length === 0) {
          // official endpoint
          if (apiEndpoint === officialAPIEndpoint) {
            throw new Error(t('noApiKeyWarning') as string);
          }

          // other endpoints
          stream = await getChatCompletionStream(
            useStore.getState().apiEndpoint,
            messages,
            chats[currentChatIndex].config
          );
        } else if (apiKey) {
          // own apikey
          stream = await getChatCompletionStream(
            useStore.getState().apiEndpoint,
            messages,
            chats[currentChatIndex].config,
            apiKey
          );
        }

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
              updatedMessages[updatedMessages.length - 1].content +=
                resultString;
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
          content: `Generate a title in less than 6 words for the following message (language: ${i18n.language}):\n"""\nUser: ${user_message}\nAssistant: ${assistant_message}\n"""`,
        };

        let title = (await generateTitle([message])).trim();
        if (title.startsWith('"') && title.endsWith('"')) {
          title = title.slice(1, -1);
        }
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        updatedChats[currentChatIndex].title = title;
        updatedChats[currentChatIndex].titleSet = true;
        setChats(updatedChats);

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
