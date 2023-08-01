import { Auth0Provider, User, useAuth0 } from '@auth0/auth0-react';
import { divide } from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { initUser } from './api';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { request } from '@api/request';

const domain = 'dev-tfcpxeutlsld1wm0.us.auth0.com';
const clientId =
  import.meta.env.VITE_SENTRY_ENV === 'development'
    ? '9JE1vEdX0D0kcbgajHDlvc2OYn4pPDbR'
    : 'd2lXoGguxROpIsbBChdHbJzqvwkhPnj6';
const redirectUri = window.location.origin + '/callback';
const audience = 'https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/';

export const auth0Client = new Auth0Client({
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: redirectUri,
    audience,
  },
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

  localStorage.setItem('qna3_user_id', data?.data?.id);
  await initUser();
};

export const Auth0ProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();
  const { isLoading, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

  const onRedirectCallback = async (appState: any) => {
    const newToken = await auth0Client.getTokenSilently();
    const user = await auth0Client.getUser();
    await bindWeb2UserEmail(newToken, user as User);
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
