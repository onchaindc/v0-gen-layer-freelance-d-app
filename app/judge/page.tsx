"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"

import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import { makeGenlayerClient } from "@/lib/genlayerClient"

type OnchainStatus = "OPEN" | "SUBMITTED" | "REVISION" | "APPROVED" | "FAILED" | ""

export default function JudgePage() {
  const { isConnected, address } = useAccount()
  const contractAddress = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as `0x${string}`

  const [jobId, setJobId] = useState("")
  const [status, setStatus] = useState<OnchainStatus>("")
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const jobIdNum = useMemo(() => {
    if (!jobId) return null
    const n = Number(jobId)
    if (!Number.isFinite(n) || n <= 0) return null
    return Math.floor(n)
  }, [jobId])

  const load = async () => {
    if (!address || !jobIdNum) return
    const client = makeGenlayerClient(address)

    const [s, f] = await Promise.all([
      client.readContract({
        address: contractAddress,
        functionName: "get_status",
        args: [jobIdNum],
      }),
      client.readContract({
        address: contractAddress,
        functionName: "get_feedback",
        args: [jobIdNum],
      }),
    ])

    setStatus((s as any) || "")
    setFeedback((f as any) || "")
  }

  const handleRefresh = async () => {
    if (!isConnected || !address) {
      showToast.error("Wallet not connected", "Connect wallet first")
      return
    }
    if (!contractAddress) {
      showToast.error("Missing contract address", "Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local")
      return
    }
    if (!jobIdNum) {
      showToast.error("Invalid Job ID", "Enter a valid job ID")
      return
    }

    setIsLoading(true)
    const t = showToast.loading("Refreshing...")
    try {
      await load()
      showToast.dismiss(t)
      showToast.success("Refreshed", "Latest status loaded")
    } catch (e) {
      showToast.dismiss(t)
      showToast.error("Refresh failed", e instanceof Error ? e.message : "Failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJudge = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      showToast.error("Wallet not connected", "Connect wallet first")
      return
    }
    if (!contractAddress) {
      showToast.error("Missing contract address", "Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local")
      return
    }
    if (!jobIdNum) {
      showToast.error("Invalid Job ID", "Enter a valid job ID")
      return
    }

    setIsLoading(true)
    setTxHash(null)

    const toastId = showToast.loading("Confirm judge transaction in wallet...")

    try {
      const client = makeGenlayerClient(address)

      const hash = await client.writeContract({
        address: contractAddress,
        functionName: "judge",
        args: [jobIdNum],
        value: 0n,
      })

      setTxHash(hash)

      showToast.dismiss(toastId)
      showToast.success("Judge sent", `Tx: ${hash.slice(0, 10)}...`)

      // After sending judge, refresh reads
      await load()
    } catch (error) {
      showToast.dismiss(toastId)
      const msg = error instanceof Error ? error.message : "Judge failed"
      showToast.error("Judge failed", msg)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <NavHeader />
        <main className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-center text-muted-foreground py-12">Please connect your wallet first.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Judge</CardTitle>
            <CardDescription>Studio demo: anyone can trigger AI consensus verdict</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleJudge} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Job ID</label>
                <Input
                  type="number"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="Enter job ID"
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Working..." : "Judge"}
              </Button>
            </form>

            <Button variant="secondary" className="w-full" onClick={handleRefresh} disabled={isLoading || !jobIdNum}>
              Refresh Status
            </Button>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-semibold">{status || "-"}</span>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Feedback:</span>
                <p className="mt-1 text-sm whitespace-pre-wrap">{feedback || "-"}</p>
              </div>
            </div>

            {txHash && (
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Transaction</p>
                <Link
                  href={getTxExplorerUrl(txHash as any)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline break-all"
                >
                  View →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
