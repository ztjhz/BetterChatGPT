import { TransparentHeader, web3Modal } from '@components/Header/transparent';
import { ClaimList } from './claimList';
import { useTranslation } from 'react-i18next';
import { InternalWallet } from '@components/Wallet/internal';
import { ExternalWallet } from '@components/Wallet/external';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';

export const CreditPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='flex min-h-full w-full flex-col bg-gray-1000'>
      <div>
        <TransparentHeader />
      </div>
      <div className='m-auto h-full w-full max-w-3xl flex-1 flex-col p-4 md:max-w-3xl md:px-4 lg:max-w-3xl xl:max-w-5xl'>
        <div className='mb-4 flex items-center gap-2 font-bold text-white'>
          <ChevronLeftIcon
            className='h-7 w-7 cursor-pointer'
            onClick={() => navigate(-1)}
          />
          {t('my_credit', { ns: 'credit' })}
        </div>
        <div className='mb-4 flex flex-col gap-4 md:flex-row'>
          <InternalWallet />
          <ExternalWallet />
        </div>
        <ClaimList />
      </div>
    </div>
  );
};
