import React from 'react';
import { useTranslation } from 'react-i18next';

import DropDown from '@components/DropDown';

import useStore from '@store/store';

import { ChatInterface, Role, roles } from '@type/chat';

import Avatar from './Avatar';
import MessageContent from './MessageContent';

import LeftButton from './Button/LeftButton';
import RightButton from './Button/RightButton';

// const backgroundStyle: { [role in Role]: string } = {
//   user: 'dark:bg-gray-800',
//   assistant: 'bg-gray-50 dark:bg-gray-650',
//   system: 'bg-gray-50 dark:bg-gray-650',
// };
const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-650'];

const Message = React.memo(
  ({
    role,
    content,
    messageIndex,
    generating,
    versions,
    versionIdx,
    sticky = false,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
    generating: boolean;
    versions?: string[] | undefined;
    versionIdx?: number | undefined;
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();

    const setChats = useStore((state) => state.setChats);
    const setInputRole = useStore((state) => state.setInputRole);

    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const advancedMode = useStore((state) => state.advancedMode);
    const currentChatIndex = useStore((state) => state.currentChatIndex);

    const previousVersion = () => {
      if (versions && versions.length !== undefined) {
        const idx = versionIdx !== undefined ? versionIdx : versions.length - 1;
        return idx - 1;
      }
      return undefined;
    };

    const hasPreviousVersion = () => {
      const previous = previousVersion();
      return previous !== undefined && previous >= 0;
    };

    const nextVersion = () => {
      if (versions && versions.length !== undefined) {
        const idx = versionIdx !== undefined ? versionIdx : versions.length - 1;
        return idx + 1;
      }
      return undefined;
    };

    const hasNextVersion = () => {
      const next = nextVersion();
      return next !== undefined && versions && next < versions.length;
    };

    const setVersion = (index: number, content: string) => {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(useStore.getState().chats)
      );

      const updatedMessages = updatedChats[currentChatIndex].messages;
      let version = updatedMessages[messageIndex];

      version.content = content;
      version.versionIndex = index;

      setChats(updatedChats);
    };

    return (
      <div
        className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
          backgroundStyle[messageIndex % 2]
        }`}
      >
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-4 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <Avatar role={role} />
          <div className='w-[calc(100%-50px)] '>
            <div className='relative flex flex-row justify-between items-center; gap-1 md:gap-3 lg:w-[calc(100%-115px)]'>
              {advancedMode && (
                <DropDown
                  selected={t(role)}
                  selections={roles.map((r) => ({ value: r, label: t(r) }))}
                  onClick={(value) => {
                    if (!sticky) {
                      const updatedChats: ChatInterface[] = JSON.parse(
                        JSON.stringify(useStore.getState().chats)
                      );
                      updatedChats[currentChatIndex].messages[
                        messageIndex
                      ].role = value as Role;
                      setChats(updatedChats);
                    } else {
                      setInputRole(value as Role);
                    }
                  }}
                />
              )}

              {!sticky && versions?.length && versions.length > 1 && (
                <div className='flex items-center justify-center'>
                  <LeftButton
                    disabled={generating || !hasPreviousVersion()}
                    onClick={() => {
                      const previous = previousVersion();

                      if (previous !== undefined && previous >= 0) {
                        setVersion(previous, versions[previous]);
                      }
                    }}
                  />

                  <span className='text-xs pl-2 pr-2'>{`${
                    (versionIdx || 0) + 1
                  } / ${versions.length}`}</span>

                  <RightButton
                    disabled={generating || !hasNextVersion()}
                    onClick={() => {
                      const next = nextVersion();

                      if (next !== undefined && next <= versions.length - 1) {
                        setVersion(next, versions[next]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
            <MessageContent
              role={role}
              content={content}
              messageIndex={messageIndex}
              sticky={sticky}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;
