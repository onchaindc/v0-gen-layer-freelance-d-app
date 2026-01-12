"use client"

import type React from "react"
import toast from "react-hot-toast" // Import the toast variable

import { useState } from "react"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { showToast, getTxExplorerUrl } from "@/lib/toast-utils"
import Link from "next/link"
import { useAccount } from "wagmi"

export default function CreateJobPage() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    description: "",
    budget: "",
    deadline: "",
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

    if (!formData.description || !formData.budget || !formData.deadline) {
      showToast.error("Missing fields", "Please fill in all fields")
      return
    }

    setIsLoading(true)
    const toastId = showToast.loading("Creating job...")

    try {
      // TODO: Integrate GenLayerJS
      // const client = new GenLayerClient({ rpcUrl: 'https://rpc-asimov.genlayer.com', chainId: 61999 })
      // const contract = client.getContract({ address: '0xYourContractAddress', abi: [...] })
      // const tx = await contract.write.createJob([formData.description, BigInt(formData.budget), formData.deadline])

      // Simulate transaction
      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66)
      setTxHash(mockTxHash)

      toast.dismiss(toastId)
      showToast.success("Job created successfully!", `Tx: ${mockTxHash.substring(0, 10)}...`)
      setFormData({ description: "", budget: "", deadline: "" })
    } catch (error) {
      toast.dismiss(toastId)
      const errorMessage = error instanceof Error ? error.message : "Failed to create job"
      showToast.error("Error creating job", errorMessage)
      console.error("Error creating job:", error)
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
            <CardTitle>Create a New Job</CardTitle>
            <CardDescription>Post a job and lock funds in escrow</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job in detail..."
                  className="mt-2"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Budget (GEN tokens)</label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget in GEN"
                  className="mt-2"
                  required
                  step="0.01"
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
                {isLoading ? "Creating Job..." : "Create Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
