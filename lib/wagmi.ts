'use client'

import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// --- 1. Define GenLayer Asimov chain correctly ---
export const genLayerAsimov: Chain = {
  id: 61999,
  name: 'GenLayer Asimov Testnet',
  network: 'asimov',          // optional; remove if TS complains
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-asimov.genlayer.com'] },
  },
  blockExplorers: {
    default: { name: 'Asimov Explorer', url: 'https://explorer-asimov.genlayer.com' },
  },
  testnet: true,
}

// --- 2. Export chains array ---
export const chains: Chain[] = [genLayerAsimov, sepolia, mainnet]

// --- 3. Wagmi + RainbowKit config ---
export const config = getDefaultConfig({
  appName: 'GenLayer Freelance Escrow dApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains,            // <- Pass typed chain array here
  ssr: true,
  transports: {
    [genLayerAsimov.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})
