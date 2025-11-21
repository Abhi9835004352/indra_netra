"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, LayoutGrid, Users, AlertTriangle, LogOut, Menu, X } from "lucide-react"

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/")
  }

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    { label: "Monitoring", href: "/admin/monitoring", icon: Users },
    { label: "Alerts", href: "/admin/alerts", icon: AlertTriangle },
  ]

  return (
    <div
      className={`${isOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-700 transition-all duration-300 h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-cyan-500" />
            <span className="font-bold text-white">Drishti</span>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "bg-cyan-600 hover:bg-cyan-700" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:bg-red-950/50"
        >
          <LogOut className="h-5 w-5" />
          {isOpen && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
