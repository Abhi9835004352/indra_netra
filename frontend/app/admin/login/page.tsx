"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdmin } from "@/services/authService"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await loginAdmin(email, password)
      if (response.success) {
        localStorage.setItem("adminToken", response.token)
        localStorage.setItem("adminUser", JSON.stringify(response.user))
        router.push("/admin/dashboard")
      } else {
        setError(response.message || "Login failed")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-6 w-6 text-cyan-500" />
            <CardTitle className="text-white">Admin Login</CardTitle>
          </div>
          <CardDescription>Access the crowd monitoring dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-950/50 border-red-900 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-4">
            Go back to{" "}
            <Link href="/" className="text-cyan-500 hover:underline">
              home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
