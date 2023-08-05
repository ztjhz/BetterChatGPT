import { QNADialog } from '@components/Dialog';
import { InformationIcon } from '@icon/InfomationIcon';
import PlusIcon from '@icon/PlusIcon';
import useStore from '@store/store';
import { useEffect, useState } from 'react';
import CrystalIcon from '@icon/crystals.png';
import CoinIcon from '@icon/CoinIcon';
import CheckIcon from '@icon/CheckIcon';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useAuth0 } from '@auth0/auth0-react';
import { SignInModal, UserMenu } from '@components/Header/transparent';
import { track } from '@utils/track';
import ChevronDownIcon from '@icon/chevronDownIcon';

export const CheckInModal = () => {
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const getCheckinStatus = useStore((state) => state.getCheckinStatus);
  const checkinStatus = useStore((state) => state.checkinStatus);
  const { t } = useTranslation();
  const { user } = useAuth0();
  const walletToken = useStore((state) => state.wallet_token);

  const notBindWallet = user && !walletToken;
  useEffect(() => {
    getCheckinStatus();
  }, [1]);

  const renderF6 = (ind: number) => {
    const isDone = checkinStatus?.check_in_day
      ? checkinStatus?.check_in_day > ind
      : false;
    const isCurrentDay = checkinStatus?.check_in_day === ind;
    const styleMap = isDone
      ? {
          color: 'lime',
          gradient: 'bg-gradient-to-b from-lime-400 to-lime-600',
        }
      : {
          color: 'violet',
          gradient: 'bg-gradient-to-b from-violet-500 to-purple-500',
        };
    return (
      <div
        className={`relative flex flex-col overflow-hidden rounded-lg border ${
          isCurrentDay ? 'border-2 border-violet-100' : ''
        } border-${styleMap.color}-400  bg-opacity-20 ${
          styleMap.gradient
        } pt-4`}
      >
        <div className='flex-1'>
          <div className='mb-2 flex items-center justify-center'>
            <img src={CrystalIcon} className='w-12' />
          </div>
          <div className='px-2'>
            <div className='relative w-full rounded-full bg-slate-700 bg-opacity-40 text-center text-xs text-white'>
              <div
                className='absolute'
                style={{
                  top: '-2px',
                  left: '-2px',
                }}
              >
                <CoinIcon className='h-5 w-5' />
              </div>
              <div
                className='ml-3'
                style={{
                  fontFamily: 'RussoOne',
                }}
              >
                +{2 * ind + 10}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex items-center justify-center  bg-${styleMap.color}-700 mt-1 py-1 text-sm text-white`}
        >
          {isDone ? (
            <CheckIcon className={`h-5 w-5 text-lime-200 `} />
          ) : (
            <div
              style={{
                fontFamily: 'RussoOne',
              }}
            >
              Day {ind + 1}
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderLastDay = () => {
    const isDone = checkinStatus?.check_in_day === 7;
    const styleMap = isDone
      ? {
          color: 'lime',
          gradient: 'bg-gradient-to-b from-lime-400 to-lime-600',
        }
      : {
          color: 'violet',
          gradient: 'bg-gradient-to-b from-violet-500 to-purple-500',
        };
    return (
      <div
        className={`relative m-4 mt-0 flex overflow-hidden rounded-lg border border-violet-400 bg-opacity-20 ${styleMap.gradient} justify-between p-4 py-2`}
      >
        <div
          className='flex items-center justify-center text-sm text-white'
          style={{
            fontFamily: 'RussoOne',
          }}
        >
          {isDone ? (
            <CheckIcon className={`h-12 w-12 text-lime-200 `} />
          ) : (
            <div
              className='text-2xl'
              style={{
                fontFamily: 'RussoOne',
              }}
            >
              Day 7
            </div>
          )}
        </div>

        <div>
          <div className='mb-2 flex items-center justify-center'>
            <img src={CrystalIcon} className='w-12 md:w-36' />
          </div>
          <div className='px-2'>
            <div className='relative w-full rounded-full bg-slate-700 bg-opacity-40 text-center text-xs text-white'>
              <div
                className='absolute'
                style={{
                  top: '-4px',
                  left: '-4px',
                }}
              >
                <CoinIcon className='h-8 w-8' />
              </div>
              <div className='px-4'>
                <div
                  className='ml-3 text-xl'
                  style={{
                    fontFamily: 'RussoOne',
                  }}
                >
                  +72
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderConnectButton = () => {
    return (
      <div className='shrink-0'>
        <button
          className='rounded-full bg-indigo-900 py-2 px-4 text-xs font-bold text-white hover:bg-indigo-800'
          onClick={() => {
            if (user) {
              return setOpenUserMenu(true);
            }
            setOpenLogin(true);
          }}
        >
          {t('wallet_connect', { ns: 'auth' })}
        </button>
      </div>
    );
  };
  return (
    <>
      <div
        className='flex cursor-pointer items-center justify-between gap-2 rounded-md rounded-tl-none rounded-tr-none border border-t-0 border-bg-200 bg-indigo-800 p-2 text-sm text-white hover:bg-indigo-900'
        onClick={() => {
          if (!user && !walletToken) {
            return setOpenLogin(true);
          }

          if (notBindWallet) {
            return setOpenUserMenu(true);
          }

          setOpen(true);

          track('mobile_open_checkin_dialog');
        }}
      >
        <div className='flex items-center gap-2'>
          <div>✨</div>
          <div className='flex items-center gap-2'>
            {t('activities.title', { ns: 'credit' })}:{' '}
            {!!walletToken
              ? `${checkinStatus.today_count}/3`
              : renderConnectButton()}
          </div>
        </div>
        <div className={walletToken ? '' : 'hidden'}>
          <ChevronDownIcon className='h-4 w-4' />
        </div>
      </div>
      <SignInModal
        isOpen={openLogin}
        setIsOpen={setOpenLogin}
        buttons={['web3']}
      />
      <UserMenu isOpen={openUserMenu} setIsOpen={setOpenUserMenu} />
      <QNADialog
        isOpen={open}
        onClose={() => setOpen(false)}
        title={t('activities.title', { ns: 'credit' })}
        dialogClassName='md:max-w-xl'
      >
        <div>
          <div className='flex flex-col md:flex-row'>
            <div className='grid flex-1 grid-cols-3 gap-2 p-4 md:pr-2'>
              {[0, 1, 2, 3, 4, 5].map(renderF6)}
            </div>
            {renderLastDay()}
          </div>
          <div className='flex items-center justify-between border-t border-t-gray-700 p-4 py-2 text-sm text-white'>
            <div>
              ✨ {t('activities.state', { ns: 'credit' })}
              {checkinStatus.today_count}/3
            </div>
            <Link to='/user/credit' className='shrink-0'>
              <div className='rounded-full border p-2 py-1 text-sm'>
                {t('claim_link', { ns: 'credit' })}
              </div>
            </Link>
          </div>
        </div>
      </QNADialog>
    </>
  );
};
