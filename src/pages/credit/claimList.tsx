import { request } from '@api/request';
import useStore from '@store/store';
import { bscConfigMap, checkNetwork } from '@utils/bsc';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useContractWrite, useSwitchNetwork } from 'wagmi';
import VoteABI from '@abi/QnaVote.json';
import { UserMenu } from '@components/Header/transparent';
import { toast } from 'react-toastify';
import { track } from '@utils/track';
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from '@wagmi/core';

interface ClaimItemProps {
  data: ClaimItem;
  onClaimed: () => void;
}

interface ClaimItem {
  id: number;
  user_id: string;
  typ: string;
  sign_day: number;
  sign_in_id: number;
  score: number;
  extra: any | null;
  claimed: boolean;
  created_at: Date;
}
export const ClaimItem = ({ data: item, onClaimed }: ClaimItemProps) => {
  const available = !item.claimed;
  const { t, i18n } = useTranslation();
  const [claiming, setClaiming] = useState(false);
  const wallet_token = useStore((state) => state.wallet_token);
  const [openLoginModal, setLoginModal] = useState(false);
  const extra = i18n.language === 'en' ? item?.extra?.en : item?.extra?.zh;
  const title = extra?.title;
  const desc = extra?.description;
  const { address } = useAccount();
  const { writeAsync } = useContractWrite({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'claimCredit',
  });

  const claimCredit = async (id: number) => {
    if (claiming) return;
    if (!wallet_token) {
      setLoginModal(true);
      return;
    }
    setClaiming(true);
    track('click_claim');
    const { data } = await request.post('/credit/my/claim', { id });
    const amount = data?.data?.amount;
    const signature = data?.data?.signature;
    try {
      await checkNetwork();
      await writeAsync({
        value: BigInt(0),
        args: [amount, signature?.nonce, signature?.signature],
      });
      await request.put(`/credit/my/claim/${id}`);
      onClaimed();
      setClaiming(false);
      track('claimed');
      // TODO: Check transaction
      // waitForTransaction({
      //   hash,
      // })
      //   .then(async (data) => {
      //     console.log('data, ', data);
      //     if(data.status === 'success') {

      //     }

      //   })
      //   .catch((e) => {
      //     console.log(e);
      //     track('claim_failed');
      //   });
    } catch (e) {
      console.log(e);
      setClaiming(false);
    }
  };

  return (
    <div
      className={`
    flex flex-col rounded-lg bg-gradient-to-b text-sm  text-gray-50 md:flex-row md:items-center md:justify-between
    ${available ? 'from-indigo-400 to-indigo-500' : 'from-gray-800 to-gray-900'}
    `}
    >
      <div className='p-4 pb-0 md:pb-4'>
        <p className='mb-2 font-bold'>{title}</p>
        <p>{desc}</p>
      </div>
      <div className='p-4'>
        <div
          className={`
           rounded-lg  p-2 text-center font-bold text-black ${
             available
               ? 'cursor-pointer bg-indigo-200 hover:bg-indigo-300'
               : 'cursor-default bg-gray-500'
           }
        `}
          onClick={() => {
            if (available) {
              claimCredit(item.id);
            }
          }}
        >
          {available
            ? claiming
              ? 'claiming...'
              : `${t('claim', { ns: 'credit' })} ${item.score} ${t('credits', {
                  ns: 'credit',
                })}`
            : `${t('claimed', { ns: 'credit' })} +${item.score}`}
        </div>
      </div>
      <UserMenu isOpen={openLoginModal} setIsOpen={setLoginModal} />
    </div>
  );
};

export const ClaimList = () => {
  const claimHistory = useStore((state) => state.claimHistory);
  const getClaimHistory = useStore((state) => state.fetchCreditClaimHistory);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getClaimHistory();
  }, [1]);
  return (
    <div>
      <div className='mb-4 font-bold text-white'>
        {t('credits_claim', { ns: 'credit' })}
      </div>
      <div className='flex flex-col gap-4'>
        {claimHistory?.map((claim) => (
          <ClaimItem data={claim} onClaimed={getClaimHistory} />
        ))}
      </div>
    </div>
  );
};
