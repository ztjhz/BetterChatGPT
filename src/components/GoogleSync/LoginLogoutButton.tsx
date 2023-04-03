import React from 'react';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';

import useStore from '@store/cloud-auth-store';

const LoginButton = () => {
  const setGoogleAccessToken = useStore((state) => state.setGoogleAccessToken);
  const googleAccessToken = useStore((state) => state.googleAccessToken);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      setGoogleAccessToken(codeResponse.access_token);
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  const logout = () => {
    setGoogleAccessToken(undefined);
    googleLogout();
  };

  return (
    <div>
      {googleAccessToken ? (
        <button className='btn btn-neutral' onClick={logout}>
          Stop syncing data on Google Drive
        </button>
      ) : (
        <button className='btn btn-neutral' onClick={() => login()}>
          Start syncing data on Google Drive
        </button>
      )}
    </div>
  );
};

export default LoginButton;
