"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function GateAnalytics() {
  const gates = [
    { id: "Gate 1", location: "Main Entrance", people: 245, capacity: 300, density: 82, status: "high" },
    { id: "Gate 2", location: "Side Entrance", people: 156, capacity: 300, density: 52, status: "normal" },
    { id: "Gate 3", location: "Back Gate", people: 89, capacity: 200, density: 45, status: "normal" },
    { id: "Gate 4", location: "VIP Entrance", people: 23, capacity: 50, density: 46, status: "normal" },
    { id: "Gate 5", location: "Emergency Exit", people: 0, capacity: 100, density: 0, status: "empty" },
    { id: "Gate 6", location: "Service Gate", people: 12, capacity: 50, density: 24, status: "normal" },
    { id: "Gate 7", location: "North Gate", people: 178, capacity: 300, density: 59, status: "normal" },
    { id: "Gate 8", location: "South Gate", people: 201, capacity: 300, density: 67, status: "medium" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-950 text-red-200"
      case "medium":
        return "bg-yellow-950 text-yellow-200"
      case "normal":
        return "bg-emerald-950 text-emerald-200"
      case "empty":
        return "bg-slate-800 text-slate-300"
      default:
        return "bg-slate-800 text-slate-300"
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Gate-wise Analytics</CardTitle>
        <CardDescription>Current crowd distribution across all gates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-300">Gate</TableHead>
                <TableHead className="text-slate-300">Location</TableHead>
                <TableHead className="text-slate-300 text-right">People</TableHead>
                <TableHead className="text-slate-300 text-right">Capacity</TableHead>
                <TableHead className="text-slate-300 text-right">Density</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gates.map((gate) => (
                <TableRow key={gate.id} className="border-slate-700">
                  <TableCell className="text-white font-semibold">{gate.id}</TableCell>
                  <TableCell className="text-slate-300">{gate.location}</TableCell>
                  <TableCell className="text-right text-white">{gate.people}</TableCell>
                  <TableCell className="text-right text-slate-300">{gate.capacity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 bg-slate-700 rounded h-2">
                        <div
                          className={`h-full rounded ${
                            gate.density > 75 ? "bg-red-500" : gate.density > 50 ? "bg-yellow-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${gate.density}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-semibold w-12 text-right">{gate.density}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(gate.status)}>
                      {gate.status.charAt(0).toUpperCase() + gate.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
