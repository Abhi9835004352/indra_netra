"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardOverview from "@/components/admin/dashboard/overview"
import LiveMonitoring from "@/components/admin/dashboard/live-monitoring"
import AlertsPanel from "@/components/admin/dashboard/alerts-panel"
import GateAnalytics from "@/components/admin/dashboard/gate-analytics"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400">Real-time crowd monitoring and management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <DashboardOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LiveMonitoring />
        <AlertsPanel />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GateAnalytics />
      </div>
    </div>
  )
}
