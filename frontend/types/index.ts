// Global TypeScript interfaces and types

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "admin" | "user"
  createdAt: Date
}

export interface Gate {
  id: string
  name: string
  location: string
  capacity: number
  currentCount: number
  density: number
  riskLevel: "low" | "medium" | "high"
}

export interface CrowdMetrics {
  totalPeople: number
  totalCapacity: number
  overallDensity: number
  alertCount: number
  gates: Gate[]
}

export interface QRCode {
  id: string
  userId: string
  code: string
  createdAt: Date
  scans: QRScan[]
}

export interface QRScan {
  id: string
  qrCodeId: string
  gateId: string
  scanTime: Date
  entryTime?: Date
}

export interface Alert {
  id: string
  type: "density" | "anomaly" | "system"
  gateId: string
  message: string
  severity: "info" | "warning" | "critical"
  createdAt: Date
  resolved: boolean
}

export interface YOLODetectionResult {
  gateId: string
  timestamp: Date
  peopleCount: number
  confidence: number
  detections: Detection[]
}

export interface Detection {
  id: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  label: string
}
