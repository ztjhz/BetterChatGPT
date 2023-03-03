import React from 'react';

const DownArrow = () => {
  return (
    <svg
      stroke='currentColor'
      fill='none'
      strokeWidth='2'
      viewBox='0 0 24 24'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-4 w-4 m-1'
      height='1em'
      width='1em'
      xmlns='http://www.w3.org/2000/svg'
    >
      <line x1='12' y1='5' x2='12' y2='19'></line>
      <polyline points='19 12 12 19 5 12'></polyline>
    </svg>
  );
};

export default DownArrow;
