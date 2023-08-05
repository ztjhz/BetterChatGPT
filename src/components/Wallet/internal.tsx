import { CopyIcon } from '@components/CopyIcon';
import { QNADialog } from '@components/Dialog';
import { TransparentHeader, web3Modal } from '@components/Header/transparent';
import { InformationIcon } from '@icon/InfomationIcon';
import useStore from '@store/store';
import { formatWalletAddress } from '@utils/wallet';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useContractRead } from 'wagmi';
import VoteABI from '@abi/QnaVote.json';
import { bscConfigMap } from '@utils/bsc';
import { useTranslation } from 'react-i18next';

export const InternalWallet = () => {
  const { address } = useAccount();
  const credit = useStore((state) => state.credit);
  const user = useStore((state) => state.user);
  const { t, i18n } = useTranslation();

  const [isCustodianDialogOpen, setIsCustodianDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const {
    data: contractBalance,
    error,
    isLoading,
  } = useContractRead({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'getCredit',
    args: [address],
  });

  return (
    <div className='rounded-md bg-gradient-to-b from-violet-500 to-violet-700 p-4 md:flex-1'>
      <div className='mb-2 flex items-center gap-2'>
        <p className='text-md text-left font-bold text-white'>
          {t('custodian_wallet', { ns: 'credit' })}
        </p>
        <InformationIcon
          className='h-4 w-4 cursor-pointer text-white'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsCustodianDialogOpen(true);
          }}
        />
      </div>
      <div className='flex items-center justify-between'>
        {user?.internal_address ? (
          <>
            <div className='flex items-center gap-2'>
              <p className='text-left text-sm text-white'>
                {formatWalletAddress(user?.internal_address as string)}
              </p>
              <CopyIcon
                text={user?.internal_address as string}
                className='h-4 w-4 cursor-pointer text-white'
              />
            </div>
            <div>
              <p className='text-left text-sm text-white'>
                <strong className='text-lg'>{credit}</strong>{' '}
                {t('credits', { ns: 'credit' })}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className='text-sm text-white'>
              {t('internal_address_loading', { ns: 'auth' })}
            </div>
          </>
        )}
      </div>
      <QNADialog
        isOpen={isCustodianDialogOpen}
        onClose={() => setIsCustodianDialogOpen(false)}
        title={t('custodian_tips.title', { ns: 'credit' })}
      >
        <div className='p-4 pb-6 text-white'>
          <ul className='flex flex-col gap-2 text-sm'>
            {t('custodian_tips.description', { ns: 'credit' })
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
