"use client"

import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
