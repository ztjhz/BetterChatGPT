import React, { memo, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import useSubmit from '@hooks/useSubmit';

import { ChatInterface, ContentInterface, ImageContentInterface, TextContentInterface } from '@type/chat';

import PopupModal from '@components/PopupModal';
import TokenCount from '@components/TokenCount';
import CommandPrompt from '../CommandPrompt';
import FolderIcon from '@icon/FolderIcon';

const EditView = ({
  text: text,
  image_urls: image_urls,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  text: string;
  image_urls: string[];
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);

  const [_text, _setText] = useState<string>(text);
  const [_images, _setImages] = useState<string[]>(image_urls);
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

      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleGenerate();
        resetTextAreaHeight();
      } else if (
        (enterToSubmit && !e.shiftKey) ||
        (!enterToSubmit && (e.ctrlKey || e.shiftKey))
      ) {
        if (sticky) {
          e.preventDefault();
          handleGenerate();
          resetTextAreaHeight();
        } else {
          handleSave();
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    const updatedImages = [..._images, ...newImages];

    _setImages(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [..._images];
    updatedImages.splice(index, 1);

    _setImages(updatedImages);
  };

  const handleSave = () => {
    if (sticky && (_text === '' || useStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;

    const content: ContentInterface[] = [
      {
        type: 'text',
        text: _text,
      } as TextContentInterface,
      ..._images.map((image) => ({
        type: 'image_url',
        image_url: {
          url: image
        },
      } as ImageContentInterface)),
    ]

    if (sticky) {

      updatedMessages.push({ role: inputRole, content: content });
      _setText('');
      _setImages([]);
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = content;
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

    const content: ContentInterface[] = [
      {
        type: 'text',
        text: _text,
      } as TextContentInterface,
      ..._images.map((image) => ({
        type: 'image_url',
        image_url: {
          url: image
        },
      } as ImageContentInterface)),
    ]

    if (sticky) {

      if (_text !== '') {
        updatedMessages.push({ role: inputRole, content: content });
      }
      _setText('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = content;
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <>
      <div
        className={`w-full ${sticky
          ? 'py-2 md:py-3 px-2 md:px-4 border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
          : ''
          }`}
      >
        <textarea
          ref={textareaRef}
          className='m-0 resize-none rounded-lg bg-transparent overflow-y-hidden focus:ring-0 focus-visible:ring-0 leading-7 w-full placeholder:text-gray-500/40'
          onChange={(e) => {
            _setText(e.target.value);
          }}
          value={_text}
          placeholder={t('submitPlaceholder') as string}
          onKeyDown={handleKeyDown}
          rows={1}
        ></textarea>
      </div>
      <EditViewButtons
        sticky={sticky}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        handleGenerate={handleGenerate}
        handleSave={handleSave}
        setIsModalOpen={setIsModalOpen}
        setIsEdit={setIsEdit}
        _setContent={_setText}
        _images={_images}
      />
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

const EditViewButtons = memo(
  ({
    sticky = false,
    handleFileChange,
    handleRemoveImage,
    handleGenerate,
    handleSave,
    setIsModalOpen,
    setIsEdit,
    _setContent,
    _images
  }: {
    sticky?: boolean;
    handleFileChange: (e) => void;
    handleRemoveImage: (index: number) => void;
    handleGenerate: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    _setContent: React.Dispatch<React.SetStateAction<string>>;
    _images: string[];
  }) => {
    const { t } = useTranslation();
    const generating = useStore.getState().generating;
    const advancedMode = useStore((state) => state.advancedMode);
    const fileInputRef = useRef(null);

    const handleUploadButtonClick = () => {
      // Trigger the file input when the custom button is clicked
      fileInputRef.current.click();
    };

    return (
      <div>
        <div className='flex justify-center'>
        <button
            className='btn relative mr-2 btn-neutral'
            onClick={handleUploadButtonClick}
            aria-label={'Upload Images'}
          >
            <div className='flex items-center justify-center gap-2'>
              <FolderIcon />
            </div>
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />

          <div className="flex">
            {_images.map((image, index) => (
              <div key={index} className="image-container">
                <img src={image} alt={`uploaded-${index}`} className="mr-2 h-20" />
                <button
                  className="close-button"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove Image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      <div className='flex'>
        <div className='flex-1 text-center mt-2 flex justify-center'>
          {sticky && (
            <button
              className={`btn relative mr-2 btn-primary ${generating ? 'cursor-not-allowed opacity-40' : ''
                }`}
              onClick={handleGenerate}
              aria-label={t('generate') as string}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          {sticky || (
            <button
              className='btn relative mr-2 btn-primary'
              onClick={() => {
                !generating && setIsModalOpen(true);
              }}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('generate')}
              </div>
            </button>
          )}

          <button
            className={`btn relative mr-2 ${sticky
              ? `btn-neutral ${generating ? 'cursor-not-allowed opacity-40' : ''
              }`
              : 'btn-neutral'
              }`}
            onClick={handleSave}
            aria-label={t('save') as string}
          >
            <div className='flex items-center justify-center gap-2'>
              {t('save')}
            </div>
          </button>

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
      </div>
    );
  }
);

export default EditView;
