import ArrowBottom from '@icon/ArrowBottom';
import useStore from '@store/store';
import { memo } from 'react';

const CollapseOptions = memo(() => {
  const setHideMenuOptions = useStore((state) => state.setHideMenuOptions);
  const hideMenuOptions = useStore((state) => state.hideMenuOptions);
  return (
    <div className='flex items-center'>
      <div className='border-b border-white/20 flex-1'></div>
      <div
        className='fill-white hover:fill-gray-500/60 transition-colors duration-200 px-3 rounded-sm cursor-pointer'
        style={{ transform: hideMenuOptions ? 'rotate(180deg)' : '' }}
        onClick={() => setHideMenuOptions(!hideMenuOptions)}
      >
        <ArrowBottom />
      </div>
      <div className='border-b border-white/20 flex-1'></div>
    </div>
  );
});

export default CollapseOptions;
