import { createClient } from "genlayer-js"
import { studionet } from "genlayer-js/chains"

export function makeGenlayerClient(account?: `0x${string}`) {
  return createClient({
    chain: studionet, // ✅ Studio network
    account,          // ✅ connected wallet address
  })
}
