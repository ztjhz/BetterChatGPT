import React from 'react';
import { Role } from '@type/chat';
import SettingIcon from '@icon/SettingIcon';
import PersonIcon from '@icon/PersonIcon';

const Avatar = React.memo(({ role }: { role: Role }) => {
  return (
    <div className='w-[30px] flex flex-col relative items-end'>
      {role === 'user' && <UserAvatar />}
      {role === 'assistant' && <AssistantAvatar />}
      {role === 'system' && <SystemAvatar />}
    </div>
  );
});

const UserAvatar = () => {
  return (
    <div
      className='relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center'
      style={{ backgroundColor: 'rgb(200, 70, 70)' }}
    >
      <PersonIcon />
    </div>
  );
};

const AssistantAvatar = () => {
  return (
    <div className='relative h-[30px] w-[30px] rounded-sm flex items-center justify-center overflow-hidden'>
      <img
        src='/favicon.png'
        alt='Assistant'
        className='h-full w-full object-cover'
      />
    </div>
  );
};

const SystemAvatar = () => {
  return (
    <div
      className='relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center'
      style={{ backgroundColor: 'rgb(126, 163, 227)' }}
    >
      <SettingIcon />
    </div>
  );
};

export default Avatar;
