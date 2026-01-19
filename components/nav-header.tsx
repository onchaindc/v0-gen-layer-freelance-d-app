"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
import { studionet } from "genlayer-js/chains"

import { ConnectWalletButton } from "./connect-wallet-button"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "@/components/ui/button"
import { showToast } from "@/lib/toast-utils"

const STUDIO_CHAIN_ID = studionet.id

export function NavHeader() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  // Some wallets briefly return 0/undefined; don't scream "wrong network" during that moment
  const hasChain = typeof chainId === "number" && chainId > 0
  const isCorrectChain = hasChain && chainId === STUDIO_CHAIN_ID

  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: STUDIO_CHAIN_ID })
      showToast.success("Network switched", "Now on GenLayer Studio")
    } catch {
      showToast.error("Switch failed", "Please switch network in your wallet to GenLayer Studio")
    }
  }

  // Prefetch routes so navigation feels instant
  const warm = (href: string) => () => router.prefetch(href)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" prefetch onMouseEnter={warm("/")} className="flex items-center gap-2">
            <div className="font-bold text-lg">GenLayer Freelance</div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isConnected && (
              <>
                <Link
                  href="/"
                  prefetch
                  onMouseEnter={warm("/")}
                  className="text-sm hover:text-primary transition"
                >
                  Dashboard
                </Link>

                <Link
                  href="/create-job"
                  prefetch
                  onMouseEnter={warm("/create-job")}
                  className="text-sm hover:text-primary transition"
                >
                  Create Job
                </Link>

                <Link
                  href="/submit-delivery"
                  prefetch
                  onMouseEnter={warm("/submit-delivery")}
                  className="text-sm hover:text-primary transition"
                >
                  Submit Delivery
                </Link>

                <Link
                  href="/judge"
                  prefetch
                  onMouseEnter={warm("/judge")}
                  className="text-sm hover:text-primary transition"
                >
                  Judge
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isConnected && hasChain && !isCorrectChain && (
              <div className="flex items-center gap-2">
                <div className="text-xs bg-destructive/20 text-destructive px-3 py-1 rounded-full">
                  Wrong network
                </div>
                <Button size="sm" onClick={handleSwitch} disabled={isPending}>
                  {isPending ? "Switching..." : "Switch to Studio"}
                </Button>
              </div>
            )}

            {isConnected && isCorrectChain && (
              <div className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full">
                Studio ✅
              </div>
            )}

            {isConnected && (
              <>
                <Link
                  href="/profile"
                  prefetch
                  onMouseEnter={warm("/profile")}
                  className="text-sm hover:text-primary transition"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  prefetch
                  onMouseEnter={warm("/settings")}
                  className="text-sm hover:text-primary transition"
                >
                  Settings
                </Link>
              </>
            )}

            <ThemeSwitcher />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  )
}
