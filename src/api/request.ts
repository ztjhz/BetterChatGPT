import axios from 'axios';
import { server_api_endpoint } from '@constants/auth';

console.log('server_api_endpoint', server_api_endpoint)
export const request = axios.create({
  baseURL: server_api_endpoint,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const headersMapping: any = {}
request.interceptors.request.use((value) => {
  Object.keys(headersMapping).forEach(key => {
    value.headers[key] = headersMapping[key];
  })
  return value;
})

export const setRequestHeader = async (key: string, v: string | undefined) => {
  if(!v){
    delete headersMapping[key];
    return;
  }
  headersMapping[key] = v;
}