import { CopyIcon } from '@components/CopyIcon';
import { QNADialog } from '@components/Dialog';
import { TransparentHeader } from '@components/Header/transparent';
import { InformationIcon } from '@icon/InfomationIcon';
import useStore from '@store/store';
import { formatWalletAddress } from '@utils/wallet';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ClaimList } from './claimList';
import { useContractRead } from 'wagmi';
import VoteABI from '@abi/QnaVote.json';
import { bscConfigMap } from '@utils/bsc';
import { useTranslation } from 'react-i18next';

export const CreditPage = () => {
  const { address } = useAccount();
  const credit = useStore((state) => state.credit);
  const user = useStore((state) => state.user);
  const { t, i18n } = useTranslation();

  const [isCustodianDialogOpen, setIsCustodianDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const { data: contractBalance } = useContractRead({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'getCredit',
    args: [address],
  });

  return (
    <div className='flex min-h-full w-full flex-col bg-gray-1000'>
      <div>
        <TransparentHeader />
      </div>
      <div className='m-auto h-full w-full max-w-3xl flex-1 flex-col p-4 md:max-w-3xl md:px-4 lg:max-w-3xl xl:max-w-5xl'>
        <div className='mb-4 font-bold text-white'>
          {t('my_credit', { ns: 'credit' })}
        </div>
        <div className='mb-4 flex flex-col gap-4 md:flex-row'>
          <div className='rounded-md bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <p className='text-md text-left font-bold text-white'>
                {t('custodian_wallet', { ns: 'credit' })}
              </p>
              <InformationIcon
                className='h-4 w-4 cursor-pointer text-white'
                onClick={() => setIsCustodianDialogOpen(true)}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <p className='text-left text-sm text-white'>
                  {formatWalletAddress(user?.internal_address as string)}
                </p>
                <CopyIcon
                  text={address as string}
                  className='h-4 w-4 cursor-pointer text-white'
                />
              </div>
              <div>
                <p className='text-left text-sm text-white'>
                  <strong className='text-lg'>{credit}</strong>{' '}
                  {t('credits', { ns: 'credit' })}
                </p>
              </div>
            </div>
          </div>
          <div className='relative rounded-md bg-gradient-to-r from-violet-400 to-fuchsia-400 p-4 md:flex-1'>
            <div className='mb-2 flex items-center  gap-2'>
              <p className='text-md text-left font-bold text-white'>
                {t('external_wallet', { ns: 'credit' })}
              </p>
              <InformationIcon
                className='h-4 w-4 cursor-pointer text-white'
                onClick={() => setIsWalletDialogOpen(true)}
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <p className='text-left text-sm text-white'>
                  {formatWalletAddress(address as string)}
                </p>
                <CopyIcon
                  text={address as string}
                  className='h-4 w-4 cursor-pointer text-white'
                />
              </div>
              <div>
                <p className='text-left text-sm text-white'>
                  <strong className='text-lg'>
                    {contractBalance?.toString() as string}
                  </strong>{' '}
                  {t('credits', { ns: 'credit' })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ClaimList />
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
        <QNADialog
          isOpen={isWalletDialogOpen}
          onClose={() => setIsWalletDialogOpen(false)}
          title={t('external_tips.title', { ns: 'credit' })}
        >
          <div className='p-4 pb-6 text-white'>
            <ul className='flex flex-col gap-2 text-sm'>
              {t('external_tips.description', { ns: 'credit' })
                .split('\n')
                .map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
            </ul>
          </div>
        </QNADialog>
      </div>
    </div>
  );
};
