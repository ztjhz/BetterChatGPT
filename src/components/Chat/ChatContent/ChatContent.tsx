import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';

import ScrollToBottomButton from './ScrollToBottomButton';
import ChatTitle from './ChatTitle';
import Message from './Message';
import NewMessageButton from './Message/NewMessageButton';

import { getChatCompletionStream as getChatCompletionStreamFree } from '@api/freeApi';
import { getChatCompletionStream as getChatCompletionStreamCustom } from '@api/customApi';
import { parseEventSource } from '@api/helper';

import RefreshIcon from '@icon/RefreshIcon';
import { MessageInterface } from '@type/chat';

const ChatContent = () => {
  const [messages, inputRole, apiFree, apiKey, setMessages] = useStore(
    (state) => [
      state.messages,
      state.inputRole,
      state.apiFree,
      state.apiKey,
      state.setMessages,
    ]
  );

  const handleSubmit = async () => {
    const updatedMessages: MessageInterface[] = JSON.parse(
      JSON.stringify(messages)
    );
    updatedMessages.push({ role: 'assistant', content: '' });
    setMessages(updatedMessages);
    let stream;

    if (apiFree) {
      stream = await getChatCompletionStreamFree(messages);
    } else if (apiKey) {
      stream = await getChatCompletionStreamCustom(apiKey, messages);
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
            if (curr === '[DONE]') return output;
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
  };

  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollToBottom
        className='h-full dark:bg-gray-800'
        followButtonClassName='hidden'
      >
        <ScrollToBottomButton />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <ChatTitle />
          {messages?.length === 0 && <NewMessageButton messageIndex={-1} />}
          {messages?.map((message, index) => (
            <>
              <Message
                role={message.role}
                content={message.content}
                messageIndex={index}
              />
              <NewMessageButton messageIndex={index} />
            </>
          ))}
          <Message role={inputRole} content='' messageIndex={-1} sticky />

          <div className='text-center mt-6 flex justify-center gap-2'>
            <button
              className='btn relative btn-primary mt-2'
              onClick={handleSubmit}
            >
              Submit
            </button>
            {/* <button className='btn btn-neutral border-0 md:border mt-2'>
              <div className='flex items-center justify-center gap-2'>
                <RefreshIcon />
                Regenerate response
              </div>
            </button> */}
          </div>
          <div className='w-full h-32 md:h-48 flex-shrink-0'></div>
        </div>
      </ScrollToBottom>
    </div>
  );
};

export default ChatContent;
