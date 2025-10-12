"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DeliverySidebar from "@/components/DeliverySidebar"
import DeliveryNavbar from "@/components/DeliveryNavbar"

export default function DeliveryDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("deliveryToken")
    
    if (!token) {
      router.push("/delivery/login")
      return
    }

    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DeliverySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DeliveryNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-16 lg:pl-[280px] transition-all duration-300">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
