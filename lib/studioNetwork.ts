// lib/studioNetwork.ts
// Forces wallet to StudioNet (GenLayer Studio). Fixes “Unknown chain (?)” + wrong routing.

export const STUDIO_CHAIN_ID_DEC = 61999
export const STUDIO_CHAIN_ID_HEX = "0xF22F" // 61999 in hex

// NOTE: This is the Studio RPC used by GenLayer docs.
// If you have a different Studio RPC from your Studio UI, use that instead.
export const STUDIO_RPC = "https://studio.genlayer.com/api"

export const STUDIO_CHAIN_PARAMS = {
  chainId: STUDIO_CHAIN_ID_HEX,
  chainName: "GenLayer Studio",
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  rpcUrls: [STUDIO_RPC],
  blockExplorerUrls: [],
}

export async function getInjectedProvider() {
  const eth = (globalThis as any).ethereum
  if (!eth) throw new Error("No wallet found. Install MetaMask/Rabby.")
  return eth
}

export async function getConnectedAccount(): Promise<`0x${string}`> {
  const eth = await getInjectedProvider()
  const accounts = (await eth.request({ method: "eth_accounts" })) as string[]
  if (!accounts?.length) throw new Error("Wallet not connected.")
  return accounts[0] as `0x${string}`
}

export async function connectWallet(): Promise<`0x${string}`> {
  const eth = await getInjectedProvider()
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[]
  if (!accounts?.length) throw new Error("Wallet connect cancelled.")
  return accounts[0] as `0x${string}`
}

export async function getChainIdHex(): Promise<string> {
  const eth = await getInjectedProvider()
  return (await eth.request({ method: "eth_chainId" })) as string
}

export async function ensureStudioNetwork() {
  const eth = await getInjectedProvider()
  const current = await getChainIdHex()

  if (current?.toLowerCase() === STUDIO_CHAIN_ID_HEX.toLowerCase()) return

  // Try switch
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: STUDIO_CHAIN_ID_HEX }],
    })
    return
  } catch (e: any) {
    // If chain not added, add it
    const code = e?.code
    if (code === 4902 || (typeof e?.message === "string" && e.message.toLowerCase().includes("unrecognized"))) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [STUDIO_CHAIN_PARAMS],
      })
      // then switch again
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: STUDIO_CHAIN_ID_HEX }],
      })
      return
    }
    throw e
  }
}
