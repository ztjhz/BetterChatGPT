import React from 'react';
import { Role } from '@type/chat';
import SettingIcon from '@icon/SettingIcon';
import PersonIcon from '@icon/PersonIcon';
import Logo from '@logo/color';
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
      style={{ backgroundColor: 'rgb(120, 100, 140)' }}
    >
      <PersonIcon />
    </div>
  );
};

const AssistantAvatar = () => {
  return (
    <div
      className='relative h-[30px] w-[30px] p-1 rounded-sm bg-white text-white flex items-center justify-center'
    >
      <Logo />
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
