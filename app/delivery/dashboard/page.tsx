"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  DollarSign, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react"

const BASE_URL = "https://redtestlab.com"

interface DashboardBCB {
  name: string
  isAvailable: boolean
  totalCollections: number
  rating: number
  totalEarnings: number
  walletBalance: number
}

interface DashboardBooking {
  id: number
  collectionDate: string
  collectionTime: string
  amount: number
  collectionStatus: string
  paymentMethod: string
  user: { name: string | null; email: string }
  member: { name: string; phoneNumber: string }
  address: { name: string; addressLine: string; city: string; pincode: string }
}

interface DashboardResponse {
  message: string
  dashboard: {
    bcb: DashboardBCB
    upcomingCollections: DashboardBooking[]
    recentCollections: DashboardBooking[]
    walletBalance: number
    unreadNotifications: number
  }
}

export default function DeliveryDashboard() {
  const [data, setData] = useState<DashboardResponse["dashboard"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("deliveryToken")
        if (!token) {
          router.push("/delivery/login")
          return
        }
        const res = await fetch(`${BASE_URL}/api/bcb/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Failed to load dashboard")
        const json: DashboardResponse = await res.json()
        setData(json.dashboard)
      } catch (e: any) {
        setError(e?.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    })
  }

  const getCollectionStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-orange-100 text-orange-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "RETURNED_TO_ADMIN":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const bcb = data.bcb
  const today = new Date()
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  const todaysCollections = data.upcomingCollections.filter((c) => isSameDay(new Date(c.collectionDate), today))
  const todaysCount = todaysCollections.length
  const hasToday = todaysCount > 0
  const nextUpcoming = (() => {
    const future = data.upcomingCollections
      .map((c) => new Date(c.collectionDate))
      .filter((d) => d.getTime() >= new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime())
      .sort((a, b) => a.getTime() - b.getTime())
    return future[0] ? future[0] : null
  })()

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {bcb.name}!</h2>
        <p className="text-gray-600">Here's your delivery dashboard overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {/* Total Collection */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collection</p>
              <p className="text-2xl font-bold text-gray-900">{bcb.totalCollections}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Collection Today (Yes/No) */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collection Today</p>
              <p className="text-2xl font-bold text-gray-900">{hasToday ? 'Yes' : 'No'}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Today's Collection - count */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">{todaysCount}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Upcoming Collection - Date */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Collection</p>
              <p className="text-2xl font-bold text-gray-900">{nextUpcoming ? formatDate(nextUpcoming.toISOString()) : '-'}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-green-600">₹{bcb.walletBalance?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Collections */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Collection</h3>
        {data.upcomingCollections.length === 0 ? (
          <p className="text-sm text-gray-500">No</p>
        ) : (
          <div className="space-y-4">
            {data.upcomingCollections.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                {/* Top row: Amount and Status on the right for mobile too */}
                <div className="flex items-start justify-between">
                  <div className="text-base font-semibold text-gray-900">{formatDate(item.collectionDate)}</div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCollectionStatusBadgeClasses(item.collectionStatus)} border`}>{item.collectionStatus}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      item.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      {item.paymentMethod === 'COD' ? 'Cash on Delivery' : item.paymentMethod}
                    </span>
                  </div>
                </div>
                {/* Date and time */}
                <div className="mt-2 flex items-center text-sm text-gray-600 gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-900 font-medium">{item.collectionTime}</span>
                </div>
                {/* Address */}
                <div className="mt-2 text-sm text-gray-700 break-words">
                  {item.address.addressLine}, {item.address.city} - {item.address.pincode}
                </div>
                {/* Patient */}
                <div className="mt-2 text-sm text-gray-600">
                  Patient: <span className="text-gray-900 font-medium">{item.member.name}</span> ({item.member.phoneNumber})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
