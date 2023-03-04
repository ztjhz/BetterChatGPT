import React, { useState } from 'react';
import useStore from '@store/store';
import { MessageInterface } from '@type/chat';
import { getChatCompletionStream as getChatCompletionStreamFree } from '@api/freeApi';
import { getChatCompletionStream as getChatCompletionStreamCustom } from '@api/customApi';
import { parseEventSource } from '@api/helper';

const useSubmit = () => {
  const [error, setError] = useState<string>('');
  const [messages, apiFree, apiKey, setMessages, setGenerating, generating] =
    useStore((state) => [
      state.messages,
      state.apiFree,
      state.apiKey,
      state.setMessages,
      state.setGenerating,
      state.generating,
    ]);

  const handleSubmit = async (refresh?: boolean) => {
    if (generating) return;

    const updatedMessages: MessageInterface[] = JSON.parse(
      JSON.stringify(messages)
    );
    if (refresh) {
      updatedMessages[updatedMessages.length - 1] = {
        role: 'assistant',
        content: '',
      };
    } else {
      updatedMessages.push({ role: 'assistant', content: '' });
    }
    setMessages(updatedMessages);
    setGenerating(true);
    let stream;

    try {
      if (apiFree) {
        if (refresh)
          stream = await getChatCompletionStreamFree(
            updatedMessages.slice(0, updatedMessages.length - 1)
          );
        else stream = await getChatCompletionStreamFree(messages);
      } else if (apiKey) {
        if (refresh)
          stream = await getChatCompletionStreamCustom(
            apiKey,
            updatedMessages.slice(0, updatedMessages.length - 1)
          );
        else stream = await getChatCompletionStreamFree(messages);
      }

      if (stream) {
        const reader = stream.getReader();
        let reading = true;
        while (reading) {
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

            const updatedMessages: MessageInterface[] = JSON.parse(
              JSON.stringify(useStore.getState().messages)
            );
            updatedMessages[updatedMessages.length - 1].content += resultString;
            setMessages(updatedMessages);
          }
        }
      }
    } catch (e: unknown) {
      const err = (e as Error).message;
      console.log(err);
      setError(err);
      setTimeout(() => {
        setError(''), 10000;
      });
    }
    setGenerating(false);
  };

  return { handleSubmit, error };
};

export default useSubmit;
