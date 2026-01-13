"use client"

import type React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { config } from "@/lib/wagmi"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/lib/user-context"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
