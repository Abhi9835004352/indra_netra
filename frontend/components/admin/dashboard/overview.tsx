"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, Activity, Zap } from "lucide-react"

export default function DashboardOverview() {
  const stats = [
    {
      title: "Current Crowd",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Alerts",
      value: "3",
      change: "+2",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Active Gates",
      value: "8",
      change: "All Active",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "Risk Level",
      value: "Medium",
      change: "Monitor",
      icon: Zap,
      color: "yellow",
    },
  ]

  const colorMap: Record<string, string> = {
    cyan: "bg-cyan-950/50 border-cyan-900 text-cyan-400",
    red: "bg-red-950/50 border-red-900 text-red-400",
    emerald: "bg-emerald-950/50 border-emerald-900 text-emerald-400",
    yellow: "bg-yellow-950/50 border-yellow-900 text-yellow-400",
  }

  return (
    <>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className={`border ${colorMap[stat.color]} bg-slate-900/50`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>{stat.title}</span>
                <Icon className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-xs text-slate-400">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
