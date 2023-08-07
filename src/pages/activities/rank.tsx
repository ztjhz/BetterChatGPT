import { QNADialog } from '@components/Dialog';
import useStore from '@store/store';
import { bscConfigMap, checkNetwork } from '@utils/bsc';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import VoteABI from '@abi/QnaVote.json';
import { toast } from 'react-toastify';
import { web3Modal } from '@components/Header/transparent';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { track } from '@utils/track';
import { request } from '@api/request';

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
  const rewardList = ['10,000', '5,000', '1,000'];
  const colorList = ['red', 'yellow', 'gray'];
  const { t } = useTranslation();
  const [voting, setVoting] = useState(false);
  const { address } = useAccount();
  const wallet_token = useStore((state) => state.wallet_token);
  const { data: contractBalance } = useContractRead({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'getCredit',
    args: [address],
  });
  const { writeAsync } = useContractWrite({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'vote',
  });
  const unvotable =
    moment().isBefore(moment(startAt)) ||
    moment().isAfter(moment(endAt)) ||
    !activityStatus;
  let unvotableButtonText = t('voteNotStart', { ns: 'vote' });
  if (moment().isBefore(moment(startAt))) {
    unvotableButtonText = t('voteNotStart', { ns: 'vote' });
  }
  if (moment().isAfter(moment(endAt))) {
    unvotableButtonText = t('voteEnd', { ns: 'vote' });
  }

  const onVote = async () => {
    console.log(wallet_token);

    if (unvotable) return;
    if (!wallet_token) {
      onOpenLogin();
      track('click_vote_not_login');
      return;
    }
    if (voting) return;
    if ((contractBalance as bigint) < 5) {
      toast.error(t('voteNotEnoughTip', { ns: 'vote' }));
      track('vote_credit_not_enough');
      return;
    }
    setVoting(true);
    try {
      track('click_vote');
      await checkNetwork();
      const { hash } = await writeAsync({
        value: BigInt(0),
        args: [activityID, questionID, 5],
      });
      await request.post('/activity/vote', {
        activityId: activityID,
        qsId: questionID,
        hash: hash,
      });
      callback();
      setVoting(false);
      track('voted');
      toast.success(t('voteSuccess', { ns: 'vote' }));
    } catch (e) {
      console.log(e);
      setVoting(false);
    }
  };
  const renderQuestionStatus = () => {
    return (
      <div className='flex gap-2'>
        <div className='rounded bg-indigo-200 px-2.5 py-0.5 text-xs font-medium text-indigo-800'>
          {score} {t('votes', { ns: 'credit' })}
        </div>
        {rank <= 3 && (
          <div
            className={`rounded bg-${
              colorList[rank - 1]
            }-800 flex px-2.5 py-0.5 text-xs font-medium text-white`}
          >
            <span className='hidden md:block'>
              {t('credits_pool', { ns: 'credit' })}：
            </span>
            <span>
              {rewardList[rank - 1]} {t('credits', { ns: 'credit' })}
            </span>
          </div>
        )}
      </div>
    );
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
        <div className='flex flex-col gap-2'>
          <Link
            to={`/search/${encodeURIComponent(question)}`}
            className='text-white'
          >
            <div className='text-md font-bold underline'>{question}</div>
          </Link>
          <div className='hidden md:block'>{renderQuestionStatus()}</div>
        </div>
      </div>
      <div className='mt-1 flex w-full shrink-0 justify-between gap-2 self-end md:mt-0 md:max-w-fit md:self-center'>
        <div className='ml-10 block md:hidden'>{renderQuestionStatus()}</div>
        {!unvotable ? (
          <div
            onClick={() => onVote()}
            className='flex shrink-0 gap-2 rounded-full bg-indigo-600 p-3 py-1 text-sm hover:bg-indigo-700 '
          >
            <div>🔥</div>
            <div className='cursor-pointer font-bold'>
              {voting ? '...' : `${t('vote', { ns: 'vote' })}`}
            </div>
          </div>
        ) : (
          <div className='flex shrink-0 cursor-default gap-2 rounded-full bg-gray-600 p-2 py-1 text-xs  text-gray-400 '>
            {unvotableButtonText}
          </div>
        )}
      </div>
    </div>
  );
};

export const RankPage = () => {
  const [openRules, setOpenRules] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const getCurrentActivity = useStore((state) => state.getCurrentActivity);
  const currentActivity = useStore((state) => state.currentActivity);
  const loadingCurrentActivity = useStore(
    (state) => state.loadingCurrentActivity
  );
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
    <div className='flex flex-col gap-2  rounded-none bg-bg-50 p-4 text-white md:rounded-lg'>
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
      </div>
      {loadingCurrentActivity ? (
        <div role='status' className='w-full flex-1 animate-pulse'>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
          <div className='mb-4 h-4 bg-gray-800'></div>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {currentActivity?.activity?.questions?.map((question, index) => {
            return (
              <RankItem
                rank={index + 1}
                score={question.vote_num}
                question={question.query}
                activityStatus={currentActivity?.activity?.active}
                activityID={currentActivity?.id}
                startAt={currentActivity?.activity?.start_at}
                endAt={currentActivity?.activity?.end_at}
                questionID={question.qs_id}
                callback={getCurrentActivity}
                onOpenLogin={() => setOpenLogin(true)}
              />
            );
          })}
        </div>
      )}

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
            <Trans
              i18nKey='rules' // optional -> fallbacks to defaults if not provided
              ns='vote' // optional -> fallbacks to defaultNS value if not provided
              components={{ div: <div />, li: <li />, strong: <strong /> }}
            />
          </ul>
        </div>
      </QNADialog>
    </div>
  );
};
