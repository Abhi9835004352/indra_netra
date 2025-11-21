"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Camera } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UserQRScanner() {
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleScan = async () => {
    setScanning(true)
    // Simulate QR code scanning
    setTimeout(() => {
      setScannedData("Gate_1_Entry_2024")
      setSuccess(true)
      setScanning(false)
      setTimeout(() => setSuccess(false), 3000)
    }, 2000)
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <QrCode className="h-5 w-5 text-emerald-500" />
          QR Scanner
        </CardTitle>
        <CardDescription>Scan QR codes at entry points</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <Alert className="bg-emerald-950/50 border-emerald-900 text-emerald-200">
            <AlertDescription>Successfully scanned! Check-in recorded.</AlertDescription>
          </Alert>
        )}

        <div className="aspect-square bg-slate-800 rounded-lg border border-slate-700 border-dashed flex items-center justify-center">
          {scanning ? (
            <div className="text-center">
              <Camera className="h-12 w-12 text-cyan-500 mx-auto mb-2 animate-pulse" />
              <p className="text-slate-400">Scanning...</p>
            </div>
          ) : (
            <div className="text-center">
              <QrCode className="h-12 w-12 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Click button to scan QR code</p>
            </div>
          )}
        </div>

        {scannedData && (
          <div className="bg-slate-800 rounded p-3 border border-slate-700">
            <p className="text-slate-400 text-xs">Last Scanned:</p>
            <p className="text-white font-mono text-sm">{scannedData}</p>
          </div>
        )}

        <Button
          onClick={handleScan}
          disabled={scanning}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {scanning ? "Scanning..." : "Start Scan"}
        </Button>
      </CardContent>
    </Card>
  )
}
