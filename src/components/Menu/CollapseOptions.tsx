import { css } from '@emotion/css';
import ArrowBottom from '@icon/ArrowBottom';
import React, { memo } from 'react';

const style = css`
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
  }

  .border-b {
    width: 100%;
    flex: 1;
  }

  .x5 {
    padding: 0 5px;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .fold {
    transform: rotate(180deg);
  }
`;

const CollapseOptions = memo((props: { onSetFold: Function; fold: boolean }) => {

  return (
    <div className={ style }>
      <div className='border-b border-white/20'></div>
      <div className={ 'bg-gray-900 hover:bg-gray-500/10 transition-colors duration-200 x5 ' + (props.fold ? 'fold' : '') }
           onClick={ () => props.onSetFold(!props.fold) }>
        <ArrowBottom />
      </div>
      <div className='border-b border-white/20'></div>
    </div>
  );
});

export default CollapseOptions;
