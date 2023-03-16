import ArrowBottom from '@icon/ArrowBottom';
import useStore from '@store/store';
import { memo } from 'react';

const CollapseOptions = memo(() => {
  const setFoldMenuOptions = useStore((state) => state.setFoldMenuOptions);
  const foldMenuOptions = useStore((state) => state.foldMenuOptions);
  return (
    <div className='flex items-center'>
      <div className='border-b border-white/20 flex-1'></div>
      <div className='fill-white hover:fill-gray-500/60 transition-colors duration-200 px-3 rounded-sm cursor-pointer'
           style={ { transform: foldMenuOptions ? 'rotate(180deg)' : '' } }
           onClick={ () => setFoldMenuOptions(!foldMenuOptions) }>
        <ArrowBottom />
      </div>
      <div className='border-b border-white/20 flex-1'></div>
    </div>
  );
});

export default CollapseOptions;
