import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { ChatInterface, ChatTag } from '@type/chat';
import TickIcon from '@icon/TickIcon';
import PlusIcon from '@icon/PlusIcon';
import CrossIcon from '@icon/CrossIcon';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';

const defaultTags: ChatTag[] = ['work', 'study', 'other'];

const getTagDisplayName = (tag: ChatTag, t: (key: string) => string): string => {
  switch (tag) {
    case 'work':
      return t('tagWork');
    case 'study':
      return t('tagStudy');
    case 'other':
      return t('tagOther');
    default:
      return tag;
  }
};

const TagContextMenu = ({
  chatIndex,
  position,
  onClose,
}: {
  chatIndex: number;
  position: { x: number; y: number };
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const chats = useStore((state) => state.chats);
  const setChats = useStore((state) => state.setChats);

  const [customTag, setCustomTag] = useState<string>('');
  const [showCustomInput, setShowCustomInput, inputRef] = useHideOnOutsideClick();
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentTag = chats?.[chatIndex]?.tag;

  const setTag = (tag?: ChatTag) => {
    if (chats) {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
      if (tag) {
        updatedChats[chatIndex].tag = tag;
      } else {
        delete updatedChats[chatIndex].tag;
      }
      setChats(updatedChats);
    }
    onClose();
  };

  const handleCustomTag = () => {
    if (customTag.trim()) {
      setTag(customTag.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomTag();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (showCustomInput && inputFieldRef.current) {
      inputFieldRef.current.focus();
    }
  }, [showCustomInput]);

  return (
    <div
      ref={menuRef}
      className='fixed z-[1000] bg-gray-900 border border-gray-700 rounded-lg shadow-xl min-w-[160px]'
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='p-2 text-xs text-gray-400 border-b border-gray-700 px-3'>
        {t('setTag')}
      </div>
      <div className='p-1'>
        <button
          className={`w-full flex items-center justify-between px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 rounded transition-colors ${
            !currentTag ? 'bg-gray-800' : ''
          }`}
          onClick={() => setTag()}
        >
          <span>{t('noTag')}</span>
          {!currentTag && <TickIcon className='h-4 w-4 text-green-500' />}
        </button>

        {defaultTags.map((tag) => (
          <button
            key={tag}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 rounded transition-colors ${
              currentTag === tag ? 'bg-gray-800' : ''
            }`}
            onClick={() => setTag(tag)}
          >
            <span>{getTagDisplayName(tag, t)}</span>
            {currentTag === tag && <TickIcon className='h-4 w-4 text-green-500' />}
          </button>
        ))}

        {currentTag && !defaultTags.includes(currentTag) && (
          <button
            className={`w-full flex items-center justify-between px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 rounded transition-colors bg-gray-800`}
            onClick={() => setTag(currentTag)}
          >
            <span>{currentTag}</span>
            <TickIcon className='h-4 w-4 text-green-500' />
          </button>
        )}

        <div ref={inputRef} className='relative'>
          <button
            className='w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 rounded transition-colors'
            onClick={() => setShowCustomInput(true)}
          >
            <PlusIcon className='h-4 w-4' />
            <span>{t('customTag')}</span>
          </button>

          {showCustomInput && (
            <div className='absolute left-0 top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg p-2 z-10'>
              <div className='flex items-center gap-1'>
                <input
                  ref={inputFieldRef}
                  type='text'
                  className='flex-1 min-w-0 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-gray-100 focus:outline-none focus:border-gray-500'
                  placeholder={t('enterTagName') as string}
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className='p-1 hover:bg-gray-700 rounded text-green-500'
                  onClick={handleCustomTag}
                  aria-label='confirm'
                >
                  <TickIcon className='h-4 w-4' />
                </button>
                <button
                  className='p-1 hover:bg-gray-700 rounded text-gray-400'
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomTag('');
                  }}
                  aria-label='cancel'
                >
                  <div className='h-4 w-4'>
                    <CrossIcon />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagContextMenu;
