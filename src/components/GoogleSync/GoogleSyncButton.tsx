import React, { useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import useGStore from '@store/cloud-auth-store';
import useStore from '@store/store';
import { createJSONStorage } from 'zustand/middleware';

const GoogleSyncButton = ({ loginHandler }: { loginHandler?: () => void }) => {
  const setGoogleAccessToken = useGStore((state) => state.setGoogleAccessToken);
  const setSyncStatus = useGStore((state) => state.setSyncStatus);
  const setCloudSync = useGStore((state) => state.setCloudSync);
  const cloudSync = useGStore((state) => state.cloudSync);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setGoogleAccessToken(codeResponse.access_token);
      setCloudSync(true);
      loginHandler && loginHandler();
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  const logout = () => {
    setGoogleAccessToken(undefined);
    setSyncStatus('unauthenticated');
    setCloudSync(false);
    googleLogout();
    useStore.persist.setOptions({
      storage: createJSONStorage(() => localStorage),
    });
    useStore.persist.rehydrate();
  };

  return (
    <div className='flex gap-4 flex-wrap justify-center'>
      <button className='btn btn-primary' onClick={() => login()}>
        Sync your chats
      </button>
      {cloudSync && (
        <button className='btn btn-neutral' onClick={logout}>
          Stop syncing
        </button>
      )}
    </div>
  );
};

export default GoogleSyncButton;
