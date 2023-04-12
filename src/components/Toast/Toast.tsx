import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

export type ToastStatus = 'success' | 'error' | 'warning';

const Toast = () => {
  const message = useStore((state) => state.toastMessage);
  const status = useStore((state) => state.toastStatus);
  const toastShow = useStore((state) => state.toastShow);
  const setToastShow = useStore((state) => state.setToastShow);

  const [timeoutID, setTimeoutID] = useState<number>();

  useEffect(() => {
    if (toastShow) {
      window.clearTimeout(timeoutID);

      const newTimeoutID = window.setTimeout(() => {
        setToastShow(false);
      }, 5000);

      setTimeoutID(newTimeoutID);
    }
  }, [toastShow, status, message]);

  return toastShow ? (
    <div
      className={`flex fixed right-5 bottom-5 z-[1000] items-center w-3/4 md:w-full max-w-xs p-4 mb-4 text-gray-500 dark:text-gray-400 rounded-lg shadow-md border border-gray-400/30 animate-bounce`}
      role='alert'
    >
      <StatusIcon status={status} />
      <div className='ml-3 text-sm font-normal'>{message}</div>
      <button
        type='button'
        className='ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
        aria-label='Close'
        onClick={() => {
          setToastShow(false);
        }}
      >
        <CloseIcon />
      </button>
    </div>
  ) : (
    <></>
  );
};

const StatusIcon = ({ status }: { status: ToastStatus }) => {
  const statusToIcon = {
    success: <CheckIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
  };
  return statusToIcon[status] || null;
};

const CloseIcon = () => (
  <>
    <span className='sr-only'>Close</span>
    <svg
      aria-hidden='true'
      className='w-5 h-5'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
        clipRule='evenodd'
      ></path>
    </svg>
  </>
);

const CheckIcon = () => (
  <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200'>
    <svg
      aria-hidden='true'
      className='w-5 h-5'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
        clipRule='evenodd'
      ></path>
    </svg>
    <span className='sr-only'>Check icon</span>
  </div>
);

const ErrorIcon = () => (
  <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'>
    <svg
      aria-hidden='true'
      className='w-5 h-5'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
        clipRule='evenodd'
      ></path>
    </svg>
    <span className='sr-only'>Error icon</span>
  </div>
);

const WarningIcon = () => (
  <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200'>
    <svg
      aria-hidden='true'
      className='w-5 h-5'
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
        clipRule='evenodd'
      ></path>
    </svg>
    <span className='sr-only'>Warning icon</span>
  </div>
);

export default Toast;
