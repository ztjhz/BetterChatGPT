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
import { bsc } from "@utils/bsc";
import useStore from "@store/store";
initUser();

bsc?.on("disconnect", (error: any) => {
  useStore.getState().unsetWalletAddress();
})

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
  <Auth0Provider
    domain="dev-tfcpxeutlsld1wm0.us.auth0.com"
    clientId="d2lXoGguxROpIsbBChdHbJzqvwkhPnj6"
    cacheLocation="localstorage"
    onRedirectCallback={async () => {
      const {access_token, id_token} = await getUserToken();
      if(access_token){
        setRequestHeader('Authorization', `Bearer ${access_token}`)
      }
      if(id_token){
        setRequestHeader('x-id-token', `${id_token}`)
      }
    }}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/',
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>
);

