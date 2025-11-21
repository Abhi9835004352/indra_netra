"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserQRScanner from "@/components/user/dashboard/qr-scanner"
import UserProfileCard from "@/components/user/dashboard/profile-card"
import CrowdInfoCard from "@/components/user/dashboard/crowd-info-card"
import RegistrationHistory from "@/components/user/dashboard/registration-history"

export default function UserDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    if (!token) {
      router.push("/user/login")
    } else {
      setIsAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-slate-400">View your registrations and scan QR codes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <UserProfileCard />
          <CrowdInfoCard />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <UserQRScanner />
          <RegistrationHistory />
        </div>
      </div>
    </div>
  )
}
