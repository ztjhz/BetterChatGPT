import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import { useAuth0 } from '@auth0/auth0-react';
import useStore from '@store/store';
import { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';

import QNALogo from '@logo/qnaLogo';
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useSwitchNetwork } from 'wagmi';
import {
  onConnect,
  onDisConnect,
  BSCClient,
  BSCConfig,
  bscConfigMap,
} from '@utils/bsc';
import { useWeb3Modal, useWeb3ModalEvents } from '@web3modal/react';
import { t } from 'i18next';
import { I18NSelector } from './i18nSelector';
import { RandomAvatar } from 'react-random-avatars';
import { QNADialog } from '@components/Dialog';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';
import { ToastContainer, toast } from 'react-toastify';
import mixpanel from 'mixpanel-browser';
import { formatWalletAddress } from '@utils/wallet';
import { CopyIcon } from '@components/CopyIcon';
import { switchNetwork } from '@wagmi/core';
import { connect } from '@wagmi/core';
import MetaMaskIcon from '@icon/MetaMaskIcon';
import WalletConnectIcon from '@icon/WalletConnectIcon';

interface TransparentHeaderProps {
  showLogo?: boolean;
  background?: string;
}

export const TransparentHeader = ({
  showLogo,
  background,
}: TransparentHeaderProps) => {
  let [isOpen, setIsOpen] = useState(false);
  const fetchCredit = useStore((state) => state.fetchCredit);
  const fetchUser = useStore((state) => state.fetchUser);
  let [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const { address, isConnected } = useAccount({
    onConnect: ({ address }) => {
      onConnect(address as string);
      fetchCredit();
      fetchUser();
      setIsOpen(false);
      mixpanel.track('connect', {
        address: address,
      });
    },
    onDisconnect: () => {
      onDisConnect();
    },
  });
  const { user, loginWithRedirect, logout, isLoading, isAuthenticated } =
    useAuth0();
  const credit = useStore((state) => state.credit);
  return (
    <>
      <div
        className={`flex w-full items-center justify-between bg-black p-1 px-4`}
      >
        <div>
          <Link to='/'>
            <QNALogo />
          </Link>
        </div>
        <div className='flex items-center gap-2'>
          <div>
            <I18NSelector />
          </div>
          <div className='flex justify-end py-4'>
            {user || isConnected ? (
              <>
                <div className='flex items-center overflow-hidden text-sm md:text-sm '>
                  <Link to='/user/credit'>
                    <div className='flex h-full items-center gap-x-2 px-2 py-2 md:px-4'>
                      <svg
                        width='17'
                        height='18'
                        viewBox='0 0 17 18'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M6.83518 6.52405C8.94331 6.52405 11.1358 6.06045 12.4526 5.17639V6.7857H13.6725V3.26211C13.6725 1.14377 10.1508 0 6.83729 0C3.52376 0 0 1.14377 0 3.26211V12.8793C0 14.9976 3.52165 16.1414 6.83518 16.1414V14.9236C3.35473 14.9236 1.21772 13.7325 1.21772 12.8794V9.9883C2.53458 10.8703 4.72511 11.336 6.83518 11.336V10.116C3.35473 10.116 1.21772 8.92499 1.21772 8.07192V5.17868C2.53458 6.06045 4.72722 6.52405 6.83518 6.52405ZM6.83518 1.2179C10.3158 1.2179 12.4526 2.40904 12.4526 3.26211C12.4526 4.11519 10.3156 5.30633 6.83518 5.30633C3.35473 5.30633 1.21772 4.11519 1.21772 3.26211C1.2179 2.40904 3.35684 1.2179 6.83518 1.2179ZM12.3001 7.19172C9.27309 7.19172 7.69036 8.3561 7.69036 9.50586V15.6859C7.69036 16.8356 9.27503 18 12.3001 18C15.3047 18 16.8851 16.8522 16.9098 15.7105H16.9119V9.50604C16.9098 8.3561 15.3272 7.19172 12.3001 7.19172ZM12.3001 8.40963C14.538 8.40963 15.692 9.17819 15.692 9.50586C15.692 9.83353 14.538 10.6021 12.3001 10.6021C10.0623 10.6021 8.90827 9.83353 8.90827 9.50586C8.90827 9.17819 10.0623 8.40963 12.3001 8.40963ZM12.3001 16.7821C10.0623 16.7821 8.90827 16.0135 8.90827 15.6859V14.2104C9.68105 14.6308 10.8166 14.9111 12.3001 14.9111C13.7837 14.9111 14.9171 14.631 15.692 14.2104V15.6859C15.692 16.0135 14.538 16.7821 12.3001 16.7821ZM12.3001 13.6911C10.0623 13.6911 8.90827 12.9224 8.90827 12.5949V11.1194C9.68105 11.5399 10.8166 11.82 12.3001 11.82C13.7837 11.82 14.9171 11.5399 15.692 11.1194V12.5949C15.692 12.9224 14.538 13.6911 12.3001 13.6911Z'
                          fill='white'
                        />
                      </svg>
                      <div className='text-white '>{credit}</div>
                    </div>
                  </Link>
                  <div
                    className='flex cursor-pointer items-center justify-center gap-2 rounded-lg p-2 hover:bg-bg-50'
                    onClick={() => setIsOpenUserMenu(true)}
                  >
                    <RandomAvatar size={18} />
                    <div className='hidden w-40 overflow-hidden text-ellipsis text-white md:block'>
                      {user?.email || formatWalletAddress(address as string)}
                    </div>
                  </div>
                </div>
              </>
            ) : isLoading ? (
              <div className='text-md rounded-full bg-primary p-1 px-4 text-white transition-all'>
                <div role='status'>
                  <svg
                    aria-hidden='true'
                    className='h-4 w-4 animate-spin fill-violet-600 text-white dark:text-white'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            ) : (
              <div className='flex'>
                <button
                  onClick={() => setIsOpen(true)}
                  className='text-md rounded-full bg-primary p-1 px-4 text-white transition-all'
                >
                  <span className='shrink-0'>
                    {t('signin', { ns: 'auth' })}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <SignInModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <UserMenu isOpen={isOpenUserMenu} setIsOpen={setIsOpenUserMenu} />
      <ToastContainer />
    </>
  );
};

const beforeConnect = async (connector: any) => {
  try {
    await BSCClient?.connectConnector(connector.id);
    await BSCClient.switchNetwork({
      chainId: bscConfigMap.chain.id,
    });
  } catch (e) {
    throw e;
  }
};

export const UserMenu = ({ isOpen, setIsOpen }: any) => {
  const { logout, isAuthenticated } = useAuth0();
  const user = useStore((state) => state.user);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { t } = useTranslation();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const iconMap: any = {
    MetaMask: MetaMaskIcon,
    WalletConnect: WalletConnectIcon,
  };
  return (
    <QNADialog isOpen={isOpen} onClose={() => setIsOpen(false)} title=''>
      <div className='flex flex-col gap-4 p-4'>
        <div
          hidden={!user}
          className='flex flex-col rounded-md bg-bg-100 p-4 text-txt-70'
        >
          <div className='mb-2 font-bold'>
            {t('internal_address', { ns: 'auth' })}
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-txt-100 overflow-hidden text-ellipsis'>
              {formatWalletAddress(user?.internal_address) ||
                t('internal_address_loading', { ns: 'auth' })}
            </div>
            <CopyIcon text={user?.internal_address} />
          </div>
        </div>
        {isConnected ? (
          <div
            hidden={!user}
            className='flex flex-col rounded-md bg-bg-100 p-4 text-txt-70'
          >
            <div className='mb-2 font-bold'>
              {t('external_address', { ns: 'auth' })}
            </div>
            <div className='flex items-center gap-2'>
              <div className='text-txt-100 overflow-hidden text-ellipsis'>
                {formatWalletAddress(address as string) ||
                  t('internal_address_loading', { ns: 'auth' })}
              </div>
              <CopyIcon text={address as string} />
            </div>
          </div>
        ) : (
          connectors.map((connector) => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              className='flex w-full flex-1 items-center justify-start gap-4 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none'
              onClick={async () => {
                await beforeConnect(connector);
                connect({ connector });
              }}
            >
              {iconMap[connector.name]({
                className: 'h-6 w-6',
              })}
              <div>
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </div>
            </button>
          ))
        )}
        <button
          className='flex w-full flex-1 items-center justify-center gap-2 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none'
          onClick={() => {
            if (isAuthenticated) {
              logout();
            }
            if (isConnected) {
              disconnect();
            }
            setIsOpen(false);
          }}
        >
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
              />
            </svg>
          </div>
          <span>{t('signout', { ns: 'auth' })}</span>
        </button>
      </div>
    </QNADialog>
  );
};

const web3Modal = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const iconMap: any = {
    MetaMask: MetaMaskIcon,
    WalletConnect: WalletConnectIcon,
  };
  return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          className='flex w-full flex-1 items-center justify-start gap-4 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none'
          onClick={async () => {
            await beforeConnect(connector);
            connect({ connector });
          }}
        >
          {iconMap[connector.name]({
            className: 'h-6 w-6',
          })}
          <div>
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </div>
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </>
  );
};

