import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import useSubmit from '@hooks/useSubmit';
import { ChatInterface } from '@type/chat';
import PopupModal from '@components/PopupModal';
import { t } from 'i18next';
import {CheckCircleIcon} from '@heroicons/react/20/solid'
const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const dataSources = useStore((state) => state.sources);
  const setDataSources = useStore((state) => state.setSouces);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  
  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;
      if (sticky) {
        if (
          (enterToSubmit && !e.shiftKey) ||
          (!enterToSubmit && (e.ctrlKey || e.shiftKey))
        ) {
          e.preventDefault();
          handleSaveAndSubmit();
          resetTextAreaHeight();
        }
      } else {
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault();
          handleSaveAndSubmit();
          resetTextAreaHeight();
        } else if (e.ctrlKey || e.shiftKey) handleSave();
      }
    }
  };

  const handleSave = () => {
    if (sticky && (_content === '' || useStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      updatedMessages.push({ role: inputRole, content: _content });
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
  };

  const { handleSubmit } = useSubmit();
  const handleSaveAndSubmit = () => {
    if (useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      if (_content !== '') {
        updatedMessages.push({ role: inputRole, content: _content });
      }
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit(dataSources);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <DataSourcesSelector 
        dataSources={dataSources} 
        onChange={(checked: Boolean, value:string) => {
          if (checked) {
            if(value === 'auto'){
              setDataSources(['auto'])
              return
            }else{
              setDataSources([...dataSources.filter((item: string) => item !== 'auto'), value])
            }
          }else{
            const afterValue = dataSources.filter((item: string) => item !== value)
            if(afterValue.length === 0){
              setDataSources(['auto'])
              return
            }
            setDataSources(afterValue)
            console.log('afterValue',afterValue)
          }
        }}
      />
      <div
        className={`w-full ${
          sticky
            ? 'flex align-top gap-2 py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
            : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40'
          onChange={(e) => {
            _setContent(e.target.value);
          }}
          value={_content}
          placeholder={t('submitPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
        ></textarea>
        <EditViewButtons
        sticky={sticky}
        handleSaveAndSubmit={handleSaveAndSubmit}
        handleSave={handleSave}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        _setContent={_setContent}
      />
      </div>
      
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleSaveAndSubmit}
        />
      )}
    </>
  );
};
const DataSourcesSelector = ({dataSources, onChange}: any) => {
  const sources = [{
    name: t('tools.auto.name', {ns: 'source'}),
    value: 'auto',
    description: t('tools.auto.description', {ns: 'source'})
  },{
    name: t('tools.knowledge.name', {ns: 'source'}),
    value: 'Knowledge search',
    description: t('tools.knowledge.description', {ns: 'source'})
  },{
    name:  t('tools.news.name', {ns: 'source'}),
    value: 'News query',
    description: t('tools.news.description', {ns: 'source'})
  },{
    name: t('tools.data.name', {ns: 'source'}),
    value: 'Data statistics',
    description: t('tools.data.description', {ns: 'source'})
  }]
  return (
    <div>
      <p className='text-xs text-gray-300 mb-2'>{t('tools.selector.title', {ns: 'source'})}</p>
      <div className='flex gap-2 w-full overflow-y-scroll overflow-x-visible lg:overflow-y-visible  lg:overflow-x-visible items-stretch'>
        {sources.map((source, idx) => {
          const checked = dataSources.includes(source.value)
          return (
            <div className='shrink-0 lg:flex-1'>
              <div key={source.name} className={` lg:h-full cursor-pointer p-2 border hover:ring-2 ${checked ? 'text-emerald-600 border-emerald-600 dark:text-emerald-300' : 'text-gray-900 dark:text-gray-300'} rounded ring-offset-1 ring-emerald-600 transition-all `} onClick={() => {
                onChange(!checked, source.value)
              }}>
                <div className='flex gap-1  items-center'>
                  <div>
                    <CheckCircleIcon className={`${checked ? 'text-emerald-600' : 'text-gray-400'} w-4 h-4`}/>
                  </div>
                  <div className="w-full text-xs font-medium"  >{source.name}</div>
                </div>
                <div className='ml-5 mt-1 text-xs text-gray-400 hidden sm:block'>
                  {source.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
const EditViewButtons = memo(
  ({
    sticky = true,
    handleSaveAndSubmit,
  }: {
    sticky?: boolean;
    handleSaveAndSubmit: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    _setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { t } = useTranslation();
    const generating = useStore.getState().generating;

    return (
      <div className='flex shrink-0 self-end'>
        <div className='flex-1 text-center flex justify-center'>
          {sticky && (
            <button
              className={`btn relative btn-primary ${
                generating ? 'cursor-not-allowed opacity-40' : ''
              }`}
              onClick={handleSaveAndSubmit}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('saveAndSubmit')}
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }
);

export default EditView;
