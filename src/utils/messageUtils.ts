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

  if (limitedMessages.length > 4 && limitedMessages[0].role === 'system'){
    const firstElement = limitedMessages.shift(); // 取出第一个元素并移除
    if (firstElement !== undefined) { // 确保 firstElement 不为 undefined
      limitedMessages.splice(-3, 0, firstElement); // 将第一个元素插入到倒数第四个位置
    }
  }

  return limitedMessages;
};

export const countMessagesToken = (messages: MessageInterface[]) => {
  return messages.reduce(
    (tokenCount, message) => (tokenCount += countTokens(message.content)),
    0
  );
};
