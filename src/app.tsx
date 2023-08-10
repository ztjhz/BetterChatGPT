import { useAuth0, LocalStorageCache } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatPage from './pages/chat';
import SearchPage from './pages/search';
import SearchResultPage from './pages/search/result';
import { CallbackPage } from './pages/callback';
import { CreditPage } from './pages/credit';
import { TransparentHeader } from '@components/Header/transparent';
import { initUser } from '@utils/api';
import { getCacheToken } from '@utils/auth0';
import useStore from '@store/store';

export const App = () => {
  const { isLoading, getAccessTokenSilently, isAuthenticated, user } =
    useAuth0();
  const [loadingUser, setLoadingUser] = React.useState(true);
  const wallet_token = useStore((state) => state.wallet_token);
  useEffect(() => {
    console.log('app start');
    // 初始化用户信息
    (async () => {
      try {
        const web2AccessToken = await getCacheToken();
        if (web2AccessToken) {
          await initUser(web2AccessToken);
        } else if (wallet_token) {
          await initUser(undefined, wallet_token);
        } else {
          await initUser();
        }
      } catch (e: any) {
        // 新用户自动 init user
        console.log(e.message);
        if (e?.message === 'Login required') {
          await initUser();
        }
      }
      setLoadingUser(false);
    })();
  }, [1]);

  if (isLoading || loadingUser) {
    return (
      <div className='flex min-h-full w-full flex-col bg-gray-1000'>
        <div>
          <TransparentHeader />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<SearchPage />} />
      <Route path='/search/:question' element={<SearchResultPage />} />
      <Route path='/user/credit' element={<CreditPage />} />
      <Route path='/chat' element={<SearchResultPage />} />
      <Route path='/callback' element={<CallbackPage />} />
    </Routes>
  );
};
