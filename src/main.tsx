import * as React from "react";
import * as ReactDOM from "react-dom/client";
import ChatPage from "./pages/chat";
import SearchPage from "./pages/search";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './main.css';
await import('katex/dist/katex.min.css');
import {setRequestHeader} from '@api/request';
import './i18n';
import SearchResultPage from "./pages/search/result";
import { Auth0Provider } from '@auth0/auth0-react';
import { getUserToken, initUser } from "@utils/api";
import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import useStore from "@store/store";
import { BSCConfig, BSCClient, projectId } from "@utils/bsc";
import { Web3Modal } from '@web3modal/react'
import * as Sentry from "@sentry/react";
import mixpanel from 'mixpanel-browser';

Sentry.init({
  dsn: "https://d9452a5428a248c3ad894113e05c8508@o4505355934892032.ingest.sentry.io/4505356060721152",
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/0xfaq\.ai/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  environment: process.env.VITE_SENTRY_ENV
});

mixpanel.init('659a614d94fd41baff409729aeef12b7', { debug: true, track_pageview: true, persistence: 'localStorage' });

await initUser();

const router = createBrowserRouter([
  {
    path: "/",
    element: <SearchPage />,
  },
  {
    path: "/search/:question",
    element: <SearchResultPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);

//@ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <WagmiConfig config={BSCConfig}>
    <Auth0Provider
      domain="dev-tfcpxeutlsld1wm0.us.auth0.com"
      clientId="d2lXoGguxROpIsbBChdHbJzqvwkhPnj6"
      cacheLocation="localstorage"
      onRedirectCallback={async () => {
        initUser()
      }}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/',
      }}
    >
      <RouterProvider router={router} />
     
    </Auth0Provider>
  </WagmiConfig>
   <Web3Modal projectId={projectId} ethereumClient={BSCClient}/>
  </>
);

