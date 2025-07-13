"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface ScanModel {
  id?: number
  name: string
  description: string
  features: string
  startingPrice: string
  createdAt?: string
  updatedAt?: string
  scans?: Scan[]
}

interface ScanCenter {
  id: number
  name: string
  type: "LAB" | "CLINIC" | "HOSPITAL"
  address?: string
  city?: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
  createdAt: string
  scans?: Scan[]
}

interface Scan {
  id?: number
  title: string
  description: string
  price: number
  discountedPrice?: number
  waitTime?: string
  reportTimeEstimate?: string
  isVerified: boolean
  tags: string[]
  scanModelId: number
  scanCenterId: number
  createdAt?: string
  scanModel?: {
    id: number
    name: string
  }
  scanCenter?: ScanCenter
  scanBookings?: ScanBooking[]
}

interface ScanBooking {
  id: number
  name: string
  phoneNumber: string
  location: string
  file?: string
  createdAt: string
  paidAmount?: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  scan: Scan
  user?: {
    id: string
    name: string
    email: string
  }
}

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  totalScans: number
  totalScanModels: number
  totalScanCenters: number
  recentBookings: ScanBooking[]
  scanCentersByType: Record<string, number>
}

const AdminScansComponent: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<"scan-models" | "scan-centers" | "scans" | "bookings" | "stats">(
    "scan-models",
  )
  const [scanModels, setScanModels] = useState<ScanModel[]>([])
  const [scanCenters, setScanCenters] = useState<ScanCenter[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [bookings, setBookings] = useState<ScanBooking[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Dialog states
  const [showScanModelDialog, setShowScanModelDialog] = useState(false)
  const [showScanCenterDialog, setShowScanCenterDialog] = useState(false)
  const [showScanDialog, setShowScanDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogType, setDialogType] = useState<"scan-model" | "scan-center" | "scan" | "booking">("scan-model")
  const [editMode, setEditMode] = useState(false)

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Form states
  const [scanModelForm, setScanModelForm] = useState<ScanModel>({
    name: "",
    description: "",
    features: "",
    startingPrice: "",
  })

  const [scanCenterForm, setScanCenterForm] = useState<Partial<ScanCenter>>({
    name: "",
    type: "LAB",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: undefined,
    longitude: undefined,
  })

  const [scanForm, setScanForm] = useState<Omit<Partial<Scan>, "tags"> & { tags: string[] | string }>({
    title: "",
    description: "",
    price: 0,
    discountedPrice: undefined,
    waitTime: "",
    reportTimeEstimate: "",
    isVerified: false,
    tags: [],
    scanModelId: 0,
    scanCenterId: 0,
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchScanModels()
    fetchScanCenters()
    fetchScans()
    fetchBookings()
    fetchStats()
  }, [])

  const fetchScanModels = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/scan-models")
      if (response.ok) {
        const data = await response.json()
        setScanModels(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch scan models")
    }
  }

  const fetchScanCenters = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/scan-centers")
      if (response.ok) {
        const data = await response.json()
        setScanCenters(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch scan centers")
    }
  }

  const fetchScans = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/scans")
      if (response.ok) {
        const data = await response.json()
        setScans(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch scans")
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || data || [])
      }
    } catch (err) {
      console.error("Failed to fetch bookings")
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("https://redtestlab.com/api/scan/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats")
    }
  }

  const handleCreateScanModel = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const url =
        editMode && selectedItem?.id
          ? `https://redtestlab.com/api/scan/admin/scan-models/${selectedItem.id}`
          : "https://redtestlab.com/api/scan/admin/scan-models"

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scanModelForm),
      })

      if (response.ok) {
        setSuccess(`Scan model ${editMode ? "updated" : "created"} successfully!`)
        setScanModelForm({
          name: "",
          description: "",
          features: "",
          startingPrice: "",
        })
        setShowScanModelDialog(false)
        setEditMode(false)
        fetchScanModels()
      } else {
        setError(`Failed to ${editMode ? "update" : "create"} scan model`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateScanCenter = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const url =
        editMode && selectedItem?.id
          ? `https://redtestlab.com/api/scan/admin/scan-centers/${selectedItem.id}`
          : "https://redtestlab.com/api/scan/admin/scan-centers"

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scanCenterForm),
      })

      if (response.ok) {
        setSuccess(`Scan center ${editMode ? "updated" : "created"} successfully!`)
        setScanCenterForm({
          name: "",
          type: "LAB",
          address: "",
          city: "",
          state: "",
          pincode: "",
          latitude: undefined,
          longitude: undefined,
        })
        setShowScanCenterDialog(false)
        setEditMode(false)
        fetchScanCenters()
      } else {
        setError(`Failed to ${editMode ? "update" : "create"} scan center`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateScan = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const url =
        editMode && selectedItem?.id
          ? `https://redtestlab.com/api/scan/admin/scans/${selectedItem.id}`
          : "https://redtestlab.com/api/scan/admin/scans"

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...scanForm,
          tags: typeof scanForm.tags === "string" ? scanForm.tags.split(",").map((tag) => tag.trim()) : scanForm.tags,
        }),
      })

      if (response.ok) {
        setSuccess(`Scan ${editMode ? "updated" : "created"} successfully!`)
        setScanForm({
          title: "",
          description: "",
          price: 0,
          discountedPrice: undefined,
          waitTime: "",
          reportTimeEstimate: "",
          isVerified: false,
          tags: [],
          scanModelId: 0,
          scanCenterId: 0,
        })
        setShowScanDialog(false)
        setEditMode(false)
        fetchScans()
      } else {
        setError(`Failed to ${editMode ? "update" : "create"} scan`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    setLoading(true)
    try {
      const response = await fetch(`https://redtestlab.com/api/scan/admin/${type}s/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess(`${type} deleted successfully!`)
        if (type === "scan-model") fetchScanModels()
        if (type === "scan-center") fetchScanCenters()
        if (type === "scan") fetchScans()
        setShowDetailsDialog(false)
      } else {
        setError(`Failed to delete ${type}`)
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const openDetailsDialog = (item: any, type: "scan-model" | "scan-center" | "scan" | "booking") => {
    setSelectedItem(item)
    setDialogType(type)
    setShowDetailsDialog(true)
  }

  const openEditDialog = (item: any, type: "scan-model" | "scan-center" | "scan") => {
    setSelectedItem(item)
    setEditMode(true)
    setShowDetailsDialog(false)
    if (type === "scan-model") {
      setScanModelForm(item)
      setShowScanModelDialog(true)
    } else if (type === "scan-center") {
      setScanCenterForm(item)
      setShowScanCenterDialog(true)
    } else if (type === "scan") {
      setScanForm({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
      })
      setShowScanDialog(true)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
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

  const getScanCenterTypeColor = (type: string) => {
    switch (type) {
      case "LAB":
        return "bg-blue-100 text-blue-800"
      case "CLINIC":
        return "bg-green-100 text-green-800"
      case "HOSPITAL":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Scan Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage scan models, centers, scans, and bookings</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                  {activeTab === "scan-models" && "🏥"}
                  {activeTab === "scan-centers" && "🏢"}
                  {activeTab === "scans" && "🔬"}
                  {activeTab === "bookings" && "📅"}
                  {activeTab === "stats" && "📊"}
                </span>
                <span>
                  {activeTab === "scan-models" && "Scan Models"}
                  {activeTab === "scan-centers" && "Scan Centers"}
                  {activeTab === "scans" && "Scans"}
                  {activeTab === "bookings" && "Bookings"}
                  {activeTab === "stats" && "Statistics"}
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
                  { key: "scan-models", label: "Scan Models", icon: "🏥" },
                  { key: "scan-centers", label: "Scan Centers", icon: "🏢" },
                  { key: "scans", label: "Scans", icon: "🔬" },
                  { key: "bookings", label: "Bookings", icon: "📅" },
                  { key: "stats", label: "Statistics", icon: "📊" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as any)
                      setShowMobileMenu(false)
                      clearMessages()
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
              { key: "scan-models", label: "Scan Models", icon: "🏥" },
              { key: "scan-centers", label: "Scan Centers", icon: "🏢" },
              { key: "scans", label: "Scans", icon: "🔬" },
              { key: "bookings", label: "Bookings", icon: "📅" },
              { key: "stats", label: "Statistics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any)
                  clearMessages()
                }}
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

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button onClick={clearMessages} className="text-red-400 hover:text-red-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <button onClick={clearMessages} className="text-green-400 hover:text-green-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
              Dashboard Statistics
            </h2>

            {stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Scans</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Scan Centers</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalScanCenters}</p>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scan Centers by Type */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Centers by Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(stats.scanCentersByType).map(([type, count]) => (
                      <div key={type} className="text-center">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScanCenterTypeColor(type)}`}
                        >
                          {type}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.name}</p>
                          <p className="text-sm text-gray-600">{booking.scan.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(booking.paidAmount || 0)}</p>
                          <p className="text-sm text-gray-600">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Scan Models Tab */}
        {activeTab === "scan-models" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Scan Models</h2>
              <button
                onClick={() => {
                  setEditMode(false)
                  setScanModelForm({
                    name: "",
                    description: "",
                    features: "",
                    startingPrice: "",
                  })
                  setShowScanModelDialog(true)
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Scan Model</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {scanModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{model.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{model.description}</p>
                      </div>
                      <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-2">
                        ₹{model.startingPrice}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-1">Features: {model.features}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs sm:text-sm text-gray-500">{model.scans?.length || 0} scans</span>
                      {model.createdAt && <span className="text-xs text-gray-400">{formatDate(model.createdAt)}</span>}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openDetailsDialog(model, "scan-model")}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openEditDialog(model, "scan-model")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {scanModels.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No scan models found</h3>
                <p className="text-sm sm:text-base text-gray-500 px-4">Create your first scan model to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Scan Centers Tab */}
        {activeTab === "scan-centers" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Scan Centers</h2>
              <button
                onClick={() => {
                  setEditMode(false)
                  setScanCenterForm({
                    name: "",
                    type: "LAB",
                    address: "",
                    city: "",
                    state: "",
                    pincode: "",
                    latitude: undefined,
                    longitude: undefined,
                  })
                  setShowScanCenterDialog(true)
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Scan Center</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {scanCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{center.name}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScanCenterTypeColor(center.type)}`}
                      >
                        {center.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {center.address && (
                      <div className="flex items-start text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="line-clamp-2">{center.address}</span>
                      </div>
                    )}
                    {(center.city || center.state) && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>
                          {center.city}
                          {center.city && center.state && ", "}
                          {center.state}
                        </span>
                      </div>
                    )}
                    {center.pincode && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>{center.pincode}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">{center.scans?.length || 0} scans</span>
                    <span className="text-xs text-gray-400">{formatDate(center.createdAt)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openDetailsDialog(center, "scan-center")}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openEditDialog(center, "scan-center")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {scanCenters.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No scan centers found</h3>
                <p className="text-sm sm:text-base text-gray-500 px-4">Create your first scan center to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Scans Tab */}
        {activeTab === "scans" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Scans</h2>
              <button
                onClick={() => {
                  setEditMode(false)
                  setScanForm({
                    title: "",
                    description: "",
                    price: 0,
                    discountedPrice: undefined,
                    waitTime: "",
                    reportTimeEstimate: "",
                    isVerified: false,
                    tags: [],
                    scanModelId: 0,
                    scanCenterId: 0,
                  })
                  setShowScanDialog(true)
                }}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Scan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex-1 sm:mr-4">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">{scan.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{scan.description}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ₹{scan.price}
                        </span>
                        {scan.isVerified ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      {scan.discountedPrice && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium self-start">
                          ₹{scan.discountedPrice} (Discounted)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {scan.scanModel && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span className="truncate">Model: {scan.scanModel.name}</span>
                      </div>
                    )}
                    {scan.scanCenter && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span className="truncate">{scan.scanCenter.name}</span>
                      </div>
                    )}
                    {scan.waitTime && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Wait: {scan.waitTime}</span>
                      </div>
                    )}
                    {scan.reportTimeEstimate && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Report: {scan.reportTimeEstimate}</span>
                      </div>
                    )}
                    {scan.tags && scan.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {scan.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {scan.tags.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            +{scan.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openDetailsDialog(scan, "scan")}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openEditDialog(scan, "scan")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {scans.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No scans found</h3>
                <p className="text-sm sm:text-base text-gray-500 px-4">Create your first scan to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Scan Bookings</h2>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Mobile Cards View */}
              <div className="sm:hidden">
                {bookings.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                            <p className="text-sm text-gray-600">{booking.phoneNumber}</p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="mb-3">
                          <p className="font-medium text-gray-900">{booking.scan.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-green-600 font-medium">₹{booking.scan.price}</p>
                            {booking.paidAmount && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Paid: ₹{booking.paidAmount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{booking.location}</p>
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
                ) : (
                  <div className="p-8 text-center">
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
                    <h3 className="text-base font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-sm text-gray-500">Bookings will appear here when users book scans.</p>
                  </div>
                )}
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
                        Payment
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
                            {booking.paidAmount && (
                              <div className="text-sm text-green-600 font-medium">Paid: ₹{booking.paidAmount}</div>
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

                {bookings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">Bookings will appear here when users book scans.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Scan Model Dialog */}
        {showScanModelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editMode ? "Edit Scan Model" : "Create Scan Model"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowScanModelDialog(false)
                      setEditMode(false)
                      setScanModelForm({
                        name: "",
                        description: "",
                        features: "",
                        startingPrice: "",
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateScanModel} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={scanModelForm.name}
                    onChange={(e) => setScanModelForm({ ...scanModelForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., MRI Scans"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={scanModelForm.description}
                    onChange={(e) => setScanModelForm({ ...scanModelForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="Advanced MRI scan options"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <input
                    type="text"
                    required
                    value={scanModelForm.features}
                    onChange={(e) => setScanModelForm({ ...scanModelForm, features: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Non-invasive, high-resolution imaging"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price</label>
                  <input
                    type="text"
                    required
                    value={scanModelForm.startingPrice}
                    onChange={(e) => setScanModelForm({ ...scanModelForm, startingPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>

                <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScanModelDialog(false)
                      setEditMode(false)
                      setScanModelForm({
                        name: "",
                        description: "",
                        features: "",
                        startingPrice: "",
                      })
                    }}
                    className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading
                      ? editMode
                        ? "Updating..."
                        : "Creating..."
                      : editMode
                        ? "Update Scan Model"
                        : "Create Scan Model"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Scan Center Dialog */}
        {showScanCenterDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editMode ? "Edit Scan Center" : "Create Scan Center"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowScanCenterDialog(false)
                      setEditMode(false)
                      setScanCenterForm({
                        name: "",
                        type: "LAB",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        latitude: undefined,
                        longitude: undefined,
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateScanCenter} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={scanCenterForm.name}
                    onChange={(e) => setScanCenterForm({ ...scanCenterForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., City Medical Center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    required
                    value={scanCenterForm.type}
                    onChange={(e) =>
                      setScanCenterForm({ ...scanCenterForm, type: e.target.value as "LAB" | "CLINIC" | "HOSPITAL" })
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="LAB">Laboratory</option>
                    <option value="CLINIC">Clinic</option>
                    <option value="HOSPITAL">Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    rows={3}
                    value={scanCenterForm.address}
                    onChange={(e) => setScanCenterForm({ ...scanCenterForm, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="123 Main Street, Building A"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={scanCenterForm.city}
                      onChange={(e) => setScanCenterForm({ ...scanCenterForm, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={scanCenterForm.state}
                      onChange={(e) => setScanCenterForm({ ...scanCenterForm, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    value={scanCenterForm.pincode}
                    onChange={(e) => setScanCenterForm({ ...scanCenterForm, pincode: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="400001"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude (Optional)</label>
                    <input
                      type="number"
                      step="any"
                      value={scanCenterForm.latitude || ""}
                      onChange={(e) =>
                        setScanCenterForm({
                          ...scanCenterForm,
                          latitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="19.0760"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude (Optional)</label>
                    <input
                      type="number"
                      step="any"
                      value={scanCenterForm.longitude || ""}
                      onChange={(e) =>
                        setScanCenterForm({
                          ...scanCenterForm,
                          longitude: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="72.8777"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScanCenterDialog(false)
                      setEditMode(false)
                      setScanCenterForm({
                        name: "",
                        type: "LAB",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        latitude: undefined,
                        longitude: undefined,
                      })
                    }}
                    className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading
                      ? editMode
                        ? "Updating..."
                        : "Creating..."
                      : editMode
                        ? "Update Scan Center"
                        : "Create Scan Center"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Scan Dialog */}
        {showScanDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {editMode ? "Edit Scan" : "Create Scan"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowScanDialog(false)
                      setEditMode(false)
                      setScanForm({
                        title: "",
                        description: "",
                        price: 0,
                        discountedPrice: undefined,
                        waitTime: "",
                        reportTimeEstimate: "",
                        isVerified: false,
                        tags: [],
                        scanModelId: 0,
                        scanCenterId: 0,
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateScan} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={scanForm.title}
                    onChange={(e) => setScanForm({ ...scanForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., Brain MRI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={scanForm.description}
                    onChange={(e) => setScanForm({ ...scanForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                    placeholder="Detailed scan of the brain"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      required
                      value={scanForm.price}
                      onChange={(e) => setScanForm({ ...scanForm, price: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="3500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (Optional)</label>
                    <input
                      type="number"
                      value={scanForm.discountedPrice || ""}
                      onChange={(e) =>
                        setScanForm({
                          ...scanForm,
                          discountedPrice: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="3000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wait Time</label>
                    <input
                      type="text"
                      value={scanForm.waitTime}
                      onChange={(e) => setScanForm({ ...scanForm, waitTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="30 minutes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Time Estimate</label>
                    <input
                      type="text"
                      value={scanForm.reportTimeEstimate}
                      onChange={(e) => setScanForm({ ...scanForm, reportTimeEstimate: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="24 hours"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(scanForm.tags) ? scanForm.tags.join(", ") : scanForm.tags}
                    onChange={(e) => setScanForm({ ...scanForm, tags: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="brain, mri, neurological"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scan Model</label>
                  <select
                    required
                    value={scanForm.scanModelId}
                    onChange={(e) => setScanForm({ ...scanForm, scanModelId: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Select a scan model</option>
                    {scanModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scan Center</label>
                  <select
                    required
                    value={scanForm.scanCenterId}
                    onChange={(e) => setScanForm({ ...scanForm, scanCenterId: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Select a scan center</option>
                    {scanCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name} - {center.type} ({center.city}, {center.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={scanForm.isVerified}
                    onChange={(e) => setScanForm({ ...scanForm, isVerified: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">
                    Mark as verified
                  </label>
                </div>

                <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScanDialog(false)
                      setEditMode(false)
                      setScanForm({
                        title: "",
                        description: "",
                        price: 0,
                        discountedPrice: undefined,
                        waitTime: "",
                        reportTimeEstimate: "",
                        isVerified: false,
                        tags: [],
                        scanModelId: 0,
                        scanCenterId: 0,
                      })
                    }}
                    className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? (editMode ? "Updating..." : "Creating...") : editMode ? "Update Scan" : "Create Scan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Dialog */}
        {showDetailsDialog && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9998]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {dialogType === "scan-model" && "Scan Model Details"}
                    {dialogType === "scan-center" && "Scan Center Details"}
                    {dialogType === "scan" && "Scan Details"}
                    {dialogType === "booking" && "Booking Details"}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {(dialogType === "scan-model" || dialogType === "scan-center" || dialogType === "scan") && (
                      <>
                        <button
                          onClick={() =>
                            openEditDialog(selectedItem, dialogType as "scan-model" | "scan-center" | "scan")
                          }
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dialogType, selectedItem.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setShowDetailsDialog(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {dialogType === "scan-model" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Starting Price:</span>
                            <p className="text-gray-900 mt-1">₹{selectedItem.startingPrice}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Features:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.features}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                        <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                        {selectedItem.createdAt && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Created:</span>
                            <p className="text-gray-900 mt-1">{formatDate(selectedItem.createdAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedItem.scans && selectedItem.scans.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Associated Scans ({selectedItem.scans.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedItem.scans.map((scan: any) => (
                            <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900">{scan.title}</h5>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scan.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-blue-600 font-medium">₹{scan.price}</p>
                                {scan.isVerified ? (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {dialogType === "scan-center" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Name:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Type:</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getScanCenterTypeColor(selectedItem.type)}`}
                            >
                              {selectedItem.type}
                            </span>
                          </div>
                          {selectedItem.address && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Address:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.address}</p>
                            </div>
                          )}
                          {(selectedItem.city || selectedItem.state) && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Location:</span>
                              <p className="text-gray-900 mt-1">
                                {selectedItem.city}
                                {selectedItem.city && selectedItem.state && ", "}
                                {selectedItem.state}
                              </p>
                            </div>
                          )}
                          {selectedItem.pincode && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Pincode:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.pincode}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Details</h4>
                        <div className="space-y-3">
                          {selectedItem.latitude && selectedItem.longitude && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Coordinates:</span>
                              <p className="text-gray-900 mt-1">
                                {selectedItem.latitude}, {selectedItem.longitude}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-500">Total Scans:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.scans?.length || 0}</p>
                          </div>
                          {selectedItem.createdAt && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Created:</span>
                              <p className="text-gray-900 mt-1">{formatDate(selectedItem.createdAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedItem.scans && selectedItem.scans.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Available Scans ({selectedItem.scans.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedItem.scans.map((scan: any) => (
                            <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900">{scan.title}</h5>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{scan.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-blue-600 font-medium">₹{scan.price}</p>
                                {scan.isVerified ? (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ✓ Verified
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {dialogType === "scan" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Scan Information</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Title:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.title}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Price:</span>
                            <p className="text-gray-900 mt-1">₹{selectedItem.price}</p>
                          </div>
                          {selectedItem.discountedPrice && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Discounted Price:</span>
                              <p className="text-gray-900 mt-1">₹{selectedItem.discountedPrice}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <div className="mt-1">
                              {selectedItem.isVerified ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  ✓ Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Pending Verification
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedItem.waitTime && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Wait Time:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.waitTime}</p>
                            </div>
                          )}
                          {selectedItem.reportTimeEstimate && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Report Time:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.reportTimeEstimate}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-500">Description:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.description}</p>
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
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Associated Information</h4>
                        <div className="space-y-3">
                          {selectedItem.scanModel && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Scan Model:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.scanModel.name}</p>
                            </div>
                          )}
                          {selectedItem.scanCenter && (
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-gray-500">Scan Center:</span>
                                <p className="text-gray-900 mt-1">{selectedItem.scanCenter.name}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Center Type:</span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getScanCenterTypeColor(selectedItem.scanCenter.type)}`}
                                >
                                  {selectedItem.scanCenter.type}
                                </span>
                              </div>
                              {(selectedItem.scanCenter.city || selectedItem.scanCenter.state) && (
                                <div>
                                  <span className="text-sm font-medium text-gray-500">Location:</span>
                                  <p className="text-gray-900 mt-1">
                                    {selectedItem.scanCenter.city}
                                    {selectedItem.scanCenter.city && selectedItem.scanCenter.state && ", "}
                                    {selectedItem.scanCenter.state}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          {selectedItem.tags && selectedItem.tags.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Tags:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedItem.tags.map((tag: string, index: number) => (
                                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-500">Total Bookings:</span>
                            <p className="text-gray-900 mt-1">{selectedItem.scanBookings?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dialogType === "booking" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment & Scan Details</h4>
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
                          {selectedItem.scan.scanModel && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Scan Model:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.scan.scanModel.name}</p>
                            </div>
                          )}
                          {selectedItem.scan.scanCenter && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Scan Center:</span>
                              <p className="text-gray-900 mt-1">{selectedItem.scan.scanCenter.name}</p>
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

export default AdminScansComponent
