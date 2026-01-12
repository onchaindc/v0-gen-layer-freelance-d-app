"use client"

import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useChainId } from "wagmi"

export function NavHeader() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const isCorrectChain = chainId === 61999

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-bold text-lg">GenLayer Freelance</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isConnected && (
              <>
                <Link href="/" className="text-sm hover:text-primary transition">
                  Dashboard
                </Link>
                <Link href="/create-job" className="text-sm hover:text-primary transition">
                  Create Job
                </Link>
                <Link href="/submit-delivery" className="text-sm hover:text-primary transition">
                  Submit Delivery
                </Link>
                <Link href="/judge" className="text-sm hover:text-primary transition">
                  Judge & Payout
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isConnected && !isCorrectChain && (
              <div className="text-xs bg-destructive/20 text-destructive px-3 py-1 rounded-full">Wrong network</div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
