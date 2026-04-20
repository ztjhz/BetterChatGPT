import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import { ChatTag } from '@type/chat';

const defaultTags: ChatTag[] = ['work', 'study', 'other'];

const getTagDisplayName = (tag: ChatTag | undefined, t: (key: string) => string): string => {
  if (!tag) return t('allTags');
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

const getAllTags = (): ChatTag[] => {
  const chats = useStore.getState().chats;
  const tags = new Set<ChatTag>(defaultTags);
  if (chats) {
    chats.forEach((chat) => {
      if (chat.tag) {
        tags.add(chat.tag);
      }
    });
  }
  return Array.from(tags);
};

interface TagFilterProps {
  selectedTag: ChatTag | undefined;
  onSelectTag: (tag: ChatTag | undefined) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onSelectTag }) => {
  const { t } = useTranslation();
  const chats = useStore((state) => state.chats);

  const getAllTags = (): ChatTag[] => {
    const tags = new Set<ChatTag>(defaultTags);
    if (chats) {
      chats.forEach((chat) => {
        if (chat.tag && !defaultTags.includes(chat.tag)) {
          tags.add(chat.tag);
        }
      });
    }
    return Array.from(tags);
  };

  const tags = getAllTags();

  return (
    <div className='flex flex-wrap gap-1.5 p-2 border-b border-white/20'>
      <button
        className={`px-2.5 py-1 text-xs rounded-full transition-all ${
          selectedTag === undefined
            ? 'bg-teal-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
        onClick={() => onSelectTag(undefined)}
      >
        {t('allTags')}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`px-2.5 py-1 text-xs rounded-full transition-all ${
            selectedTag === tag
              ? 'bg-teal-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => onSelectTag(tag)}
        >
          {getTagDisplayName(tag, t)}
        </button>
      ))}
      <button
        className={`px-2.5 py-1 text-xs rounded-full transition-all ${
          selectedTag === null
            ? 'bg-teal-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
        onClick={() => onSelectTag(null as unknown as undefined)}
      >
        {t('noTag')}
      </button>
    </div>
  );
};

export default TagFilter;
