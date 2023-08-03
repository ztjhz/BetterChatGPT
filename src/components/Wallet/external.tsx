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
import { Link } from 'react-router-dom';

export const ExternalWallet = () => {
  const { address } = useAccount();
  const { t } = useTranslation();
  const walletToken = useStore((state) => state.wallet_token);

  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const { data: contractBalance } = useContractRead({
    address: bscConfigMap.contractAddress as any,
    abi: VoteABI,
    functionName: 'getCredit',
    args: [address],
  });

  const LoginEle = web3Modal();
  return (
    <div className='relative rounded-md bg-gradient-to-r from-violet-400 to-fuchsia-400 p-4 md:flex-1'>
      <div className='mb-2 flex items-center  gap-2'>
        <p className='text-md text-left font-bold text-white'>
          {t('external_wallet', { ns: 'credit' })}
        </p>
        <InformationIcon
          className='h-4 w-4 cursor-pointer text-white'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsWalletDialogOpen(true);
          }}
        />
      </div>
      <div className='flex items-center justify-between'>
        {walletToken ? (
          <>
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
          </>
        ) : (
          <>
            <div>
              <div className='flex gap-2 md:flex-wrap'>{LoginEle}</div>
              <div className='mt-4 flex justify-end text-xs'>
                <Link
                  to={`/search/${encodeURIComponent(
                    t('create_wallet_question') as string
                  )}`}
                  className='text-white'
                >
                  {t('have_no_wallet')}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
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
  );
};
