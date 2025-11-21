"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function UserProfileCard() {
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    }
  }, [])

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-5 w-5 text-cyan-500" />
          My Profile
        </CardTitle>
        <CardDescription>User information</CardDescription>
      </CardHeader>
      <CardContent>
        {userData ? (
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 text-xs">Name</p>
              <p className="text-white font-semibold">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Email</p>
              <p className="text-white">{userData.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Phone</p>
              <p className="text-white">{userData.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Registration Date</p>
              <p className="text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Loading user data...</p>
        )}
      </CardContent>
    </Card>
  )
}
