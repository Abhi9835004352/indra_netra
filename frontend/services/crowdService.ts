// Backend API integration for crowd monitoring and YOLO detection

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface CrowdData {
  gateId: string
  peopleCount: number
  density: number
  riskLevel: "low" | "medium" | "high"
  timestamp: string
}

export interface AlertData {
  id: string
  type: string
  gateId: string
  message: string
  severity: "info" | "warning" | "critical"
  timestamp: string
}

// Get current crowd data from all gates
export async function getCrowdData(token: string): Promise<CrowdData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/crowd/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching crowd data:", error)
    return []
  }
}

// Get crowd data for specific gate
export async function getGateCrowdData(gateId: string, token: string): Promise<CrowdData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/crowd/gate/${gateId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error("Error fetching gate crowd data:", error)
    return null
  }
}

// Get alerts
export async function getAlerts(token: string, limit = 10): Promise<AlertData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return []
  }
}

// Get heatmap data for visualization
export async function getHeatmapData(gateId: string, token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/crowd/heatmap/${gateId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error("Error fetching heatmap data:", error)
    return null
  }
}

// Get YOLO detection results
export async function getYOLODetection(gateId: string, token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/detection/yolo/${gateId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error("Error fetching YOLO detection:", error)
    return null
  }
}
