"use client"

import { useAccount } from "wagmi"
import { NavHeader } from "@/components/nav-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return (
      <>
        <NavHeader />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">GenLayer Freelance Escrow</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Connect your wallet to get started with on-chain freelance job management.
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Wallet: {address}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-12">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Active Jobs</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground mt-1">Jobs available</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Submissions</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground mt-1">Pending review</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Earnings</h3>
            <p className="text-2xl font-bold text-primary">0 GEN</p>
            <p className="text-sm text-muted-foreground mt-1">Total earned</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-12">
          <Link href="/create-job" className="block">
            <Button className="w-full" size="lg">
              Create New Job
            </Button>
          </Link>
          <Link href="/submit-delivery" className="block">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Submit Delivery
            </Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground text-center py-8">No jobs yet. Create your first job to get started!</p>
        </div>
      </main>
    </>
  )
}
