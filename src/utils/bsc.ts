import { request, setRequestHeader } from '@api/request';
import { Connector, WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { signMessage, switchNetwork, InjectedConnector } from '@wagmi/core'
import { initUser } from './api';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import store from '@store/store';
import { conversionWeb3Tracking, track } from './track';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { auth0Client } from './auth0';
const VITE_RUNTIME_ENV = import.meta.env.VITE_RUNTIME_ENV

export const bscConfigMap = VITE_RUNTIME_ENV !== 'production' ? {
  chain: bscTestnet,
  contractAddress: '0x91fA94E903bA414df622575B7a4ecF37a53639C5',
  rpc: 'https://bsc-testnet.nodereal.io/v1/132d52c330424e7896bdc25a5d6ef5fc'
} : {
  chain: bsc,
  contractAddress: '0xB342e7D33b806544609370271A8D074313B7bc30',
  rpc: 'https://bsc-mainnet.nodereal.io/v1/132d52c330424e7896bdc25a5d6ef5fc'
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
    new MetaMaskConnector({ chains }) as Connector,
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
  if(walletToken){
    track('get wallet token', {
      access_token: walletToken,
      value: walletToken,
    })
  }
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
      track('get wallet token', {
        access_token: data?.access_token,
        value: data?.access_token,
      })
      if(data?.user){
        localStorage.setItem('qna3_user_id', data?.user?.id);
      }
  
      store.getState().setWalletToken(data?.access_token)
  
      track('connect', {
        address: address,
        value: address,
      })
      conversionWeb3Tracking();
      try{
        const currentUser = await auth0Client.getUser()
        if(currentUser?.email !== data?.user?.email){
          await auth0Client.logout()
        }
      }catch(e){
        console.log(e)
      }
      
      // await initUser(undefined, data?.access_token, data?.user?.id);
    }catch(e){
      console.log(e)
    }
    
  }
}

export const onDisConnect = () => {
  console.log('disconnect')
  setRequestHeader('Authorization', undefined)
  localStorage.removeItem('qna3_wallet_token')
  store.getState().clearWalletToken()
  store.getState().clearUser()
}
