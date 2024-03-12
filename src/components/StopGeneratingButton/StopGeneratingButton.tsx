import React from 'react';
import useStore from '@store/store';

const StopGeneratingButton = () => {
  const setGenerating = useStore((state) => state.setGenerating);
  const generating = useStore((state) => state.generating);

  return generating ? (
    // <div
    //   className='flex w-full  bottom-6 left-0 right-0 m-auto flex md:w-full md:m-auto gap-0 md:gap-2 justify-center'
    //   onClick={() => setGenerating(false)}
    // >
      <div className={`flex w-full z-0 justify-start`}>
        <button
          className='btn relative min-w-[12em] z-1000 justify-center items-center btn-neutral border-0 md:border'
          aria-label='stop generating' onClick={() => setGenerating(false)}
        >
            <svg
              stroke='currentColor'
              fill='none'
              strokeWidth='1.5'
              viewBox='0 0 24 24'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='h-3 w-3'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2'></rect>
            </svg>
            &nbsp;&nbsp;Stop generating
        </button>
      </div>
  ) : (
    <></>
  );
};

export default StopGeneratingButton;
