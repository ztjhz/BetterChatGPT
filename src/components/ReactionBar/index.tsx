import { t } from 'i18next';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon';
import HandThumbDownIcon from '@heroicons/react/24/outline/HandThumbDownIcon';
import { request } from '@api/request';
import { toast } from 'react-toastify';
import { useState } from 'react';

interface ReactionBarProps {
  funcDefination: any;
  response: any;
  status: string;
  searchText: string;
}
export const ReactionBar = ({
  searchText,
  funcDefination: item,
  response,
  status,
}: ReactionBarProps) => {
  const [voteType, setVoteType] = useState<any>({});

  const onVote = async (type: string, func: string, content: string) => {
    try {
      const votePromise = request.post('/search/vote', {
        vote_type: type,
        question: searchText,
        answer: JSON.stringify({
          [func]: content,
        }),
      });
      setVoteType({
        ...voteType,
        [func]: type,
      });
      toast.success(t('voteSuccess') as string);
      // toast.promise(votePromise, {
      //   pending: 'Voting...',
      //   success: t('voteSuccess') as string,
      //   error: t('voteSuccess') as string,
      // });
    } catch {
      toast.success(t('voteSuccess') as string);
      // toast.error(t('voteFailed'))
    }
  };

  const renderVoteButton = (func: string, content: string) => {
    return (
      <div className='flex justify-end gap-4'>
        <button onClick={() => onVote('upvote', func, content)}>
          <HandThumbUpIcon
            className={`h-6 w-6 text-transparent ${
              voteType[func] === 'upvote' ? 'fill-emerald-500' : 'fill-white'
            }`}
          />
        </button>
        <button onClick={() => onVote('downvote', func, content)}>
          <HandThumbDownIcon
            className={`h-6text-transparent w-6 ${
              voteType[func] === 'downvote' ? 'fill-emerald-500' : 'fill-white'
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`mt-4 flex items-center justify-between rounded-lg bg-bg-80 p-4 transition-all ${
        response ? '' : 'hidden'
      }`}
    >
      <div className='flex text-sm text-txt-70' role='alert'>
        <div>
          <span className='font-medium'>{t('voteTip.title')}</span>{' '}
          {t('voteTip.content')}
        </div>
      </div>
      {renderVoteButton(item.name, response)}
    </div>
  );
};
