import React from 'react';
import SpinnerIcon from '@icon/SpinnerIcon';

const LoadingScreen = () => {
  return (
    <div className='w-full h-full flex justify-center items-center bg-gray-800 text-gray-100'>
      <SpinnerIcon className='inline w-12 h-12 text-gray-400 fill-green-500/60 animate-spin' />
    </div>
  );
};

export default LoadingScreen;
