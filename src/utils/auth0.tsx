import { Auth0Provider, User, useAuth0 } from '@auth0/auth0-react';
import { divide } from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initUser } from './api';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { request } from '@api/request';
import { track } from './track';

const domain = 'auth.qna3.ai';
const clientId = import.meta.env.VITE_AUTH0_ID;
const redirectUri = window.location.origin + '/callback';
const audience = 'https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/';

export const auth0Client = new Auth0Client({
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: redirectUri,
    audience,
  },
  cacheLocation: 'localstorage',
});

const bindWeb2UserEmail = async (token: string, user: User) => {
  const { data } = await request.post(
    '/user/bind_email',
    {
      user,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  track('get web2 token', {
    access_token: token,
    value: token,
  });
  localStorage.setItem('qna3_user_id', data?.data?.id);
  await initUser(token, undefined, data?.data?.id);
};

export const Auth0ProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  const onRedirectCallback = async (appState: any) => {
    const newToken = await auth0Client.getTokenSilently();
    const user = await auth0Client.getUser();
    await bindWeb2UserEmail(newToken, user as User);
    track('trigger_login_web2');
    navigate(appState?.returnTo || '/');
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation='localstorage'
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
