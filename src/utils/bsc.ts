import { request } from '@api/request';
import MetaMaskSDK, {MetaMaskSDKOptions} from '@metamask/sdk';
import useStore from '@store/store';


const MMSDK = new MetaMaskSDK();
export const bsc = MMSDK.getProvider();

export const connect = async () => {
  try {
    const chainId = '0x38'; // Binance Smart Chain Mainnet Chain ID
    await bsc?.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
    await bsc?.request({ method: 'eth_requestAccounts' });
    
    const address = bsc?.selectedAddress;
    if(address){
      useStore.getState().setWalletAddress(address as string);
    }

    request.post('/users/wallet_login', {
      wallet_address: address
    })
    
  } catch (error) {
    console.error('Error connecting to Binance Smart Chain:', error);
  }
};