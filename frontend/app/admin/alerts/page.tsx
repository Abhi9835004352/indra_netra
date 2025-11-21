"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Info, CheckCircle, Bell } from "lucide-react"
import { sendWhatsAppNotification, sendSMSNotification } from "@/services/notificationService"

// Dummy alert data for demonstration
const dummyAlerts = [
  {
    id: 1,
    type: "Critical",
    message: "Overcrowding detected at Gate 1!",
    time: "2025-11-21 14:32",
    location: "Gate 1",
    icon: AlertTriangle,
    color: "bg-red-950 border-red-700 text-red-300",
  },
  {
    id: 2,
    type: "Info",
    message: "VIP guest arrived at Main Hall.",
    time: "2025-11-21 14:30",
    location: "Main Hall",
    icon: Info,
    color: "bg-blue-950 border-blue-700 text-blue-300",
  },
  {
    id: 3,
    type: "Resolved",
    message: "Gate 2 crowd dispersed.",
    time: "2025-11-21 14:28",
    location: "Gate 2",
    icon: CheckCircle,
    color: "bg-green-950 border-green-700 text-green-300",
  },
]

export default function AlertsPage() {
    // User's phone number for notifications
    const notificationPhones = ["+9123456782", "+91123456789"]; // <-- Your numbers

    // Send notification handler
    const handleSendNotification = async (type: string, message: string) => {
      const alertMsg = `${type} Alert: ${message}`;
      for (const phone of notificationPhones) {
        await sendWhatsAppNotification(phone, alertMsg);
        await sendSMSNotification(phone, alertMsg);
      }
      alert(`Notification sent to concerned people via WhatsApp and SMS.`);
    };
  const [alerts, setAlerts] = useState(dummyAlerts)
  const [filter, setFilter] = useState<string>("All")

  // Feature: Filter alerts by type
  const filteredAlerts =
    filter === "All"
      ? alerts
      : alerts.filter((a) => a.type === filter)

  return (
    <div className="p-6 bg-slate-950 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Bell className="h-8 w-8 text-yellow-400" /> Alerts
          </h1>
          <p className="text-slate-400">Live event alerts and notifications</p>
        </div>
        <div>
          <select
            className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="Info">Info</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-3 text-center text-slate-400">No alerts found.</div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = alert.icon
            return (
              <Card key={alert.id} className={`border ${alert.color}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    <span>{alert.type}</span>
                  </CardTitle>
                  <div className="text-xs text-slate-400">{alert.time}</div>
                  <div className="text-xs text-slate-400">Location: {alert.location}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-base font-medium mb-2">{alert.message}</div>
                  {alert.type === "Critical" && (
                    <div className="flex gap-2">
                      <button className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded text-sm">Acknowledge</button>
                      <button
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleSendNotification(alert.type, alert.message)}
                      >
                        Notify via WhatsApp & SMS
                      </button>
                    </div>
                  )}
                  {alert.type === "Info" && (
                    <div className="flex gap-2">
                      <button className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm">Mark as Read</button>
                      <button
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleSendNotification(alert.type, alert.message)}
                      >
                        Notify via WhatsApp & SMS
                      </button>
                    </div>
                  )}
                  {alert.type === "Resolved" && (
                    <span className="bg-green-700 text-white px-3 py-1 rounded text-sm">Resolved</span>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
