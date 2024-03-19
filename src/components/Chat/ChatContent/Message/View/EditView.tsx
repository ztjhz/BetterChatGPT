import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import TokenCount from '@components/TokenCount';
import CommandPrompt from '../CommandPrompt';
import { Role, MessageInterface } from '@type/chat';

export function findLastUserMessageIndex(updatedMessages: MessageInterface[], messageIndex: number): number {
  for (let i = messageIndex - 1; i >= 0; i--) {
    if (updatedMessages[i].role === 'user') {
      return i;
    }
  }
  return -1; 
}

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
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();
  const generating = useStore.getState().generating;
  const advancedMode = useStore((state) => state.advancedMode);

  const enterToSubmit = useStore.getState().enterToSubmit;

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );

    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
  
      if (!e.ctrlKey && !e.shiftKey) {        // Just Enter
        if (enterToSubmit) {
          e.preventDefault(); // Prevent default to avoid newline in textarea
          handleGenerate();
        }
      } else if (e.shiftKey && !e.ctrlKey) {  // Shift+Enter
        if (!enterToSubmit) {
          e.preventDefault(); // Prevent default to avoid newline in textarea
          handleGenerate();
        }
      } else if (!e.shiftKey && e.ctrlKey) {  // Ctrl+Enter
        e.preventDefault();   // Prevent default to avoid newline in textarea
        if (sticky) {
          handleAppendLastAndGenerate();
        } else {
          handleSave();
        }
      } else if (e.ctrlKey && e.shiftKey) {  // Ctrl+Enter
        e.preventDefault();   // Prevent default to avoid newline in textarea
        // No action for Ctrl+Shift+Enter, but reserve for future
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

  const handleGenerate = () => {
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
    handleSubmit();
  };

  const handleAppendLastAndGenerate = () => {
    if (useStore.getState().generating) return;

    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;

    const lastUserMessageIndex = findLastUserMessageIndex(updatedMessages, messageIndex);

    if (lastUserMessageIndex == -1) {
      console.log ("Error: no user messages above the current message, can't append");
      return;
    }
    updatedMessages[lastUserMessageIndex].content += "\n\n Clarification: "
    updatedMessages[lastUserMessageIndex].content += _content;

    updatedChats[currentChatIndex].messages = updatedMessages.slice(0,lastUserMessageIndex + 1);
    setChats(updatedChats);
    handleSubmit();

    if (!sticky){
      setIsEdit(false);
    } else 
    {
      _setContent('');
      resetTextAreaHeight();
    }
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

  const chats = JSON.parse(JSON.stringify(useStore.getState().chats));
  const messages = chats[currentChatIndex].messages;
  const lastUserMessageIndexAbove = findLastUserMessageIndex(messages, messageIndex)


  return (
    <>
      {/* Message Input Text Area */}
      <div
        className={`w-full ${
          sticky
            ? 'py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-300/60 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
            : ''
        }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40 dark:placeholder:text-gray-300/60'
          onChange={(e) => {
            _setContent(e.target.value);
          }}
          value={_content}
          placeholder={t('submitPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
        >
        </textarea>
      </div>
      
      {/* Generate, Save, Cancel buttons */}
      <div className='flex'>
        <div className='flex-1 text-center mt-2 flex justify-center'>
          {sticky && (
            <>
              {/* Send New Message button */}
              <button
                className={`btn relative mr-2 btn-primary ${generating ? 'cursor-not-allowed opacity-40' : ''}`}
                  onClick={handleGenerate}
                  title={enterToSubmit?(t('tooltipEnter') as string):(t('tooltipShiftEnter') as string)}
                  >
                  <div className='flex items-center justify-center gap-2'>
                    {t('generate')}
                  </div>
              </button>

              {/* Clarification to Previous Message button */}
              {(lastUserMessageIndexAbove != -1) && (
                <button
                      className={`btn relative mr-2 btn-primary ${ generating ? 'cursor-not-allowed opacity-40' : ''}`}
                      onClick={handleAppendLastAndGenerate}
                      title={t('tooltipCtrlEnter') as string}
                    >
                  <div className='flex items-center justify-center gap-2'>
                    {t('appendRegenerate')}
                  </div>
                </button>
              )}
            </>
          )}

          {!sticky && (
            <>
              {/* Regenerate Button */}
              <button
                className='btn relative mr-2 btn-primary'
                onClick={() => {!generating && setIsModalOpen(true);}}
                title={enterToSubmit?(t('tooltipEnter') as string):(t('tooltipShiftEnter') as string)}
                >
                <div className='flex items-center justify-center gap-2'>
                  {t('regenerate')}
                </div>
              </button>
              
              {/* Save Button */}
              <button
                className={`btn relative mr-2 btn-neutral ${ generating ? 'cursor-not-allowed opacity-40' : ''}`}
                onClick={handleSave}
                title={t('tooltipCtrlEnter') as string}
              >
                <div className='flex items-center justify-center gap-2'>
                  {t('save')}
                </div>
              </button>
            </>
          )}

          {sticky || (
            <button
              className='btn relative btn-neutral'
              onClick={() => setIsEdit(false)}
              aria-label={t('cancel') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('cancel')}
              </div>
            </button>
          )}
        </div>

        {sticky && advancedMode && <TokenCount />}

        <CommandPrompt _setContent={_setContent} />

      </div>

      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('warning') as string}
          message={t('clearMessageWarning') as string}
          handleConfirm={handleGenerate}
        />
      )}
    </>
  );
};

export default EditView;
