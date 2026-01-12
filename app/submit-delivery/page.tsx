"use client"

import type React from "react"

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import Link from "next/link"
import { toast } from "sonner"

export default function SubmitDeliveryPage() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    jobId: "",
    deliveryUrl: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) {
      showToast.error("Wallet not connected", "Please connect your wallet first")
      return
    }

    if (!formData.jobId || !formData.deliveryUrl || !formData.description) {
      showToast.error("Missing fields", "Please fill in all fields")
      return
    }

    setIsLoading(true)
    const toastId = showToast.loading("Submitting delivery...")

    try {
      // TODO: Integrate GenLayerJS
      // const contract = client.getContract({ address: '0xYourContractAddress', abi: [...] })
      // const tx = await contract.write.submitDelivery([BigInt(formData.jobId), formData.deliveryUrl])

      // Simulate transaction
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66)
      setTxHash(mockTxHash)

      toast.dismiss(toastId)
      showToast.success("Delivery submitted successfully!", `Tx: ${mockTxHash.substring(0, 10)}...`)
      setFormData({ jobId: "", deliveryUrl: "", description: "" })
    } catch (error) {
      toast.dismiss(toastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit delivery"
      showToast.error("Error submitting delivery", errorMessage)
      console.error("Error submitting delivery:", error)
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
            <CardTitle>Submit Delivery</CardTitle>
            <CardDescription>Submit your work for a job</CardDescription>
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
                  placeholder="Enter job ID"
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what you've delivered..."
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
                  placeholder="https://example.com/your-work"
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              {txHash && (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Transaction submitted</p>
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

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? "Submitting..." : "Submit Delivery"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
