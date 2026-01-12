"use client"

import type React from "react"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import Link from "next/link"
import { toast } from "sonner"

export default function JudgePage() {
  const { isConnected } = useAccount()
  const [jobId, setJobId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<{
    status: "satisfactory" | "unsatisfactory" | "pending" | null
    score: number
    reason: string
  } | null>(null)

  const handleJudge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !jobId) {
      showToast.error("Missing input", "Please enter a job ID")
      return
    }

    setIsLoading(true)
    const toastId = showToast.loading("Judging job...")

    try {
      // TODO: Integrate GenLayerJS
      // const contract = client.getContract({ address: '0xYourContractAddress', abi: [...] })
      // const result = await contract.read.judgeJob([BigInt(jobId)])

      toast.dismiss(toastId)
      // Mock verdict for demo
      setVerdict({
        status: "satisfactory",
        score: 8,
        reason: "Work meets all requirements and specifications",
      })
      showToast.success("Verdict retrieved", "Job has been judged")
    } catch (error) {
      toast.dismiss(toastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to judge job"
      showToast.error("Error judging job", errorMessage)
      console.error("Error judging job:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReleaseFunds = async () => {
    if (!isConnected || !jobId) return

    setIsLoading(true)
    const toastId = showToast.loading("Releasing funds...")

    try {
      // TODO: Integrate GenLayerJS
      // const contract = client.getContract({ address: '0xYourContractAddress', abi: [...] })
      // const tx = await contract.write.releaseFunds([BigInt(jobId)])

      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66)
      setTxHash(mockTxHash)

      toast.dismiss(toastId)
      showToast.success("Funds released successfully!", `Tx: ${mockTxHash.substring(0, 10)}...`)
    } catch (error) {
      toast.dismiss(toastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to release funds"
      showToast.error("Error releasing funds", errorMessage)
      console.error("Error releasing funds:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <NavHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-muted-foreground py-12">Please connect your wallet first.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Judge & Payout</CardTitle>
            <CardDescription>Review delivery and release funds</CardDescription>
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
                {isLoading ? "Judging..." : "Get Verdict"}
              </Button>
            </form>

            {verdict && (
              <div className="border rounded-lg p-4 bg-card space-y-4">
                <h3 className="font-semibold">Verdict</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span
                      className={`font-semibold px-2 py-1 rounded text-sm ${
                        verdict.status === "satisfactory"
                          ? "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                          : "bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-100"
                      }`}
                    >
                      {verdict.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <span className="font-semibold">{verdict.score}/10</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Reason:</span>
                    <p className="mt-1 text-sm">{verdict.reason}</p>
                  </div>
                </div>

                {verdict.status === "satisfactory" && (
                  <>
                    <Button onClick={handleReleaseFunds} className="w-full" disabled={isLoading}>
                      {isLoading ? "Releasing..." : "Release Funds"}
                    </Button>
                    {txHash && (
                      <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Funds released</p>
                        <Link
                          href={getTxExplorerUrl(txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-700 dark:text-green-300 hover:underline break-all"
                        >
                          View on Explorer →
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
