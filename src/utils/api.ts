import { request, setRequestHeader } from "@api/request";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import store from "@store/store";
import { BSCConfig } from "./bsc";
import mixpanel from 'mixpanel-browser';

export const initUser = async (access_token?: string, id_token?: string) => {
  const user_id = localStorage.getItem('qna3_user_id');
  const wallet_jwt = localStorage.getItem('qna3_wallet_token');
  const walletAddress = BSCConfig?.data?.account
  // 设定 mixpanel 的 user_id
  if(user_id) {
    mixpanel.identify(user_id as string)
  }

  // 已登录用户
  if(wallet_jwt || access_token){
    if(access_token){
      setRequestHeader('Authorization', `Bearer ${access_token}`)
      setRequestHeader('x-id-token', id_token as string)
      const {data} = await request.get('/user/web2_login')
      if(data?.data?.id){
        localStorage.setItem('qna3_user_id', data?.data?.id);
        setRequestHeader('x-id', data?.data?.id as string)
      }
    }else{
      console.log('wallet_jwt', wallet_jwt)

      setRequestHeader('Authorization', `Bearer ${wallet_jwt}`)
    }

    // 更新用户基本信息
    store.getState().fetchCredit();
    store.getState().fetchUser();
    return
  }

  const {data} = await request.get('/init', {
    headers: {
      'x-id-token': id_token || null,
      'x-id': user_id || null,
      'Authorization': access_token ? `Bearer ${access_token}` : null
    }
  })
  if(data?.id){
    localStorage.setItem('qna3_user_id', data?.id);
    setRequestHeader('x-id', data?.id as string)
  }
}