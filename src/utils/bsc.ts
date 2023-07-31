import { request, setRequestHeader } from '@api/request';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bsc } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { signMessage } from '@wagmi/core'
import { initUser } from './api';

const chains = [bsc]
export const projectId = 'b07dfe8b6ba7abcb519809d89b923367'
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const BSCConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
export const BSCClient = new EthereumClient(BSCConfig, chains)

export const onConnect = async (address: string) => {
  const walletToken = localStorage.getItem('qna3_wallet_token')

  if(address && !walletToken){
    const signature = await signMessage({
      message: 'AI + DYOR = Ultimate Answer to Unlock Web3 Universe',
    })
    const {data} = await request.post('/user/wallet_login', {
      wallet_address: address,
      signature: signature
    })
    localStorage.setItem('qna3_wallet_token', data?.access_token)
    await initUser();
  }
}

export const onDisConnect = () => {
  localStorage.removeItem('qna3_wallet_token')
}



// const MMSDK = new MetaMaskSDK();
// // export const bsc = MMSDK.getProvider();

// export const connect = async () => {
//   try {
//     const chainId = '0x38'; // Binance Smart Chain Mainnet Chain ID
//     await bsc?.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
//     await bsc?.request({ method: 'eth_requestAccounts' });
    
//     const address = bsc?.selectedAddress;



//   } catch (error) {
//     console.error('Error connecting to Binance Smart Chain:', error);
//   }
// };