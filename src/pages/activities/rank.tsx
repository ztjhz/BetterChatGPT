import { QNADialog } from '@components/Dialog';
import useStore from '@store/store';
import { bscConfigMap } from '@utils/bsc';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContractWrite } from 'wagmi';
import VoteABI from '@abi/QnaVote.json';
import { toast } from 'react-toastify';
import { web3Modal } from '@components/Header/transparent';
import { Link } from 'react-router-dom';
import moment from 'moment';

interface RankItemProps {
  rank: number;
  question: string;
  score: number;
  activityStatus: boolean;
  activityID: number;
  questionID: number;
  startAt: Date;
  endAt: Date;
  callback: () => void;
  onOpenLogin: () => void;
}
const RankItem = ({
  rank,
  question,
  score,
  activityID,
  questionID,
  activityStatus,
  startAt,
  endAt,
  callback,
  onOpenLogin,
}: RankItemProps) => {
  const rankText = ['🥇', '🥈', '🥉'];
  const { t } = useTranslation();
  const [voting, setVoting] = useState(false);
  const wallet_token = useStore((state) => state.wallet_token);
  const { writeAsync } = useContractWrite({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'vote',
  });
  let unvotableButtonText = t('voteNotStart', { ns: 'vote' });
  if (moment().isBefore(moment(startAt))) {
    unvotableButtonText = t('voteNotStart', { ns: 'vote' });
  }
  if (moment().isAfter(moment(endAt))) {
    unvotableButtonText = t('voteEnd', { ns: 'vote' });
  }

  const onVote = async () => {
    if (!activityStatus) return;
    if (!wallet_token) {
      onOpenLogin();
      return;
    }
    if (voting) return;
    setVoting(true);
    try {
      await writeAsync({
        value: BigInt(0),
        args: [activityID, questionID, 5],
      });
      callback();
      setVoting(false);
      toast.success(t('voteSuccess', { ns: 'vote' }));
    } catch (e) {
      setVoting(false);
    }
  };

  return (
    <div className='flex flex-col items-start justify-start gap-2 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <div
          className={`
          ${rank === 10 ? '-ml-2 text-3xl' : 'text-4xl'}
          ${rank <= 3 ? '-ml-2 w-8' : ''}
          text-center  font-bold text-gray-700
          `}
        >
          {rank <= 3 ? rankText[rank - 1] : rank}
        </div>
        <div className='flex flex-col'>
          <Link
            to={`/search/${encodeURIComponent(question)}`}
            className='text-white'
          >
            <div className='text-md font-bold underline'>{question}</div>
          </Link>
        </div>
      </div>
      {activityStatus ? (
        <div
          onClick={() => onVote()}
          className='mt-4 flex shrink-0 gap-2 self-end rounded-full bg-indigo-600 p-2 py-1 text-sm hover:bg-indigo-700 md:mt-0 md:self-center'
        >
          <div>🔥</div>
          <div className='cursor-pointer font-bold'>
            {voting ? '...' : `${t('vote', { ns: 'vote' })}(${score})`}
          </div>
        </div>
      ) : (
        <div className='mt-4 flex shrink-0 cursor-default gap-2 self-end rounded-full bg-gray-600 p-2 py-1 text-xs  text-gray-400 md:mt-0 md:self-center'>
          {unvotableButtonText}
        </div>
      )}
    </div>
  );
};

export const RankPage = () => {
  const [openRules, setOpenRules] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const getCurrentActivity = useStore((state) => state.getCurrentActivity);
  const currentActivity = useStore((state) => state.currentActivity);
  const { t } = useTranslation();
  const [openLogin, setOpenLogin] = useState(false);
  const LoginEle = web3Modal({
    afterConnect: () => {
      setOpenLogin(false);
    },
  });

  useEffect(() => {
    getCurrentActivity();
  }, [1]);

  return (
    <div className='flex flex-col gap-2 bg-bg-50 p-4 text-white'>
      <div
        hidden={!showTitle}
        className={`relative mb-2 flex flex-col overflow-hidden  rounded-lg bg-gradient-to-b from-pink-600 to-purple-500 p-4 text-sm text-gray-50`}
      >
        <div
          className='absolute left-0 top-1/4 z-0 opacity-10'
          style={{
            fontSize: '200px',
          }}
        >
          🔥
        </div>
        <div>
          <h3 className='z-1 relative mt-3 mb-3 text-xl font-extrabold tracking-tight text-white '>
            {t('title', { ns: 'vote' })}
          </h3>
          <div className='z-1 relative'>{t('description', { ns: 'vote' })}</div>
        </div>
        <div
          className='z-1 relative mt-4 max-w-fit cursor-pointer self-end rounded-full border p-2 py-1 md:self-start'
          onClick={() => setOpenRules(true)}
        >
          {t('rules_title', { ns: 'vote' })}
        </div>
        <div
          className='absolute right-2 top-2 cursor-pointer p-2'
          onClick={() => setShowTitle(false)}
        >
          <svg
            width='15'
            height='15'
            viewBox='0 0 11 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M4.55709 5.9999L0.314454 1.75726L1.25726 0.814453L5.4999 5.05709L9.74254 0.814453L10.6854 1.75726L6.44271 5.9999L10.6854 10.2425L9.74254 11.1854L5.4999 6.94271L1.25726 11.1854L0.314453 10.2425L4.55709 5.9999Z'
              fill='white'
            />
          </svg>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {currentActivity?.activity?.questions?.map((question, index) => {
          return (
            <RankItem
              rank={index + 1}
              score={question.vote_num}
              question={question.query}
              activityStatus={currentActivity?.activity?.actived}
              activityID={currentActivity?.id}
              startAt={currentActivity?.activity?.start_at}
              endAt={currentActivity?.activity?.end_at}
              questionID={question.id}
              callback={getCurrentActivity}
              onOpenLogin={() => setOpenLogin(true)}
            />
          );
        })}
      </div>
      <QNADialog
        isOpen={openLogin}
        onClose={() => setOpenLogin(false)}
        title={t('connect_tips', { ns: 'credit' })}
      >
        <div className=' p-4 '>
          <div className='flex flex-col gap-2 md:flex-row '>{LoginEle}</div>
          <div className='mt-4 flex justify-end text-xs'>
            <Link
              to={`/search/${encodeURIComponent(
                t('create_wallet_question') as string
              )}`}
              onClick={() => setOpenLogin(false)}
              className='text-white'
            >
              {t('have_no_wallet')}
            </Link>
          </div>
        </div>
      </QNADialog>
      <QNADialog
        isOpen={openRules}
        onClose={() => setOpenRules(false)}
        title={t('rules_title', { ns: 'vote' })}
      >
        <div className='p-4 pb-6 text-white'>
          <ul className='flex flex-col gap-2 text-sm'>
            {t('rules', { ns: 'vote' })
              .split('\n')
              .map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
          </ul>
        </div>
      </QNADialog>
    </div>
  );
};
