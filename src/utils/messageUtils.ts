import { MessageInterface, ModelOptions, TotalTokenUsed } from '@type/chat';

import store from '@store/store';
import useStore from '@store/store';

import { Tiktoken } from '@dqbd/tiktoken/lite';
const cl100k_base = await import('@dqbd/tiktoken/encoders/cl100k_base.json');

const encoder = new Tiktoken(
  cl100k_base.bpe_ranks,
  {
    ...cl100k_base.special_tokens,
    '<|im_start|>': 100264,
    '<|im_end|>': 100265,
    '<|im_sep|>': 100266,
  },
  cl100k_base.pat_str
);

// https://github.com/dqbd/tiktoken/issues/23#issuecomment-1483317174
export const getChatGPTEncoding = (
  messages: MessageInterface[],
  model: ModelOptions
) => {
  const isGpt3 = model === 'gpt-3.5-turbo';

  const msgSep = isGpt3 ? '\n' : '';
  const roleSep = isGpt3 ? '\n' : '<|im_sep|>';

  const serialized = [
    messages
      .map(({ role, content }) => {
        return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
      })
      .join(msgSep),
    `<|im_start|>assistant${roleSep}`,
  ].join(msgSep);

  return encoder.encode(serialized, 'all');
};

const countTokens = (messages: MessageInterface[], model: ModelOptions) => {
  if (messages.length === 0) return 0;
  return getChatGPTEncoding(messages, model).length;
};

const setToastStatus = store.getState().setToastStatus;
const setToastMessage = store.getState().setToastMessage;
const setToastShow = store.getState().setToastShow;

export const limitMessageTokens = (
  messages: MessageInterface[],
  limit: number = 4096,
  model: ModelOptions
): [MessageInterface[], number, number, number] => {

  const limitedMessages: MessageInterface[] = [];

  let systemTokenCount = 0;
  let chatTokenCount = 0;
  let totalTokenCount = 0;

  let lastMessageTokens = 0;

  //console.log(`Limiting messages to ${limit} tokens`);

  // Search for the System message and add it, regardless of the tokens limit. Normally, it is expected at 0.
  for (let i = 0; i < messages.length; i++) {

    if (messages[i].role == 'system') 
    {
      const messageTokensCount = countTokens([messages[i]], model);

      systemTokenCount += messageTokensCount;
      totalTokenCount  += messageTokensCount;
      limitedMessages.push(messages[0]);  

      //console.log(`System message added to the limitedMessages. Total Tokens: ${totalTokenCount}`);

      break; // We only support one System message.
    }
  }

  // Iterate through Non-System messages in REVERSE order, adding them to the limitedMessages until the token limit is reached
  
  for (let i = messages.length - 1; i >= 0; i--) {

    //Skip System message that was taken care of already
    if (messages[i].role == 'system') 
      continue;

    const messageTokensCount = countTokens([messages[i]], model);

    if (i==messages.length - 1)
      lastMessageTokens = messageTokensCount;
    
    if (totalTokenCount + messageTokensCount > limit)
    {
      /* Limit exceeded, show toast warning */ 

      setToastStatus('warning');
      setToastMessage('Chat exceeds Max Input Tokens. Not all messages were included.');
      setToastShow(true);

      //console.log ('Prompt tokens limit exceeded, not all messages were included');
      
      break;
    }

    totalTokenCount += messageTokensCount;
    chatTokenCount + messageTokensCount;

    limitedMessages.unshift({ role: messages[i].role, content: messages[i].content });

    //console.log(`Message added to the limitedMessages. Total Tokens: ${totalTokenCount}`)
  }


  //console.log(`Prepared messages for submission. Added ${limitedMessages.length} messages including the System Prompt`)

  return [limitedMessages, systemTokenCount, chatTokenCount, lastMessageTokens];
};

export const updateTotalTokenUsed = (
  model: ModelOptions,
  promptMessages: MessageInterface[],
  completionMessage: MessageInterface
) => {
  const setTotalTokenUsed = useStore.getState().setTotalTokenUsed;
  const updatedTotalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().totalTokenUsed)
  );

  const newPromptTokens = countTokens(promptMessages, model);
  const newCompletionTokens = countTokens([completionMessage], model);

  const { setTokensToastInputTokens, setTokensToastCompletionTokens, setTokensToastShow} = useStore.getState();
  
  setTokensToastInputTokens(newPromptTokens.toString())
  setTokensToastCompletionTokens(newCompletionTokens.toString())
  setTokensToastShow(true)

  const { promptTokens = 0, completionTokens = 0 } =
    updatedTotalTokenUsed[model] ?? {};

  updatedTotalTokenUsed[model] = {
    promptTokens: promptTokens + newPromptTokens,
    completionTokens: completionTokens + newCompletionTokens,
  };
  setTotalTokenUsed(updatedTotalTokenUsed);
};

export default countTokens;
