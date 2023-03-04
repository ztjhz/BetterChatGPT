import React from 'react';

import CrossIcon2 from '@icon/CrossIcon2';

const PopupModal = ({
  title = 'Information',
  message,
  setIsModalOpen,
  handleConfirm,
  handleClose,
  children,
}: {
  title?: string;
  message?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirm: () => void;
  handleClose?: () => void;
  children?: React.ReactElement;
}) => {
  const _handleClose = () => {
    handleClose && handleClose();
    setIsModalOpen(false);
  };

  return (
    <div className='fixed top-0 left-0 z-[999] w-full p-4 overflow-x-hidden overflow-y-auto h-full flex justify-center items-center bg-gray-800/90'>
      <div className='relative w-full h-full max-w-2xl md:h-auto'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600'>
            <h3 className='ml-2 text-lg font-semibold text-gray-900 dark:text-white'>
              {title}
            </h3>
            <button
              type='button'
              className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
              onClick={_handleClose}
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
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              type='button'
              className='btn btn-neutral'
              onClick={_handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
