import { request, setRequestHeader } from "@api/request";
import store from "@store/store";
import { BSCConfig } from "./bsc";
import mixpanel from 'mixpanel-browser';
import { auth0Client } from "./auth0";



export const initUser = async (access_token?: string, wallet_token?: string, userID?: string) => {
  const user_id = userID || localStorage.getItem('qna3_user_id');
  const wallet_jwt = wallet_token || localStorage.getItem('qna3_wallet_token');
  const walletAddress = BSCConfig?.data?.account
  // 设定 mixpanel 的 user_id
  if(user_id) {
    mixpanel.identify(user_id as string)
  }
  console.log("--------")
  console.log(user_id, wallet_jwt, access_token, walletAddress)
  await setRequestHeader('x-id', user_id as string)

  // 已登录用户
  if(wallet_jwt || access_token){
    if(access_token){
      await setRequestHeader('Authorization', `Bearer ${access_token}`)
    }else{
      await setRequestHeader('Authorization', `Bearer ${wallet_jwt}`)
    }
    // 更新用户基本信息
    store.getState().setWalletAddress(walletAddress as string);
    store.getState().setWalletToken(wallet_jwt as string);
    store.getState().fetchCredit();
    store.getState().fetchUser();
    store.getState().fetchCreditClaimHistory();
    store.getState().getCheckinStatus();
    return
  }

  const {data} = await request.get('/init', {
    headers: {
      'x-id': user_id || null,
      'Authorization': access_token ? `Bearer ${access_token}` : null
    }
  })
  if(data?.id){
    localStorage.setItem('qna3_user_id', data?.id);
    setRequestHeader('x-id', data?.id as string)
  }
}