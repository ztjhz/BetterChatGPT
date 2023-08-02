import { request, setRequestHeader } from '@api/request';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { signMessage } from '@wagmi/core'
import { initUser } from './api';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'
import mixpanel from 'mixpanel-browser';
import store from '@store/store';
const VITE_SENTRY_ENV = import.meta.env.VITE_SENTRY_ENV

export const bscConfigMap = VITE_SENTRY_ENV === 'development' ? {
  chain: bscTestnet,
  contractAddress: '0x91fA94E903bA414df622575B7a4ecF37a53639C5'
} : {
  chain: bsc,
  contractAddress: '0x91fA94E903bA414df622575B7a4ecF37a53639C5'
}

const chains = [bscConfigMap.chain]

// wallet connect
export const projectId = 'b07dfe8b6ba7abcb519809d89b923367'
const { publicClient, webSocketPublicClient } = configureChains(chains, [publicProvider()])

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

 

// connect callback
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

    mixpanel.track('connect', {
      address: address,
    });
    store.getState().setWalletToken(data?.access_token)
    await initUser();
  }
}

export const onDisConnect = () => {
  localStorage.removeItem('qna3_wallet_token')
  store.getState().clearWalletToken()
}
