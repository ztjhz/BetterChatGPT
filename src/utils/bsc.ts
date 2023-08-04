import { request, setRequestHeader } from '@api/request';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { signMessage, switchNetwork, InjectedConnector } from '@wagmi/core'
import { initUser } from './api';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import store from '@store/store';
import { track } from './track';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
const VITE_RUNTIME_ENV = import.meta.env.VITE_RUNTIME_ENV

export const bscConfigMap = VITE_RUNTIME_ENV !== 'production' ? {
  chain: bscTestnet,
  contractAddress: '0x91fA94E903bA414df622575B7a4ecF37a53639C5',
  rpc: 'https://bsc-testnet.nodereal.io/v1/132d52c330424e7896bdc25a5d6ef5fc'
} : {
  chain: bsc,
  contractAddress: '0x91fA94E903bA414df622575B7a4ecF37a53639C5',
  rcp: 'https://bsc-mainnet.nodereal.io/v1/132d52c330424e7896bdc25a5d6ef5fc'
}

const chains = [bscConfigMap.chain]

// wallet connect
export const projectId = 'b07dfe8b6ba7abcb519809d89b923367'
const { publicClient, webSocketPublicClient } = configureChains(chains, [jsonRpcProvider({
  rpc: (chain) => ({
    http: bscConfigMap.rpc as string,
  })
}), publicProvider()])

export const BSCConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: projectId,
      },
    })
  ],
  publicClient,
  webSocketPublicClient
})
export const BSCClient = new EthereumClient(BSCConfig, chains)
 
export const checkNetwork = async () => {
  const network = BSCClient.getNetwork()
  if(network?.chain?.id !== bscConfigMap.chain.id){
    await switchNetwork({
      chainId: bscConfigMap.chain.id,
    })
  }
}

// connect callback
export const onConnect = async (address: string) => {
  const walletToken = localStorage.getItem('qna3_wallet_token')
  
  await checkNetwork();

  if(address && !walletToken){
    try{
      const signature = await signMessage({
        message: 'AI + DYOR = Ultimate Answer to Unlock Web3 Universe',
      })
  
      const {data} = await request.post('/user/wallet_login', {
        wallet_address: address,
        signature: signature
      })
  
      localStorage.setItem('qna3_wallet_token', data?.access_token)
      if(data?.user){
        localStorage.setItem('qna3_user_id', data?.user?.id);
      }
  
      store.getState().setWalletToken(data?.access_token)
  
      track('connect', {
        address: address,
        value: address,
      })
      
      await initUser(undefined, data?.access_token, data?.user?.id);
    }catch(e){
      console.log(e)
    }
    
  }
}

export const onDisConnect = () => {
  localStorage.removeItem('qna3_wallet_token')
  store.getState().clearWalletToken()
}
