import { MessageInterface } from '@type/chat';
import countTokens from './countTokens';

export const limitMessageTokens = (
  messages: MessageInterface[],
  limit: number = 4096
): MessageInterface[] => {
  const limitedMessages: MessageInterface[] = [];
  let tokenCount = 0;

  if (messages[0]?.role === 'system') {
    const count = countTokens(messages[0].content);
    tokenCount += count;
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const count = countTokens(messages[i].content);
    if (count + tokenCount > limit) break;
    tokenCount += count;
    limitedMessages.unshift({ ...messages[i] });
  }

  if (messages[0]?.role === 'system' && limitedMessages[0]?.role !== 'system') {
    limitedMessages.unshift({ ...messages[0] });
  }

  return limitedMessages;
};

export const countMessagesToken = (messages: MessageInterface[]) => {
  return messages.reduce(
    (tokenCount, message) => (tokenCount += countTokens(message.content)),
    0
  );
};
