"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DeliveryPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("deliveryToken")
    
    if (token) {
      router.push("/delivery/dashboard")
    } else {
      router.push("/delivery/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  )
}
