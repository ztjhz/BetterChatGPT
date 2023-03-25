import { MessageInterface } from '@type/chat';
import countTokens from './countTokens';

export const limitMessageTokens = (
  messages: MessageInterface[],
  limit: number = 4096
): MessageInterface[] => {
  const limitedMessages: MessageInterface[] = [];
  let tokenCount = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const count = countTokens(messages[i].content);
    if (count + tokenCount > limit) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }

  return limitedMessages;
};

export const countMessagesToken = (messages: MessageInterface[]) => {
  return messages.reduce(
    (tokenCount, message) => (tokenCount += countTokens(message.content)),
    0
  );
};
