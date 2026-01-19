"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"

import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import { makeGenlayerClient } from "@/lib/genlayerClient"

export default function SubmitDeliveryPage() {
  const { isConnected, address } = useAccount()
  const contractAddress = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as `0x${string}`

  const [formData, setFormData] = useState({
    jobId: "",
    deliveryUrl: "",
    description: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const jobIdNum = useMemo(() => {
    if (!formData.jobId) return null
    const n = Number(formData.jobId)
    if (!Number.isFinite(n) || n <= 0) return null
    return Math.floor(n)
  }, [formData.jobId])

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
    if (!jobIdNum) {
      showToast.error("Invalid Job ID", "Enter a valid job ID")
      return
    }
    if (!formData.deliveryUrl.trim() || !formData.description.trim()) {
      showToast.error("Missing fields", "URL and description are required")
      return
    }

    setIsLoading(true)
    setTxHash(null)
    const toastId = showToast.loading("Confirm in wallet...")

    try {
      const client = makeGenlayerClient(address)

      const hash = await client.writeContract({
        address: contractAddress,
        functionName: "submit_delivery",
        args: [jobIdNum, formData.deliveryUrl, formData.description],
        value: 0n,
      })

      setTxHash(hash)
      showToast.dismiss(toastId)
      showToast.success("Delivery submitted!", `Tx: ${hash.slice(0, 10)}...`)

      setFormData({ jobId: "", deliveryUrl: "", description: "" })
    } catch (error) {
      showToast.dismiss(toastId)
      const msg = error instanceof Error ? error.message : "Submit delivery failed"
      showToast.error("Submit delivery failed", msg)
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
            <CardTitle>Submit Delivery</CardTitle>
            <CardDescription>Studio demo: submit URL + description on-chain</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Job ID</label>
                <Input
                  type="number"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Delivery URL</label>
                <Input
                  type="url"
                  name="deliveryUrl"
                  value={formData.deliveryUrl}
                  onChange={handleChange}
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Delivery Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
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

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Delivery"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
