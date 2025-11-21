// Custom hook for real-time crowd data management

"use client"

import { useState, useEffect } from "react"
import { getCrowdData, getAlerts } from "@/services/crowdService"
import { initializeSocket, onCrowdUpdate, onAlertReceived } from "@/services/socketService"

export function useCrowdData(token: string | null) {
  const [crowdData, setCrowdData] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial crowd data
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const [crowdResponse, alertsResponse] = await Promise.all([getCrowdData(token), getAlerts(token)])

        setCrowdData(crowdResponse)
        setAlerts(alertsResponse)
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  // Initialize socket connection for real-time updates
  useEffect(() => {
    if (!token) return

    try {
      const socket = initializeSocket(token)

      // Subscribe to crowd updates
      onCrowdUpdate((data) => {
        setCrowdData((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((g) => g.gateId === data.gateId)
          if (index !== -1) {
            updated[index] = data
          } else {
            updated.push(data)
          }
          return updated
        })
      })

      // Subscribe to alerts
      onAlertReceived((alert) => {
        setAlerts((prev) => [alert, ...prev].slice(0, 10))
      })

      return () => {
        socket.off("crowd-update")
        socket.off("alert")
      }
    } catch (err) {
      console.error("Socket initialization error:", err)
    }
  }, [token])

  return { crowdData, alerts, loading, error }
}
