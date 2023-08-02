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
  console.log(value.url, value.headers)
  return value;
})

export const setRequestHeader = async (key: string, v: string) => {
  headersMapping[key] = v;
}