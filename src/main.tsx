import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from 'react-router-dom';
import './main.css';
await import('katex/dist/katex.min.css');
import { setRequestHeader } from '@api/request';
import './i18n';
import { Auth0Provider } from '@auth0/auth0-react';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import useStore from '@store/store';
import { BSCConfig, BSCClient, projectId } from '@utils/bsc';
import { Web3Modal } from '@web3modal/react';
import * as Sentry from '@sentry/react';
import mixpanel from 'mixpanel-browser';
import { App } from './app';
import { Auth0ProviderWithNavigate } from '@utils/auth0';
import { trackingToolsInit } from '@utils/track';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

trackingToolsInit();

//@ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <WagmiConfig config={BSCConfig}>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </WagmiConfig>
    </BrowserRouter>
    <ToastContainer autoClose={3000} />
    <Web3Modal projectId={projectId} ethereumClient={BSCClient} />
  </>
);
