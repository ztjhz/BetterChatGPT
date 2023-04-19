import { Role, MessageInterface, ModelOptions, TotalTokenUsed } from '@type/chat';

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

export const limitMessageTokens = (
  messages: MessageInterface[],
  limit: number = 4096,
  model: ModelOptions
): [MessageInterface[], number, number[]] => {
  // Iterate through preserved messages, adding them to the preservedMessages array
  let { preservedMessages, preservedIndexes, tokenCount } = messages.reduce(
    (
      accumulator: {
        preservedMessages: Array<{
          index: number;
          role: Role;
          content: string;
        }>;
        preservedIndexes: number[];
        tokenCount: number;
      },
      message,
      index
    ) => {
      if (message.preserve) {
        accumulator.preservedMessages.push({
          index: index,
          role: message.role,
          content: message.content,
        });
        accumulator.preservedIndexes.push(index);
        accumulator.tokenCount += countTokens(
          [{ role: message.role, content: message.content }],
          model
        );
      }
      return accumulator;
    },
    { preservedMessages: [], preservedIndexes: [], tokenCount: 0 }
  );

  // Iterate through messages in reverse order, adding them to the limitedMessages array
  // if the token limit has not been reached
  if (tokenCount < limit) {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (!preservedIndexes.includes(i)) {
        const count = countTokens(
          [{ role: messages[i].role, content: messages[i].content }],
          model
        );
        // TODO: continue and find smaller messages,
        // or preserve previous behavior?
        if (count + tokenCount > limit) break;
        tokenCount += count;
        preservedIndexes.push(i);
        preservedMessages.push({
          index: i,
          role: messages[i].role,
          content: messages[i].content,
        });
      }
    }
  }

  // Finally, sort preserved messages and only return the role and content
  // along with the tokenCount
  // and indexes that are in context
  return [
    preservedMessages
      .sort((a, b) => a.index - b.index)
      .map(({ role, content }) => ({ role, content })),
    tokenCount,
    preservedIndexes,
  ];
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
  const { promptTokens = 0, completionTokens = 0 } =
    updatedTotalTokenUsed[model] ?? {};

  updatedTotalTokenUsed[model] = {
    promptTokens: promptTokens + newPromptTokens,
    completionTokens: completionTokens + newCompletionTokens,
  };
  setTotalTokenUsed(updatedTotalTokenUsed);
};

export default countTokens;
