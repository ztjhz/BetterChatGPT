import React from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginLogoutButton from './LoginLogoutButton';

const GoogleSync = ({ clientId }: { clientId: string }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginLogoutButton />
    </GoogleOAuthProvider>
  );
};

export default GoogleSync;
