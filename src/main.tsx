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
      <Web3Modal projectId={projectId} ethereumClient={BSCClient} themeMode="light" themeVariables={{
        "--w3m-button-border-radius": "0.375rem",
        "--w3m-accent-color": "rgb(139, 92, 246)"
      }} />
    </Auth0Provider>
  </WagmiConfig>
);

