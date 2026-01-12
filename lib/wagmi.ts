// lib/wagmi.ts  (or wherever it is)
'use client';  // Add this at top if missing (makes it client-safe)

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mainnet, sepolia } from "viem/chains";

// GenLayer Asimov testnet configuration (confirmed from GenLayer docs/CLI)
const genLayerAsimov = {
  id: 61999,
  name: "GenLayer Asimov Testnet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-asimov.genlayer.com"] },
    public: { http: ["https://rpc-asimov.genlayer.com"] },  // Optional but helps some clients
  },
  blockExplorers: {
    default: { name: "Asimov Explorer", url: "https://explorer-asimov.genlayer.com" },
  },
  testnet: true,  // Explicit for wagmi/RainbowKit
} as const;

export const config = getDefaultConfig({
  appName: "GenLayer Freelance Escrow dApp",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",  // Remove fallback string – let it error if missing so you notice
  chains: [genLayerAsimov, sepolia, mainnet],  // Keep fallbacks
  ssr: true,  // Explicit SSR support for Next.js
  transports: {
    [genLayerAsimov.id]: http(),  // http() auto-uses the chain's rpcUrls.default
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});
