import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useSubmit from '@hooks/useSubmit';
import useValidatePreSubmit from '@hooks/useValidatePreSubmit';

import { ChatInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import CommandPrompt from '../CommandPrompt';
import { MessageInterface } from '@type/chat';

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
  const currentChats = useStore((state) => state.chats);

  // Current input message content draft - local state
  const [__content, __setContent] = useState<string>(content); 

  // Current input message content draft -> persist to global state (centralized buffer)
  const newMessageDraftBuffer = (useStore(state => state.newMessageDraftBuffer));
  const setNewMessageDraftBuffer = (useStore(state => state.setNewMessageDraftBuffer));

  const _setContent = (content: string) => {
      __setContent(content);                               // update local state (textarea display)

      if (sticky)                                         //only for the "new" message prompt (not edits)
        setNewMessageDraftBuffer(content, currentChatIndex); // persist to global state (centralized buffer)
  }

  const _addPromptContent = (promptContent: string) => {
    const newContent = promptContent + "\n\n" + __content;
    __setContent(newContent);                               // update local state (textarea display)
    setNewMessageDraftBuffer(newContent, currentChatIndex); // persist to global state (centralized buffer)
}

  // On chat changes, refresh the textarea based on the buffer.
  // See utils/handleNewMessageDraftsPersistence.ts on buffer synchronization with Chat-level state
  useEffect(() => {
    if (sticky) {
      __setContent(newMessageDraftBuffer ?? "");
    }
  }, [currentChatIndex, currentChats, sticky]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();
  const generatingState = useStore((state) => state.generating);

  const enterToSubmit = useStore((state) => state.enterToSubmit);

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
    // It's a handler, so better query Store directly for the generating state
    if (sticky && (__content === '' || useStore.getState().generating)) return;

    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      updatedMessages.push({ role: inputRole, content: __content });
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = __content;
      setIsEdit(false);
    }
    setChats(updatedChats);
  };

  const { handleSubmit } = useSubmit();
  const { validateMessages } = useValidatePreSubmit();

  const handleGenerate = () => 
  {
    // It's a handler, so better query Store directly for the generating state
    if (useStore.getState().generating) return;

    // If this was called through a "Confirm" modal, we'll close it regardless
    setIsModalOpen(false);

    if (__content == '') return;

    const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useStore.getState().chats));

    let updatedMessages: MessageInterface[];

    if (sticky)  // New Message box 
    {
      updatedMessages = [...updatedChats[currentChatIndex].messages, 
                               { role: inputRole, content: __content }]; //add a message
    } 
    else        // Edit Messsage box
    {
      updatedMessages = updatedChats[currentChatIndex].messages.slice(0, messageIndex + 1); // truncate further messages
      updatedMessages[messageIndex].content = __content;                 // update the current message
    }

    // Validate the messages for submission (mainly for checking token limits etc)
    if (validateMessages(updatedMessages) === false) return;

    // Update the chat in the Store
    updatedChats[currentChatIndex].messages = updatedMessages;
    setChats(updatedChats);

    // Clear the input box
    if (sticky) 
    {
      _setContent('');
      resetTextAreaHeight();
    } 
    else 
    {
      setIsEdit(false);
    }

    handleSubmit();
  };

  const handleAppendLastAndGenerate = () => {

    // It's a handler, so better query Store directly for the generating state
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
    updatedMessages[lastUserMessageIndex].content += __content;

    updatedChats[currentChatIndex].messages = updatedMessages.slice(0,lastUserMessageIndex + 1);

    // Validate the messages for submission (mainly for checking token limits etc)
    if (validateMessages(updatedChats[currentChatIndex].messages) === false) return;

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
  }, [__content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const chats = JSON.parse(JSON.stringify(useStore.getState().chats || []));
  const messages = (currentChatIndex < chats.length) ? chats[currentChatIndex]?.messages : undefined;
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
          value={__content}
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
                className={`btn relative mr-2 btn-primary ${generatingState ? 'cursor-not-allowed opacity-40' : ''}`}
                  onClick={handleGenerate}
                  title={enterToSubmit?(t('tooltipEnter') as string):(t('tooltipShiftEnter') as string)}
                  disabled={generatingState}
                  >
                  <div className='flex items-center justify-center gap-2'>
                    {t('generate')}
                  </div>
              </button>

              {/* Clarification to Previous Message button */}
              {(lastUserMessageIndexAbove != -1) && (
                <button
                      className={`btn relative mr-2 btn-primary ${ generatingState ? 'cursor-not-allowed opacity-40' : ''}`}
                      onClick={handleAppendLastAndGenerate}
                      disabled={generatingState}
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
                className={`btn relative mr-2 btn-primary ${ generatingState ? 'cursor-not-allowed opacity-40' : ''}`}
                onClick={() => {!generatingState && setIsModalOpen(true);}}
                disabled={generatingState}
                title={enterToSubmit?(t('tooltipEnter') as string):(t('tooltipShiftEnter') as string)}
                >
                <div className='flex items-center justify-center gap-2'>
                  {t('regenerate')}
                </div>
              </button>
              
              {/* Save Button */}
              <button
                className={`btn relative mr-2 btn-neutral ${ generatingState ? 'cursor-not-allowed opacity-40' : ''}`}
                onClick={handleSave}
                disabled={generatingState}
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

        {/* There was one more Tokens Counter display */}
        {/* {sticky && advancedMode && <TokenCount />} */}

        <CommandPrompt _addPromptContent={_addPromptContent} />

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
