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
  AlertCircle
} from "lucide-react"

interface DeliveryUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  status: string
  isActive: boolean
  isAvailable: boolean
  totalCollections: number
  rating: number
  totalEarnings: number
  assignedPincodes: string[]
  assignedCities: string[]
  createdAt: string
  profileImageUrl: string | null
}

export default function DeliveryDashboard() {
  const [user, setUser] = useState<DeliveryUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("deliveryToken")
    const userData = localStorage.getItem("deliveryUser")
    
    if (!token || !userData) {
      router.push("/delivery/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/delivery/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken")
    localStorage.removeItem("deliveryUser")
    router.push("/delivery/login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div>
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Here's your delivery dashboard overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collections</p>
                <p className="text-2xl font-bold text-gray-900">{user.totalCollections}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Availability</p>
                <p className="text-2xl font-bold text-gray-900">{user.isAvailable ? "Available" : "Active"}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{user.totalEarnings || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="flex items-center mt-1">
                  {user.status === "APPROVED" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : user.status === "SUSPENDED" ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    user.status === "APPROVED" ? "text-green-600" : 
                    user.status === "SUSPENDED" ? "text-red-600" : "text-yellow-600"
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile and Assignment Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center mr-4">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.name}
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center"><svg class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                        }
                      }}
                    />
                  ) : (
                    <User className="h-8 w-8 text-orange-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-orange-500" />
                  {user.phoneNumber}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-orange-500" />
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  {user.city}, {user.state}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                  Joined {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Cities</h4>
                <div className="flex flex-wrap gap-2">
                  {user.assignedCities.length > 0 ? (
                    user.assignedCities.map((city, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                      >
                        {city}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No cities assigned</span>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Pincodes</h4>
                <div className="flex flex-wrap gap-2">
                  {user.assignedPincodes.length > 0 ? (
                    user.assignedPincodes.map((pincode, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                      >
                        {pincode}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No pincodes assigned</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Availability Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {user.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
