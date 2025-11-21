// Custom hook for authentication management

"use client"

import { useState, useEffect } from "react"

interface AuthUser {
  id: string
  email: string
  role: "admin" | "user"
  firstName?: string
  lastName?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for admin token first
    const adminToken = localStorage.getItem("adminToken")
    if (adminToken) {
      const adminUser = localStorage.getItem("adminUser")
      if (adminUser) {
        setUser(JSON.parse(adminUser))
      }
      setIsLoading(false)
      return
    }

    // Check for user token
    const userToken = localStorage.getItem("userToken")
    if (userToken) {
      const userData = localStorage.getItem("userData")
      if (userData) {
        setUser(JSON.parse(userData))
      }
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    setUser(null)
  }

  return { user, isLoading, error, logout }
}
