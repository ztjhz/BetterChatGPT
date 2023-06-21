import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'
import { useAuth0 } from "@auth0/auth0-react";
import useStore from '@store/store';
import { Fragment, useState } from 'react';
import Modal from 'react-modal';
import { WalletIcon, UserIcon } from '@heroicons/react/20/solid';
import QNALogo from '@logo/qnaLogo';
import { Link } from 'react-router-dom';
import { useAccount, useConnect, useTransaction } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'
import { onConnect, onDisConnect } from '@utils/bsc';
import { Web3Button, useWeb3Modal } from '@web3modal/react'
import { t } from 'i18next';
import { I18NSelector } from './i18nSelector';
import { RandomAvatar } from "react-random-avatars";


interface TransparentHeaderProps {
  showLogo?: boolean;
  background?: string;
}

export const TransparentHeader = ({showLogo, background}: TransparentHeaderProps) => {
  let [isOpen, setIsOpen] = useState(false)
  const { address, isConnected } = useAccount({
    onConnect: ({address}) => {
      onConnect(address as string)
      setIsOpen(false)
    },
    onDisconnect: () => {
      onDisConnect()
    }
  })
  const { user, loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();
  const credit = useStore((state) => state.credit);
  const handleLogout = () => {
    if(user){
      logout()
    }
  }
  return (
    <>
    <div className={`bg-black flex items-center justify-between p-1 px-4 w-full`}>
      <div>
        <Link to="/">
          <QNALogo />
        </Link>
      </div>
      <div className='flex items-center gap-2'>
        <div>
          <I18NSelector />
        </div>
        <div className='flex justify-end py-4'>
          {(user || isConnected) ? (
            <>
            <div 
            className="flex overflow-hidden items-center rounded-full text-sm md:text-sm ">
               <div className="flex h-full gap-x-2 px-2 md:px-4 py-2 items-center">
               <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.83518 6.52405C8.94331 6.52405 11.1358 6.06045 12.4526 5.17639V6.7857H13.6725V3.26211C13.6725 1.14377 10.1508 0 6.83729 0C3.52376 0 0 1.14377 0 3.26211V12.8793C0 14.9976 3.52165 16.1414 6.83518 16.1414V14.9236C3.35473 14.9236 1.21772 13.7325 1.21772 12.8794V9.9883C2.53458 10.8703 4.72511 11.336 6.83518 11.336V10.116C3.35473 10.116 1.21772 8.92499 1.21772 8.07192V5.17868C2.53458 6.06045 4.72722 6.52405 6.83518 6.52405ZM6.83518 1.2179C10.3158 1.2179 12.4526 2.40904 12.4526 3.26211C12.4526 4.11519 10.3156 5.30633 6.83518 5.30633C3.35473 5.30633 1.21772 4.11519 1.21772 3.26211C1.2179 2.40904 3.35684 1.2179 6.83518 1.2179ZM12.3001 7.19172C9.27309 7.19172 7.69036 8.3561 7.69036 9.50586V15.6859C7.69036 16.8356 9.27503 18 12.3001 18C15.3047 18 16.8851 16.8522 16.9098 15.7105H16.9119V9.50604C16.9098 8.3561 15.3272 7.19172 12.3001 7.19172ZM12.3001 8.40963C14.538 8.40963 15.692 9.17819 15.692 9.50586C15.692 9.83353 14.538 10.6021 12.3001 10.6021C10.0623 10.6021 8.90827 9.83353 8.90827 9.50586C8.90827 9.17819 10.0623 8.40963 12.3001 8.40963ZM12.3001 16.7821C10.0623 16.7821 8.90827 16.0135 8.90827 15.6859V14.2104C9.68105 14.6308 10.8166 14.9111 12.3001 14.9111C13.7837 14.9111 14.9171 14.631 15.692 14.2104V15.6859C15.692 16.0135 14.538 16.7821 12.3001 16.7821ZM12.3001 13.6911C10.0623 13.6911 8.90827 12.9224 8.90827 12.5949V11.1194C9.68105 11.5399 10.8166 11.82 12.3001 11.82C13.7837 11.82 14.9171 11.5399 15.692 11.1194V12.5949C15.692 12.9224 14.538 13.6911 12.3001 13.6911Z" fill="white"/>
                </svg>
                <div className="text-white ">
                  {credit}
                </div>
              </div>
              <div className='flex gap-2 items-center'>
                <RandomAvatar size={18} />
                <div className="text-ellipsis w-40 overflow-hidden hidden md:block text-white">
                  {user?.email || address}
                </div>
              </div>
            </div>
            {/* <button className={`text-gray-600 text-sm ${!user ? 'hidden' : ''}`} onClick={() => handleLogout()}>Sign Out</button> */}
            </>
          ): isLoading ? (
            <div className="p-1 px-4 text-white text-md bg-primary rounded-full transition-all">
              <div role="status">
                <svg aria-hidden="true" className="w-4 h-4 text-white animate-spin dark:text-white fill-violet-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            </div>
          ): (
            <div className='flex'>
              <button 
              onClick={() => setIsOpen(true)}
              className="p-1 px-4 text-white text-md bg-primary rounded-full transition-all">
                <span className="shrink-0">{t("signin", {ns: "auth"})}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <SignInModal isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>        
  )
}

 export const SignInModal = ({isOpen, setIsOpen}: any) => {
    const { user, loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();
    const { open } = useWeb3Modal();

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Get Started!"
        style={{
          content: {
            border: 'none',
            background: 'transparent',
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.6)'
          }
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-2 w-full md:max-w-md transform overflow-hidden rounded-xl bg-gray-850 text-left align-middle shadow-xl transition-all">
            <div className='text-sm text-white p-4 py-3 flex items-center justify-between border-b border-bg-100'>
              {t('chooseWay', {ns: "auth"})}
              <div className="cursor-pointer p-2" onClick={() => setIsOpen(false)}>
                <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.55709 5.9999L0.314454 1.75726L1.25726 0.814453L5.4999 5.05709L9.74254 0.814453L10.6854 1.75726L6.44271 5.9999L10.6854 10.2425L9.74254 11.1854L5.4999 6.94271L1.25726 11.1854L0.314453 10.2425L4.55709 5.9999Z" fill="white"/>
                </svg>
              </div>
            </div>
            <div className='flex flex-col gap-4 p-4'>
              <button className='flex-1 flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none' onClick={() => loginWithRedirect()}>
                <div>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.15 3C2.23873 3 1.5 3.73873 1.5 4.65V21.15C1.5 22.0613 2.23873 22.8 3.15 22.8H21.85C22.7613 22.8 23.5 22.0613 23.5 21.15V4.65C23.5 3.73873 22.7613 3 21.85 3H3.15ZM3.7 20.6V5.2H21.3V20.6H3.7ZM5.97613 8.14558L12.5 12.6621L19.0239 8.14558L20.2761 9.9544L13.4392 14.6877C12.8742 15.0788 12.1258 15.0788 11.5608 14.6877L4.72386 9.9544L5.97613 8.14558Z" fill="#F3BD3B"/>
                </svg>

                </div>
                <span>{t('username&password', {ns: 'auth'})}</span>
              </button>
              <button className='flex-1 flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-bg-100 px-4 py-3 text-sm font-medium text-white hover:bg-bg-200 focus:outline-none' onClick={() => open()}>
                <img style={{
                  width: '24px',
                  height: '24px'
                }} src="https://0xfaqstorage.blob.core.windows.net/web-static/wallet_connect_logo.png" />
                <span>{t('connect', {ns: 'auth'})}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
 }