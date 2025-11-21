"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function RegistrationHistory() {
  const history = [
    { date: "2024-01-15", time: "14:30", gate: "Gate 1", status: "checked-in" },
    { date: "2024-01-14", time: "10:15", gate: "Gate 2", status: "checked-in" },
    { date: "2024-01-13", time: "18:45", gate: "Gate 1", status: "checked-in" },
  ]

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Clock className="h-5 w-5 text-cyan-500" />
          Check-in History
        </CardTitle>
        <CardDescription>Last 10 entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Date</TableHead>
              <TableHead className="text-slate-300">Time</TableHead>
              <TableHead className="text-slate-300">Gate</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry, index) => (
              <TableRow key={index} className="border-slate-700">
                <TableCell className="text-white">{entry.date}</TableCell>
                <TableCell className="text-white">{entry.time}</TableCell>
                <TableCell className="text-white">{entry.gate}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-950 text-emerald-200">Checked In</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
