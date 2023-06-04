import React from 'react'
import Lottie from "lottie-react";
import checkIconData from './check-white.json'
import messageIconData from './dots-white.json'
import loadingIconData from './loading-white.json'
import { t } from 'i18next';
import NoIdeaIcon from '@icon/NoIdeaIcon';

const checkOptions = {
  loop: false,
  autoplay: true, 
  animationData: checkIconData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
const loadingOptions = {
  loop: true,
  autoplay: true, 
  animationData: loadingIconData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
const messageOptions = {
  loop: true,
  autoplay: true, 
  animationData: messageIconData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};
interface LoadingBlockProps {
  title: string;
  status: string;
  open?: boolean;
}
export const LoadingBlock = ({
  title,
  status,
  open = true
}: LoadingBlockProps) => {
  let lottieOptions: any = loadingOptions
  let loadingColor = ''
  let bgColor = ''
  switch (status) {
    case 'loading':
      lottieOptions = <Lottie {...loadingOptions} />
      loadingColor = 'bg-teal-400'
      bgColor = 'bg-teal-100'
      break;
    case 'done':
      lottieOptions = <Lottie {...checkOptions} />
      loadingColor = 'bg-emerald-500'
      bgColor = 'bg-emerald-100'
      break;
    case 'unUseful':
      lottieOptions = <NoIdeaIcon className="w-3 h-3" />
      loadingColor = 'bg-gray-400'
      bgColor = 'bg-gray-100'
      break;
    case 'message':
      lottieOptions = <Lottie {...messageOptions} />
      loadingColor = 'bg-yellow-800'
      bgColor = 'bg-yellow-100'
      break;
    default:
      lottieOptions = <Lottie {...loadingOptions} />
  }

  return (
    <div className={`flex border border-gray-100 items-center gap-x-2 transition-all ${open ? 'rounded-md p-2' : 'rounded-full p-1'}`}>
      <div className={`w-4 h-4 flex items-center justify-center ${loadingColor} rounded-full`}>
        <div className='w-3 h-3'>
          {lottieOptions}
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className={`text-xs rounded-full text-gray-900`}>
          {title}
        </div>
        <div className={`text-xs text-gray-300 ${!open && 'hidden'} transition-all`}>
          {t(`searchStatus.${status}`)}
        </div>
      </div>
    </div>
  )
}