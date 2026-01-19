"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useAccount, useChainId } from "wagmi"

import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import { makeGenlayerClient } from "@/lib/genlayerClient"

export default function CreateJobPage() {
  const { isConnected, address } = useAccount()
  const connectedChainId = useChainId()

  const contractAddress = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as `0x${string}`

  const [formData, setFormData] = useState({
    description: "",
    budget: "", // DEMO number
    deadline: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [createdJobId, setCreatedJobId] = useState<number | null>(null)

  // Cache the client so you don’t “initialize” every click (reduces lag)
  const client = useMemo(() => {
    if (!address) return null
    return makeGenlayerClient(address)
  }, [address])

  useEffect(() => {
    ;(async () => {
      if (!client) return
      try {
        await client.initializeConsensusSmartContract()
      } catch {
        // don’t toast here; avoid annoying popups on page load
      }
    })()
  }, [client])

  const budgetInt = useMemo(() => {
    if (!formData.budget) return null
    const n = Number(formData.budget)
    if (!Number.isFinite(n) || n <= 0) return null
    return Math.floor(n)
  }, [formData.budget])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected || !address) {
      showToast.error("Wallet not connected", "Please connect your wallet first")
      return
    }
    if (!contractAddress) {
      showToast.error("Missing contract address", "Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local")
      return
    }
    if (!formData.description || !formData.deadline) {
      showToast.error("Missing fields", "Please fill in all fields")
      return
    }
    if (!budgetInt) {
      showToast.error("Invalid budget", "Enter a whole number like 100")
      return
    }
    if (!client) {
      showToast.error("Client not ready", "Refresh the page and try again")
      return
    }

    setIsLoading(true)
    setTxHash(null)
    setCreatedJobId(null)

    const toastId = showToast.loading("Preparing job id...")

    try {
      // ✅ 1) Read NEXT id first (this is the id we’re creating)
      const nextIdRaw = await client.readContract({
        address: contractAddress,
        functionName: "get_next_job_id",
        args: [],
      })

      const nextId = Number(nextIdRaw)
      if (!Number.isFinite(nextId) || nextId <= 0) {
        throw new Error("Could not read next job id")
      }

      setCreatedJobId(nextId)

      showToast.dismiss(toastId)
      const toastId2 = showToast.loading("Confirm in wallet...")

      // ✅ 2) Write tx
      const hash = await client.writeContract({
        address: contractAddress,
        functionName: "post_job",
        args: [formData.description, budgetInt, formData.deadline],
        value: 0n, // DEMO: no deposit
      })

      setTxHash(hash)
      showToast.dismiss(toastId2)
      showToast.success("Job created!", `Job ID: ${nextId}`)

      setFormData({ description: "", budget: "", deadline: "" })
    } catch (error) {
      showToast.dismiss(toastId)
      const msg = error instanceof Error ? error.message : "Failed"
      showToast.error("Create job failed", msg)
      console.error(error)
      setCreatedJobId(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <>
        <NavHeader />
        <main className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-center text-muted-foreground">Please connect your wallet first.</p>
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
            <CardTitle>Create a New Job</CardTitle>
            <CardDescription>Studio demo: budget is stored only (no deposit)</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Optional debug info */}
            <div className="mb-4 rounded-lg border p-3 text-sm text-muted-foreground">
              Connected chain id: {connectedChainId ?? "?"}
              <br />
              Contract: {contractAddress || "(missing env)"}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Budget (demo number)</label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Example: 100"
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              {createdJobId !== null && (
                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Created Job ID</p>
                  <p className="text-sm text-muted-foreground">{createdJobId}</p>
                </div>
              )}

              {txHash && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                  <p className="text-sm font-medium">Transaction submitted</p>
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

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
