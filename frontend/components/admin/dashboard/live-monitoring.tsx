"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video } from "lucide-react"

export default function LiveMonitoring() {
  return (
    <Card className="bg-slate-900/50 border-slate-700 lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Video className="h-5 w-5 text-cyan-500" />
          Live Video Feed
        </CardTitle>
        <CardDescription>Gate 1 - Main Entrance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-12 w-12 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Video feed will appear here</p>
            <p className="text-slate-500 text-xs mt-1">YOLO detection overlay active</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-slate-800 rounded p-3 text-center border border-slate-700">
            <p className="text-slate-400 text-xs">People Detected</p>
            <p className="text-emerald-400 text-lg font-bold">245</p>
          </div>
          <div className="bg-slate-800 rounded p-3 text-center border border-slate-700">
            <p className="text-slate-400 text-xs">Density</p>
            <p className="text-yellow-400 text-lg font-bold">67%</p>
          </div>
          <div className="bg-slate-800 rounded p-3 text-center border border-slate-700">
            <p className="text-slate-400 text-xs">Risk Level</p>
            <p className="text-orange-400 text-lg font-bold">High</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
