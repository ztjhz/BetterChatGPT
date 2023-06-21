import { request, setRequestHeader } from "@api/request";
import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import store from "@store/store";
import { BSCConfig } from "./bsc";

export const getUserToken = () => {
  const token = localStorage.getItem('@@auth0spajs@@::d2lXoGguxROpIsbBChdHbJzqvwkhPnj6::https://dev-tfcpxeutlsld1wm0.us.auth0.com/api/v2/::openid profile email');
  const id_token_storage = localStorage.getItem('@@auth0spajs@@::d2lXoGguxROpIsbBChdHbJzqvwkhPnj6::@@user@@');
  return {
    access_token: JSON.parse(token || '{}')?.body?.access_token,
    id_token: JSON.parse(id_token_storage || '{}')?.id_token
  }
}
export const initUser = async () => {
  const {access_token, id_token} = getUserToken()
  const user_id = localStorage.getItem('qna3_user_id');
  const walletAddress = BSCConfig?.data?.account
  if(access_token){
    setRequestHeader('Authorization', `Bearer ${access_token}`)
  }
  if(id_token){
    setRequestHeader('x-id-token', id_token)
  }
  if(user_id){
    setRequestHeader('x-id', user_id as string)
  }
  if(walletAddress){
    setRequestHeader('x-address', walletAddress)
  }

  if(!user_id){
    const {data} = await request.get('/init', {
      headers: {
        'x-id-token': id_token || null,
        'x-id': user_id || null,
        'Authorization': access_token ? `Bearer ${access_token}` : null
      }
    })
    store.getState().fetchCredit();
    if(data?.id){
      localStorage.setItem('qna3_user_id', data?.id);
      setRequestHeader('x-id', data?.id as string)
    }
  }
}