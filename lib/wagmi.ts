// lib/wagmi.ts
import { createConfig, http } from "wagmi"
import { defineChain } from "viem"
import { studionet } from "genlayer-js/chains"

const genlayerStudio = defineChain({
  id: studionet.id,
  name: studionet.name ?? "GenLayer Studio",
  nativeCurrency: studionet.nativeCurrency ?? { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: {
    default: { http: [studionet.rpcUrls.default.http[0]] },
    public: { http: [studionet.rpcUrls.default.http[0]] },
  },
  blockExplorers: studionet.blockExplorers
    ? {
        default: {
          name: studionet.blockExplorers.default.name,
          url: studionet.blockExplorers.default.url,
        },
      }
    : undefined,
  testnet: true,
})

export const config = createConfig({
  chains: [genlayerStudio],
  transports: {
    [genlayerStudio.id]: http(genlayerStudio.rpcUrls.default.http[0]),
  },
})
