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
  model: ModelOptions,
  includeAssistantRequest:boolean = true
) => {
  const isGpt3 = model === 'gpt-3.5-turbo';

  const msgSep = isGpt3 ? '\n' : '';
  const roleSep = isGpt3 ? '\n' : '<|im_sep|>';

  const messsagesStrArray = [messages
    .map(({ role, content }) => {
      return `<|im_start|>${role}${roleSep}${content}<|im_end|>`;
    })
    .join(msgSep)];

  if (includeAssistantRequest)
    messsagesStrArray.push(`<|im_start|>assistant${roleSep}`);

  const serialized = messsagesStrArray.join(msgSep);

  return encoder.encode(serialized, 'all');
};

/*includeAssistantRequest:
  pass "true" when requesting a final tokens calculation for the full messages array  
  pass "false" when requesting message calculation for one message only (for estimation) */

const countTokens = (messages: MessageInterface[], model: ModelOptions, includeAssistantRequest: boolean) => {
  //if (messages.length === 0) return 0;
  return getChatGPTEncoding(messages, model, includeAssistantRequest).length;
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

  // Include the "assistants message request" token count as per the serialization rules
  const assistantsRequestTokenCount = countTokens([], model, true);
  
  let systemTokenCount = 0;
  let chatTokenCount = assistantsRequestTokenCount;
  let totalTokenCount = assistantsRequestTokenCount;

  let lastMessageTokens = 0;

  // Search for the System message ( Normally, it is expected at [0]), and consider its token count.
  for (let i = 0; i < messages.length; i++) {

    if (messages[i].role == 'system') 
    {
      const messageTokensCount = countTokens([messages[i]], model, false);

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

    const nextMessagesBatch: MessageInterface[] = []
    let nextMessagesBatchTokensCount = 0;

    if (messages[i].role == 'user')
    {
      nextMessagesBatch.unshift(messages[i]);
      nextMessagesBatchTokensCount += countTokens([messages[i]], model, false);

      // This is for the error toaster IN CASE even the very last user message could not be included;
      // Need to return its tokens count to show to the user
      if (i==messages.length - 1)
        lastMessageTokens = nextMessagesBatchTokensCount + assistantsRequestTokenCount;     
    }

    // Add assistant's message with the previous user message it was responding to
    if (messages[i].role == 'assistant')
    {
      nextMessagesBatch.unshift(messages[i]);
      nextMessagesBatchTokensCount += countTokens([messages[i]], model, false);

      if (i >= 1 && messages[i-1].role == 'user')
      {
        nextMessagesBatch.unshift(messages[i-1]);
        nextMessagesBatchTokensCount += countTokens([messages[i-1]], model, false);
        i --;        
      }
    }
    
    if (totalTokenCount + nextMessagesBatchTokensCount > limit)
    {
      /* Limit exceeded, show warning toast */ 

      setToastStatus('warning');
      setToastMessage('Chat exceeds Max Input Tokens. Not all messages were included.');
      setToastShow(true);

      //console.debug (`limitMessageTokens: Token limit exceeded. Total tokens: ${totalTokenCount}, New Messages Batch (${nextMessagesBatch.length}) tokens: ${nextMessagesBatchTokensCount}, Limit: ${limit}`);
      
      break;
    }

    totalTokenCount += nextMessagesBatchTokensCount;
    chatTokenCount + nextMessagesBatchTokensCount;

    limitedMessages.unshift(...nextMessagesBatch);
  }

  // Finally, add the previously discovered System message to the front of limitedMessages; 
  // No need to check tokens limit - it was already accounted for at the beinning
  if (systemMessage)
    limitedMessages.unshift(systemMessage);

  //console.debug(`limitMessageTokens: selected messages for submission: ` + JSON.stringify(limitedMessages));

  return [limitedMessages, systemTokenCount, chatTokenCount, lastMessageTokens];
};

export const updateTotalTokenUsed = (
  model: ModelOptions,
  promptMessages: MessageInterface[],
  completionMessage: MessageInterface
): [number, number] => { // returns new tokens used by the message and completion
  const setTotalTokenUsed = useStore.getState().setTotalTokenUsed;
  const updatedTotalTokenUsed: TotalTokenUsed = JSON.parse(
    JSON.stringify(useStore.getState().totalTokenUsed)
  );

  const newPromptTokens = countTokens(promptMessages, model, true);
  const newCompletionTokens = countTokens([completionMessage], model, false);

  const { promptTokens = 0, completionTokens = 0 } =
    updatedTotalTokenUsed[model] ?? {};

  updatedTotalTokenUsed[model] = {
    promptTokens: promptTokens + newPromptTokens,
    completionTokens: completionTokens + newCompletionTokens,
  };
  setTotalTokenUsed(updatedTotalTokenUsed);

  return [newPromptTokens, newCompletionTokens]
};

export default countTokens;
