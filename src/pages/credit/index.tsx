import { TransparentHeader, web3Modal } from '@components/Header/transparent';
import { ClaimList } from './claimList';
import { useTranslation } from 'react-i18next';
import { InternalWallet } from '@components/Wallet/internal';
import { ExternalWallet } from '@components/Wallet/external';

export const CreditPage = () => {
  const { t, i18n } = useTranslation();

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
          <InternalWallet />
          <ExternalWallet />
        </div>
        <ClaimList />
      </div>
    </div>
  );
};
