"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import QRLogin from "@/components/user/login/qr-login";

export default function UserLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl">
        <QRLogin />
      </div>
    </div>
  );
}
