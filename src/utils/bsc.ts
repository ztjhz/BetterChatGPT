import { request, setRequestHeader } from '@api/request';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bsc } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'

const chains = [bsc]
export const projectId = 'b07dfe8b6ba7abcb519809d89b923367'
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const BSCConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
export const BSCClient = new EthereumClient(BSCConfig, chains)

export const onConnect = (address: string) => {
  if(address){
    setRequestHeader('x-address', address);
    request.post('/users/wallet_login', {
      wallet_address: address
    })
  }

}

export const onDisConnect = () => {
  setRequestHeader('x-address', '');
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