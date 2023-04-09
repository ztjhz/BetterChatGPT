import React, { useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import useGStore from '@store/cloud-auth-store';

const LoginButton = () => {
  const setGoogleAccessToken = useGStore((state) => state.setGoogleAccessToken);
  const googleAccessToken = useGStore((state) => state.googleAccessToken);

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
          Logout
        </button>
      ) : (
        <button className='btn btn-neutral' onClick={() => login()}>
          Login
        </button>
      )}
    </div>
  );
};

export default LoginButton;
