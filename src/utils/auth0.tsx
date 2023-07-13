import { Auth0Provider } from "@auth0/auth0-react";
import { divide } from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import { initUser } from "./api";

export const Auth0ProviderWithNavigate = ({ children }: any) => {
  const navigate = useNavigate();

  const domain = "dev-tfcpxeutlsld1wm0.us.auth0.com";
  const clientId = "d2lXoGguxROpIsbBChdHbJzqvwkhPnj6";
  // const clientId = "d2lXoGguxROpIsbBChdHbJzqvwkhPnj6";
  const redirectUri = window.location.origin + '/callback';

  const onRedirectCallback = async (appState: any) => {
    await initUser();
    navigate(appState?.returnTo || '/');
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: 'https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/',
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
};