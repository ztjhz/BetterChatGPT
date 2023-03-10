import React from 'react';
import useStore from '@store/store';
import { ChatInterface, MessageInterface } from '@type/chat';
import {
  getChatCompletionStream as getChatCompletionStreamFree,
  getChatCompletion as getChatCompletionFree,
} from '@api/freeApi';
import {
  getChatCompletionStream as getChatCompletionStreamCustom,
  getChatCompletion as getChatCompletionCustom,
} from '@api/customApi';
import { parseEventSource } from '@api/helper';
import { limitMessageTokens } from '@utils/messageUtils';
import { defaultChatConfig } from '@constants/chat';

const useSubmit = () => {
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const apiFree = useStore((state) => state.apiFree);
  const apiKey = useStore((state) => state.apiKey);
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const setChats = useStore((state) => state.setChats);

  const generateTitle = async (
    message: MessageInterface[]
  ): Promise<string> => {
    let data;
    if (apiFree) {
      data = await getChatCompletionFree(
        useStore.getState().apiFreeEndpoint,
        message,
        defaultChatConfig
      );
    } else if (apiKey) {
      data = await getChatCompletionCustom(apiKey, message, defaultChatConfig);
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
      const messages = limitMessageTokens(
        chats[currentChatIndex].messages,
        4000
      );
      if (messages.length === 0) throw new Error('Message exceed max token!');

      if (apiFree) {
        stream = await getChatCompletionStreamFree(
          useStore.getState().apiFreeEndpoint,
          messages,
          chats[currentChatIndex].config
        );
      } else if (apiKey) {
        stream = await getChatCompletionStreamCustom(
          apiKey,
          messages,
          chats[currentChatIndex].config
        );
      } else {
        throw new Error('No API key supplied! Please check your API settings.');
      }

      if (stream) {
        if (stream.locked)
          throw new Error(
            'Oops, the stream is locked right now. Please try again'
          );
        const reader = stream.getReader();
        let reading = true;
        while (reading && useStore.getState().generating) {
          const { done, value } = await reader.read();

          const result = parseEventSource(new TextDecoder().decode(value));

          if (result === '[DONE]' || done) {
            reading = false;
          } else {
            const resultString = result.reduce((output: string, curr) => {
              if (typeof curr === 'string') return output;
              else {
                const content = curr.choices[0].delta.content;
                if (content) output += content;
                return output;
              }
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

      // generate title for new chats
      const currChats = useStore.getState().chats;
      if (currChats && !currChats[currentChatIndex]?.titleSet) {
        const messages_length = currChats[currentChatIndex].messages.length;
        const assistant_message =
          currChats[currentChatIndex].messages[messages_length - 1].content;
        const user_message =
          currChats[currentChatIndex].messages[messages_length - 2].content;

        const message: MessageInterface = {
          role: 'user',
          content: `Generate a title in less than 6 words for the following message:\nUser: ${user_message}\nAssistant: ${assistant_message}`,
        };

        let title = await generateTitle([message]);
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
