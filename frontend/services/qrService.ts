// Backend API integration for QR code operations

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface QRScanData {
  qrCode: string
  gateId: string
  userId: string
  timestamp: string
}

export interface QRResponse {
  success: boolean
  message?: string
  data?: any
}

// Generate QR code for user registration
export async function generateUserQR(userId: string, token: string): Promise<QRResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/qr/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Process QR code scan at entry
export async function scanQRCode(qrData: string, gateId: string, token: string): Promise<QRResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/qr/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ qrData, gateId }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

// Get user's registration history
export async function getUserRegistrations(userId: string, token: string): Promise<QRScanData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/qr/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return []
  }
}
