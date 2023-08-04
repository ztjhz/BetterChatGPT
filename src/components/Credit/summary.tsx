import { useAuth0 } from '@auth0/auth0-react';
import { ExternalWallet } from '@components/Wallet/external';
import { InternalWallet } from '@components/Wallet/internal';
import useStore from '@store/store';
import { track } from '@utils/track';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

export const CreditSummary = () => {
  const claimHistory = useStore((state) => state.claimHistory);
  const shouldShowNew = claimHistory.some((item) => !item.claimed);
  const navigate = useNavigate();
  const walletToken = useStore((state) => state.wallet_token);
  const { user } = useAuth0();

  const { t } = useTranslation();
  return (
    <div className='mb-4 hidden w-full flex-col gap-4 rounded-lg bg-bg-50 p-4 md:flex'>
      <div>
        <div className='font-bold text-white'>
          {t('my_credit', { ns: 'credit' })}
        </div>
      </div>
      <InternalWallet />
      <div className='relative z-0'>
        {shouldShowNew && walletToken && (
          <span
            onClick={() => {
              track('click_credit_badge');
              navigate('/user/credit');
            }}
            className='absolute top-5 right-1 z-20 mr-2 animate-pulse cursor-pointer rounded-full bg-red-800 px-2.5 py-0.5 text-xs font-medium text-red-100 duration-1000 '
          >
            New
          </span>
        )}
        <div className='relative z-10'>
          <ExternalWallet />
        </div>
        {(user || walletToken) && (
          <Link to='/user/credit'>
            <button className='mt-4 w-full rounded-md bg-violet-600 py-2 px-4 text-sm font-bold text-white hover:bg-indigo-800'>
              {t('my_credit_detail')}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
