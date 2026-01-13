'use client'

<<<<<<< HEAD
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, chains } from '@/lib/wagmi'
=======
import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
>>>>>>> 6dad990bd6ac99868d64fec5e8e945c5aff888a1

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
<<<<<<< HEAD
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
=======
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
>>>>>>> 6dad990bd6ac99868d64fec5e8e945c5aff888a1
    </WagmiProvider>
  )
}
