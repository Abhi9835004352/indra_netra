"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Users, QrCode, Activity } from "lucide-react"
import QRLogin from "@/components/user/login/qr-login"
import Head from "next/head"

// Custom Tailwind CSS classes for animations and background
const backgroundStyle = "bg-gray-950" 
const gradientClass = "bg-gradient-to-br from-indigo-950 via-gray-900 to-indigo-950" 
const animatedBorder = "before:absolute before:inset-0 before:bg-[conic-gradient(from_45deg_at_50%_50%,_#3b82f6_0deg,_#1e3a8a_20deg,_transparent_30deg,_transparent_330deg,_#1e3a8a_340deg,_#3b82f6_360deg)] before:rounded-lg before:p-[2px] before:animate-spin-slow"

export default function Home() {
  return (
    <>
      <Head>
        <title>Drishti - Home</title>
      </Head>
      <div className={`min-h-screen ${backgroundStyle} relative overflow-hidden`}>
        {/* Subtle background pattern/glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Subtle radial gradient */}
          <div className="w-96 h-96 bg-blue-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute top-1/4 left-1/4 animate-pulse-slow"></div>
          <div className="w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 absolute bottom-1/4 right-1/4 animate-pulse-slower"></div>
        </div>

        {/* Admin Login Button Top Right - High Contrast */}
        <div className="absolute top-6 right-8 z-20">
          <Link href="/admin/login">
            <Button className="relative z-10 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/50 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl">
              Admin Login
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          {/* Header/Hero Section */}
          <div className="text-center mb-24">
            <div className="flex flex-col items-center justify-center mb-8">
              {/* Animated Text Effect for Drishti */}
              <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-500 animate-shimmer">
                Drishti
              </h1>
              <p className="mt-4 text-xl text-gray-400 max-w-lg mx-auto">
                Secure & Seamless Access
              </p>
            </div>
          </div>

          {/* QR Code Login Section - Central Focus with Modern Card Design */}
          <div className="flex flex-col items-center justify-center">
            {/* Changed max-w-sm to max-w-md to increase width by approx 20% */}
            <Card className={`w-full max-w-md border-2 border-indigo-500/50 bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-indigo-900/50 transition-all duration-500 hover:shadow-indigo-700/60`}>
              <CardHeader className="text-center pb-4">
                <QrCode className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce-slow" />
                <CardTitle className="text-2xl text-white font-semibold">User Access</CardTitle>
                <CardDescription className="text-gray-400">Scan the QR code to log in instantly.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* QRLogin component remains intact */}
                <QRLogin />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx global>{`
        /* Define custom keyframes */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.5;
          }
        }
        @keyframes pulse-slower {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.3;
          }
          50% {
            transform: scale(1);
            opacity: 0.5;
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        /* Apply animations */
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s infinite ease-in-out;
        }
        .animate-pulse-slower {
          animation: pulse-slower 18s infinite ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
      `}</style>
    </>
  )
}