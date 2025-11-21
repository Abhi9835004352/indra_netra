"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CrowdInfoCard() {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-emerald-500" />
          Current Crowd Status
        </CardTitle>
        <CardDescription>Real-time information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-slate-400 text-xs mb-2">Overall Crowd Density</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-700 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <Badge className="bg-emerald-950 text-emerald-200">65%</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 rounded p-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Total in Venue</p>
            <p className="text-white text-lg font-bold">3,204</p>
          </div>
          <div className="bg-slate-800 rounded p-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Capacity</p>
            <p className="text-white text-lg font-bold">5,000</p>
          </div>
        </div>

        <div className="bg-yellow-950/30 border border-yellow-900 rounded p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-200 text-sm">Gate 1 has high density. Avoid if possible.</p>
        </div>
      </CardContent>
    </Card>
  )
}
