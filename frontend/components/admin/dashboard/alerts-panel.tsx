"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

export default function AlertsPanel() {
  const alerts = [
    {
      type: "warning",
      title: "High Crowd Density",
      message: "Gate 1 density exceeded 80% threshold",
      time: "2 minutes ago",
      icon: AlertTriangle,
    },
    {
      type: "info",
      title: "System Update",
      message: "YOLO model detection running smoothly",
      time: "15 minutes ago",
      icon: Info,
    },
    {
      type: "success",
      title: "Alert Cleared",
      message: "Gate 3 crowd returned to normal levels",
      time: "1 hour ago",
      icon: CheckCircle,
    },
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-700 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Recent Alerts
        </CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          const colorClass =
            alert.type === "warning"
              ? "bg-yellow-950/30 border-yellow-900 text-yellow-200"
              : alert.type === "info"
                ? "bg-blue-950/30 border-blue-900 text-blue-200"
                : "bg-emerald-950/30 border-emerald-900 text-emerald-200"

          return (
            <Alert key={index} className={`border ${colorClass}`}>
              <Icon className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold text-white">{alert.title}</p>
                <p className="text-xs text-gray-300 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </AlertDescription>
            </Alert>
          )
        })}
      </CardContent>
    </Card>
  )
}
