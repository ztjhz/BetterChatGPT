import React from 'react';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import { Role } from '@type/chat';
import RoleSelector from './RoleSelector';

const backgroundStyle: { [role in Role]: string } = {
  user: 'dark:bg-gray-800',
  assistant: 'bg-gray-50 dark:bg-[#444654]',
  system: 'bg-gray-50 dark:bg-[#444654]',
};

const Message = ({
  role,
  content,
  messageIndex,
  sticky = false,
}: {
  role: Role;
  content: string;
  messageIndex: number;
  sticky?: boolean;
}) => {
  return (
    <div
      className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${backgroundStyle[role]}`}
      key={
        messageIndex !== -1
          ? `${messageIndex}-${content}`
          : 'sticky-message-text-area'
      }
    >
      <div className='text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0'>
        <Avatar role={role} />
        <div className='w-[calc(100%-50px)] '>
          <RoleSelector
            role={role}
            messageIndex={messageIndex}
            sticky={sticky}
          />
          <MessageContent
            content={content}
            messageIndex={messageIndex}
            sticky={sticky}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
