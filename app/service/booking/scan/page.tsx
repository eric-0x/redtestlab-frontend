"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ScanModel {
  id: number
  name: string
  description: string
  features: string
  startingPrice: string
  image: string
}

interface Scan {
  id: number
  title: string
  description: string
  price: number
  scanModelId: number
  serviceProviderId: string
  adminCommissionPercent: number
  createdAt?: string
  scanModel?: ScanModel
  serviceProvider?: {
    id: string
    labName: string
    ownerName: string
    city: string
    state: string
    contactNumber: string
  }
}

interface ScanBooking {
  id: number
  name: string
  phoneNumber: string
  location: string
  file?: string
  createdAt: string
  paidAmount?: number
  commissionAmount?: number
  creditedCoins?: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  scan: Scan
  user?: {
    id: string
    name: string
    email: string
  }
}

interface ServiceProvider {
  id: string
  email: string
  labName: string
  ownerName: string
  contactNumber: string
  city: string
  state: string
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  coins: number
  servicesOffered: string[]
  testsAvailable: string[]
  labImagesUrls: string[]
}

const ServiceProviderScans: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "scans" | "bookings">("overview")
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null)
  const [scans, setScans] = useState<Scan[]>([])
  const [bookings, setBookings] = useState<ScanBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogType, setDialogType] = useState<"scan" | "booking">("scan")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Get service provider ID from localStorage
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null)

   useEffect(() => {
      // This code will only run on the client side
      setServiceProviderId(localStorage.getItem("serviceId"));
    }, []);

  useEffect(() => {
    if (serviceProviderId) {
      fetchServiceProviderData()
      fetchProviderScans()
      fetchProviderBookings()
    } else {
      setError("Service provider not logged in")
      setLoading(false)
    }
  }, [serviceProviderId])

  const fetchServiceProviderData = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/auth/service/all")
      const data = await response.json()
      if (data.serviceProviders) {
        const provider = data.serviceProviders.find((p: ServiceProvider) => p.id === serviceProviderId)
        setServiceProvider(provider || null)
      }
    } catch (err) {
      setError("Failed to fetch service provider data")
    }
  }

  const fetchProviderScans = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/scans")
      if (response.ok) {
        const data = await response.json()
        const providerScans = data.filter((scan: Scan) => scan.serviceProviderId === serviceProviderId)
        setScans(providerScans || [])
      }
    } catch (err) {
      console.error("Failed to fetch scans")
    }
  }

  const fetchProviderBookings = async () => {
    try {
      const response = await fetch(
        `https://redtestlab.com/api/scan/provider/${serviceProviderId}/bookings`,
      )
      if (response.ok) {
        const data = await response.json()
        setBookings(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  const openDetailsDialog = (item: any, type: "scan" | "booking") => {
    setSelectedItem(item)
    setDialogType(type)
    setShowDetailsDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotalEarnings = () => {
    return bookings.reduce((total, booking) => total + (booking.creditedCoins || 0), 0)
  }

  const calculateTotalCommission = () => {
    return bookings.reduce((total, booking) => total + (booking.commissionAmount || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !serviceProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-6">{error || "Service provider not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                {serviceProvider.labName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Service Provider Dashboard</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {serviceProvider.city}, {serviceProvider.state}
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="bg-green-100 p-3 sm:p-4 rounded-full">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-2 mb-4 sm:mb-6 lg:mb-8">
          <div className="sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-full flex items-center justify-between py-3 px-4 text-left font-medium text-gray-900 bg-gray-50 rounded-lg"
            >
              <span className="flex items-center space-x-2">
                <span>
                  {activeTab === "overview" && "📊"}
                  {activeTab === "scans" && "🔬"}
                  {activeTab === "bookings" && "📅"}
                </span>
                <span>
                  {activeTab === "overview" && "Overview"}
                  {activeTab === "scans" && "My Scans"}
                  {activeTab === "bookings" && "Bookings"}
                </span>
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${showMobileMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showMobileMenu && (
              <div className="mt-2 space-y-1">
                {[
                  { key: "overview", label: "Overview", icon: "📊" },
                  { key: "scans", label: "My Scans", icon: "🔬" },
                  { key: "bookings", label: "Bookings", icon: "📅" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as any)
                      setShowMobileMenu(false)
                    }}
                    className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav className="hidden sm:flex space-x-2">
            {[
              { key: "overview", label: "Overview", icon: "📊" },
              { key: "scans", label: "My Scans", icon: "🔬" },
              { key: "bookings", label: "Bookings", icon: "📅" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-3 px-4 lg:px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Scans</p>
                    <p className="text-2xl font-bold text-gray-900">{scans.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">₹{calculateTotalEarnings()}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900">₹{serviceProvider.coins || 0}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Provider Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Lab Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Owner Name:</span>
                    <p className="text-gray-900 mt-1">{serviceProvider.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Contact Number:</span>
                    <p className="text-gray-900 mt-1">{serviceProvider.contactNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-900 mt-1">{serviceProvider.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900 mt-1">
                      {serviceProvider.city}, {serviceProvider.state}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Services:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {serviceProvider.homeCollection && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          Home Collection
                        </span>
                      )}
                      {serviceProvider.appointmentBooking && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Online Booking
                        </span>
                      )}
                      {serviceProvider.emergencyTestFacility && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          Emergency Available
                        </span>
                      )}
                    </div>
                  </div>
                  {serviceProvider.servicesOffered && serviceProvider.servicesOffered.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Services Offered:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {serviceProvider.servicesOffered.slice(0, 3).map((service, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                        {serviceProvider.servicesOffered.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            +{serviceProvider.servicesOffered.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h3>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{booking.name}</h4>
                        <p className="text-sm text-gray-600">{booking.scan.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">₹{booking.creditedCoins || 0}</p>
                        <p className="text-xs text-gray-500">Credited</p>
                      </div>
                    </div>
                  ))}
                  {bookings.length > 5 && (
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="w-full text-center py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Bookings
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h4>
                  <p className="text-gray-500">Bookings will appear here when users book your scans.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Scans Tab */}
        {activeTab === "scans" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Scans</h2>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                {scans.length} Active Scans
              </div>
            </div>

            {scans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{scan.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{scan.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="font-medium text-green-600">₹{scan.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Commission:</span>
                        <span className="font-medium text-orange-600">{scan.adminCommissionPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">You Get:</span>
                        <span className="font-medium text-blue-600">
                          ₹{(scan.price - (scan.price * scan.adminCommissionPercent) / 100).toFixed(2)}
                        </span>
                      </div>
                      {scan.scanModel && (
                        <div className="flex items-center text-xs text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          <span>Model: {scan.scanModel.name}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openDetailsDialog(scan, "scan")}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">No Scans Available</h3>
                <p className="text-gray-600 text-lg">Contact admin to add scans for your lab.</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Bookings</h2>
              <div className="flex space-x-4">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Total: {bookings.length}
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Earned: ₹{calculateTotalEarnings()}
                </div>
              </div>
            </div>

            {bookings.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Mobile Cards View */}
                <div className="sm:hidden">
                  <div className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                            <p className="text-sm text-gray-600">{booking.phoneNumber}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="mb-3">
                          <p className="font-medium text-gray-900">{booking.scan.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Earned: ₹{booking.creditedCoins || 0}
                            </span>
                            {booking.commissionAmount && (
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                Commission: ₹{booking.commissionAmount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">{booking.location}</p>
                        </div>
                        <button
                          onClick={() => openDetailsDialog(booking, "booking")}
                          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                              <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.scan.title}</div>
                              <div className="text-sm text-gray-500">₹{booking.scan.price}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="text-sm text-green-600 font-medium">₹{booking.creditedCoins || 0}</div>
                              {booking.commissionAmount && (
                                <div className="text-xs text-orange-600">Commission: ₹{booking.commissionAmount}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                            {booking.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openDetailsDialog(booking, "booking")}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">No Bookings Yet</h3>
                <p className="text-gray-600 text-lg">Bookings will appear here when users book your scans.</p>
              </div>
            )}
          </div>
        )}

        {/* Details Dialog */}
        {showDetailsDialog && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dialogType === "scan" && "Scan Details"}
                    {dialogType === "booking" && "Booking Details"}
                  </h3>
                  <button onClick={() => setShowDetailsDialog(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {dialogType === "scan" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Scan Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Title:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.title}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Description:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.description}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Price:</span>
                            <p className="text-gray-900 mt-1">₹{selectedItem.price}</p>
                          </div>
                          {selectedItem.createdAt && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Created:</span>
                              <p className="text-gray-900 mt-1">{formatDate(selectedItem.createdAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Admin Commission:</span>
                            <p className="text-orange-600 font-medium mt-1">{selectedItem.adminCommissionPercent}%</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Commission Amount:</span>
                            <p className="text-orange-600 font-medium mt-1">
                              ₹{((selectedItem.price * selectedItem.adminCommissionPercent) / 100).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">You Earn Per Booking:</span>
                            <p className="text-green-600 font-medium mt-1">
                              ₹
                              {(
                                selectedItem.price -
                                (selectedItem.price * selectedItem.adminCommissionPercent) / 100
                              ).toFixed(2)}
                            </p>
                          </div>
                          {selectedItem.scanModel && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Scan Model:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.scanModel.name}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dialogType === "booking" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Phone:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.phoneNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Location:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.location}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Booking Date:</span>
                            <p className="text-gray-900 mt-1">{formatDate(selectedItem.createdAt)}</p>
                          </div>
                          {selectedItem.file && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Prescription:</span>
                              <a
                                href={selectedItem.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 mt-1 block"
                              >
                                View Prescription
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Financial Details</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Scan:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.scan.title}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Scan Price:</span>
                            <p className="text-gray-900 mt-1">₹{selectedItem.scan.price}</p>
                          </div>
                          {selectedItem.paidAmount && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Amount Paid:</span>
                              <p className="text-green-600 font-medium mt-1">₹{selectedItem.paidAmount}</p>
                            </div>
                          )}
                          {selectedItem.commissionAmount && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Admin Commission:</span>
                              <p className="text-orange-600 font-medium mt-1">₹{selectedItem.commissionAmount}</p>
                            </div>
                          )}
                          {selectedItem.creditedCoins && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">You Earned:</span>
                              <p className="text-green-600 font-bold text-lg mt-1">₹{selectedItem.creditedCoins}</p>
                            </div>
                          )}
                          {selectedItem.razorpayOrderId && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Order ID:</span>
                              <p className="text-gray-900 mt-1 font-mono text-xs">{selectedItem.razorpayOrderId}</p>
                            </div>
                          )}
                          {selectedItem.razorpayPaymentId && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Payment ID:</span>
                              <p className="text-gray-900 mt-1 font-mono text-xs">{selectedItem.razorpayPaymentId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedItem.user && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">User Account</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.user.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Email:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceProviderScans
