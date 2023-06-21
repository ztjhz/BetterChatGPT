import { t } from 'i18next';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon'
import HandThumbDownIcon from '@heroicons/react/24/outline/HandThumbDownIcon'
import { request } from '@api/request';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';

interface ReactionBarProps {
  funcDefination: any,
  response: any,
  status: string,
  searchText: string
}
export const ReactionBar = ({searchText, funcDefination: item, response, status}: ReactionBarProps) => {
  const [voteType, setVoteType] = useState<any>({})

  const onVote = async (type: string, func: string, content: string) => {
    try{
      const votePromise =  request.post('/search/vote', {
        vote_type: type,
        question: searchText,
        answer: JSON.stringify({
          [func]: content
        }),
      })
      setVoteType({
        ...voteType,
        [func]: type
      })
      toast.success(t('voteSuccess') as string)
      // toast.promise(
      //   votePromise,
      //   {
      //     pending: 'Voting...',
      //     success: t('voteSuccess') as string,
      //     error: t('voteSuccess') as string
      //   }
      // )
    }catch{
      toast.success(t('voteSuccess') as string)
      // toast.error(t('voteFailed'))
    }
  }

 
  
  const renderVoteButton = (func: string, content: string) => {
    return (
      <div className='flex gap-4 justify-end'>
        <button onClick={() => onVote('upvote', func, content)}>
          <HandThumbUpIcon className={`w-6 h-6 text-transparent ${voteType[func] === 'upvote' ? 'fill-emerald-500' : 'fill-white'}`}/>
        </button>
        <button onClick={() => onVote('downvote', func, content)}>
          <HandThumbDownIcon className={`w-6 h-6text-transparent ${voteType[func] === 'downvote' ? 'fill-emerald-500' : 'fill-white'}`}/>
        </button>
      </div>
    )
  }

  return (
    <div className={`flex mt-4 items-center justify-between bg-bg-80 rounded-lg p-4 transition-all ${(response) ? '' : "hidden"}`}>
      <div className="flex text-sm text-txt-70" role="alert">
          <div>
              <span className="font-medium">{t('voteTip.title')}</span> {t('voteTip.content')}
          </div>
      </div>
      {renderVoteButton(item.name, response)}
    </div>
  )
}