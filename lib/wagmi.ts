<<<<<<< HEAD
'use client'

import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// --- 1. Define GenLayer Asimov chain correctly ---
export const genLayerAsimov: Chain = {
=======
import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "viem/chains"

// GenLayer Asimov testnet configuration
const genLayerAsimov = {
>>>>>>> 6dad990bd6ac99868d64fec5e8e945c5aff888a1
  id: 61999,
  name: 'GenLayer Asimov Testnet',
  network: 'asimov',          // optional; remove if TS complains
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
<<<<<<< HEAD
    default: { http: ['https://rpc-asimov.genlayer.com'] },
=======
    default: { http: ["https://rpc-asimov.genlayer.com"] },
    public: { http: ["https://rpc-asimov.genlayer.com"] },
>>>>>>> 6dad990bd6ac99868d64fec5e8e945c5aff888a1
  },
  blockExplorers: {
    default: { name: 'Asimov Explorer', url: 'https://explorer-asimov.genlayer.com' },
  },
  testnet: true,
<<<<<<< HEAD
}

// --- 2. Export chains array ---
export const chains: Chain[] = [genLayerAsimov, sepolia, mainnet]

// --- 3. Wagmi + RainbowKit config ---
export const config = getDefaultConfig({
  appName: 'GenLayer Freelance Escrow dApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains,            // <- Pass typed chain array here
  ssr: true,
=======
} as const

export const config = createConfig({
  chains: [genLayerAsimov, sepolia, mainnet],
>>>>>>> 6dad990bd6ac99868d64fec5e8e945c5aff888a1
  transports: {
    [genLayerAsimov.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})