export const SignInModal = ({ isOpen, setIsOpen }: any) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <QNADialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={t('chooseWay', { ns: 'auth' })}
    >
      <div className='flex flex-col gap-4 p-4'>
        <button
          className='flex w-full flex-1 items-center justify-start gap-4 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none'
          onClick={() => {
            mixpanel.track('trigger_login_web2');
            loginWithRedirect();
          }}
        >
          <div>
            <svg
              width='24'
              height='25'
              viewBox='0 0 24 25'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M3.15 3C2.23873 3 1.5 3.73873 1.5 4.65V21.15C1.5 22.0613 2.23873 22.8 3.15 22.8H21.85C22.7613 22.8 23.5 22.0613 23.5 21.15V4.65C23.5 3.73873 22.7613 3 21.85 3H3.15ZM3.7 20.6V5.2H21.3V20.6H3.7ZM5.97613 8.14558L12.5 12.6621L19.0239 8.14558L20.2761 9.9544L13.4392 14.6877C12.8742 15.0788 12.1258 15.0788 11.5608 14.6877L4.72386 9.9544L5.97613 8.14558Z'
                fill='#F3BD3B'
              />
            </svg>
          </div>
          <span>{t('username&password', { ns: 'auth' })}</span>
        </button>
        {web3Modal()}
      </div>
    </QNADialog>
  );
};
