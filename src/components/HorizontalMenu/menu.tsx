import React from 'react'
import TextColorLogo from '@logo/textColor'
import TextColorLogoDark from '@logo/textColorDark'
import useStore from '@store/store';

export default () => {
  const theme = useStore((state) => state.theme);
  return (
    <div className="m-auto md:max-w-4xl lg:max-w-4xl xl:max-w-5xl flex">
      <div className="w-full h-12 ml-2 flex items-end">
        {theme === 'dark' ? <TextColorLogoDark className="h-12"/> : <TextColorLogo className="h-12"/>}
        <div className="text-xs border border-violet-600 rounded-full px-1 text-violet-600 mb-3 scale-75 -ml-2">ALPHA</div>
      </div>
    </div>
    
  )
}