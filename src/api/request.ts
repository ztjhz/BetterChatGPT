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

export const setRequestHeader = (key: string, v: string) => {
  request.interceptors.request.use((value) => {
    value.headers[key] = v;
    return value;
  })
}