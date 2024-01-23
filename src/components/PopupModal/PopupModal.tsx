import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import CrossIcon2 from '@icon/CrossIcon2';

const PopupModal = ({
  title = 'Information',
  message,
  setIsModalOpen,
  handleConfirm,
  handleClose,
  handleClickBackdrop,
  cancelButton = true,
  children,
}: {
  title?: string;
  message?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm?: () => void;
  handleClose?: () => void;
  handleClickBackdrop?: () => void;
  cancelButton?: boolean;
  children?: React.ReactElement;
}) => {
  const modalRoot = document.getElementById('modal-root');
  const { t } = useTranslation();

  const _handleClose = () => {
    handleClose && handleClose();
    setIsModalOpen(false);
  };

  const _handleBackdropClose = () => {
    if (handleClickBackdrop) handleClickBackdrop();
    else _handleClose();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (handleClickBackdrop) handleClickBackdrop();
      else handleClose ? handleClose() : setIsModalOpen(false);
    } else if (event.key === 'Enter') {
      if (handleConfirm) handleConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (modalRoot) {
    return ReactDOM.createPortal(
      <div className='fixed top-0 left-0 z-[999] w-full p-4 overflow-x-hidden overflow-y-auto h-full flex justify-center items-center'>
        <div className='relative z-2 max-w-2xl md:h-auto flex justify-center max-h-full'>
          <div className='relative bg-gray-50 rounded-lg shadow dark:bg-gray-700 max-h-full overflow-y-auto hide-scroll-bar'>
            <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
              <h3 className='ml-2 text-lg font-semibold text-gray-900 dark:text-white'>
                {title}
              </h3>
              <button
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                onClick={_handleClose}
                aria-label='close modal'
              >
                <CrossIcon2 />
              </button>
            </div>

            {message && (
              <div className='p-6 border-b border-gray-200 dark:border-gray-600'>
                <div className='min-w-fit text-gray-900 dark:text-gray-300 text-sm mt-4'>
                  {message}
                </div>
              </div>
            )}

            {children}

            <div className='flex items-center justify-center p-6 gap-4'>
              {handleConfirm && (
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleConfirm}
                  aria-label='confirm'
                >
                  {t('confirm')}
                </button>
              )}
              {cancelButton && (
                <button
                  type='button'
                  className='btn btn-neutral'
                  onClick={_handleClose}
                  aria-label='cancel'
                >
                  {t('cancel')}
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className='bg-gray-800/90 absolute top-0 left-0 h-full w-full z-[-1]'
          onClick={_handleBackdropClose}
        />
      </div>,
      modalRoot
    );
  } else {
    return null;
  }
};

export default PopupModal;
