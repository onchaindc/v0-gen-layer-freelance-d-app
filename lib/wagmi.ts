import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "viem/chains"

// GenLayer Asimov testnet configuration
const genLayerAsimov = {
  id: 61999,
  name: "GenLayer Asimov Testnet",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-asimov.genlayer.com"] },
    public: { http: ["https://rpc-asimov.genlayer.com"] },
  },
  blockExplorers: {
    default: { name: "Asimov Explorer", url: "https://explorer-asimov.genlayer.com" },
  },
  testnet: true,
} as const

export const config = createConfig({
  chains: [genLayerAsimov, sepolia, mainnet],
  transports: {
    [genLayerAsimov.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
})
