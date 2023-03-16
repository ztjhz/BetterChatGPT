import ArrowBottom from '@icon/ArrowBottom';
import React, { memo } from 'react';

const CollapseOptions = memo((props: { onSetFold: Function; fold: boolean }) => {
  return (
    <div className='flex items-center'>
      <div className='border-b border-white/20 flex-1'></div>
      <div className='fill-white hover:fill-gray-500/60 transition-colors duration-200 px-3 rounded-sm cursor-pointer'
           style={ { transform: props.fold ? 'rotate(180deg)' : '' } }
           onClick={ () => props.onSetFold(!props.fold) }>
        <ArrowBottom />
      </div>
      <div className='border-b border-white/20 flex-1'></div>
    </div>
  );
});

export default CollapseOptions;
