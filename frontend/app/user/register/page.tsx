"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/services/authService"

export default function UserRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await registerUser(formData)
      if (response.success) {
        setSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => {
          router.push("/user/login")
        }, 2000)
      } else {
        setError(response.message || "Registration failed")
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
          <CardTitle className="text-white">Create Account</CardTitle>
          <CardDescription>Register for SafetyHub</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-950/50 border-red-900 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-emerald-950/50 border-emerald-900 text-emerald-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-slate-300 text-sm">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-slate-300 text-sm">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-300 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-slate-300 text-sm">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{" "}
            <Link href="/user/login" className="text-emerald-500 hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
