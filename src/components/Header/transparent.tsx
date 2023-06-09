import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowRightIcon'
import { useAuth0 } from "@auth0/auth0-react";
import MetaMaskSDK, {MetaMaskSDKOptions} from '@metamask/sdk';
import useStore from '@store/store';
import { connect } from '@utils/bsc';
import { Fragment, useState } from 'react';
import Modal from 'react-modal';
import { WalletIcon, UserIcon } from '@heroicons/react/20/solid';

const MMSDK = new MetaMaskSDK();
const bsc = MMSDK.getProvider();

export const TransparentHeader = () => {
  let [isOpen, setIsOpen] = useState(false)
  const { user, loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();
  const walletAddress = useStore((state) => state.wallet_address);
  const handleLogout = () => {
    if(user){
      logout()
    }
  }
  return (
    <>
    <div className="flex gap-4 justify-end p-4 m-auto max-w-3xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      {(user || walletAddress) ? (
        <>
        <button 
        className="flex overflow-hidden items-center text-emerald-600 text-xs border border-emerald-600 hover:border-emerald-700 rounded-full">
          <div className="text-xs md:text-sm px-2 md:px-4 py-2 text-ellipsis w-40 overflow-hidden">
            {user?.email || walletAddress}
          </div>
          <div className="flex h-full gap-x-1 px-2 md:px-4 py-2 bg-emerald-600 items-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
            <div className="text-white font-bold ">
              1000
            </div>
          </div>
        </button>
        <button className={`text-gray-600 text-sm ${!user ? 'hidden' : ''}`} onClick={() => handleLogout()}>Sign Out</button>
        </>
      ): isLoading ? (
        <div className="p-2 px-4 flex items-center gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all">
          <div role="status">
            <svg aria-hidden="true" className="w-4 h-4 text-white animate-spin dark:text-white fill-emerald-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
        </div>
      ): (
        <div className='flex gap-2'>
          <button 
          onClick={() => setIsOpen(true)}
          className="p-2 px-4 flex items-center gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all">
            <span className="shrink-0">{"Get Started"}</span>
            <ArrowLongRightIcon className="w-4 h-4" style={{
              marginBottom: '3px'
            }} />
          </button>
        </div>
      )}
    </div>
    
    </>        
  )
}

 export const SignInModal = ({isOpen, setIsOpen}: any) => {
    const { user, loginWithRedirect, logout, isLoading, isAuthenticated } = useAuth0();

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Get Started!"
        style={{
          content: {
            border: 'none',
            background: 'transparent'
          }
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col gap-2 w-full md:max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <button className='inline-flex justify-center gap-2 rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ' onClick={() => loginWithRedirect()}>
              <UserIcon className='w-5 h-5'/>
              <span>Signin</span>
            </button>
            <button className='inline-flex justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2' onClick={() => connect()}>
              <WalletIcon className='w-5 h-5'/>
              <span>Connect With Wallet</span>
            </button>
            <button className='inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mt-6' onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    )
 }