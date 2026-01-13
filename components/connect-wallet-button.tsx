"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  const handleConnect = () => {
    connect({ connector: injected() })
    setIsOpen(false)
  }

  if (isConnected && address) {
    return (
      <Button variant="outline" size="sm" onClick={() => disconnect()} className="text-xs">
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isPending} size="sm">
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
