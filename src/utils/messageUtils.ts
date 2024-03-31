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

  let systemMessage = undefined;

  let systemTokenCount = 0;
  let chatTokenCount = 0;
  let totalTokenCount = 0;

  let lastMessageTokens = 0;

  // Search for the System message ( Normally, it is expected at [0]), and consider its token count.
  for (let i = 0; i < messages.length; i++) {

    if (messages[i].role == 'system') 
    {
      const messageTokensCount = countTokens([messages[i]], model);

      systemTokenCount += messageTokensCount;
      totalTokenCount  += messageTokensCount;
      systemMessage = messages[i]; 
      // Don't actually add the message just yet, so we could rely on "unshift" for user-assistant messages

      break; // We only support one System message for now - no need to look further
    }
  }

  /* Iterate through Non-System messages in REVERSE order,
      adding them to the front of limitedMessages until the token limit is reached */

  for (let i = messages.length - 1; i >= 0; i--) {

    //Skip System message that is being taken care of separately
    if (messages[i].role == 'system') 
      continue;

    const messageTokensCount = countTokens([messages[i]], model);

    // This is for the error toaster IN CASE even the very last user message could not be included
    if (i==messages.length - 1)
      lastMessageTokens = messageTokensCount;
    
    
    if (totalTokenCount + messageTokensCount > limit)
    {
      /* Limit exceeded, show warning toast */ 

      setToastStatus('warning');
      setToastMessage('Chat exceeds Max Input Tokens. Not all messages were included.');
      setToastShow(true);

      //console.log ('Prompt tokens limit exceeded, not all messages were included');
      
      break;
    }

    totalTokenCount += messageTokensCount;
    chatTokenCount + messageTokensCount;

    limitedMessages.unshift({ role: messages[i].role, content: messages[i].content });
  }

  // Finally, add the previously discovered System message to the front of limitedMessages
  if (systemMessage)
    limitedMessages.unshift(systemMessage);

  console.debug(`limitMessageTokens: selected messages for submission: ` + JSON.stringify(limitedMessages));

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
