"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Calendar,
  BarChart3,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Building,
  Phone,
  Mail,
} from "lucide-react"
import  Link  from "next/link"
import { format } from "date-fns"
import Head from 'next/head'

type TabType = "bookings" | "reports"

// Type definitions
interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
}

interface BookingItem {
  id: number
  bookingId: number
  productId: number
  quantity: number
  price: number
  product: Product
}

interface Booking {
  id: number
  userId: number
  razorpayOrderId: string
  razorpayPaymentId: string | null
  status: string
  amount: number
  bookingType: string
  createdAt: string
  updatedAt: string
  items: BookingItem[]
  user?: {
    id: number
    name: string
    email: string
  }
}

interface User {
  id: number
  email: string
  name: string | null
  role: string
}

interface ServiceProvider {
  id: string
  labName: string
  registrationNumber: string
  ownerName: string
  contactNumber: string
  email: string
  address: string
  city: string
  state: string
  openingTime: string
  closingTime: string
  operatingDays: string[]
  servicesOffered: string[]
  testsAvailable: string[]
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  reportDeliveryMethods: string[]
  homeCollectionCharges: number
  minimumOrderValue: number
  reportGenerationTime: string
  paymentModesAccepted: string[]
}

// New My Reports API shape
interface MyReportItemProduct { id: number; name: string }
interface MyReportItem { id: number; productId: number; quantity: number; price: number; product?: MyReportItemProduct }
interface MyReportMember { id: number; name: string; email: string }
interface MyReport {
  id: number
  status: string
  collectionStatus: string
  resultUrl: string
  note: string | null
  uploadedAt: string
  member?: MyReportMember
  items?: MyReportItem[]
}

// Interface for the meta tags API response
interface MetaTagsResponse {
  id: number
  filename: string
  title: string
  description: string
  keywords: string
  charset: string
  author: string
  canonicallink: string
  favicon: string
  opengraph: string
  twitter: string
  schema: string
  viewport: string
  createdAt: string
  updatedAt: string
}

const EmptyState = ({ type }: { type: TabType }) => (
  <div className="flex flex-col items-center justify-center h-72 text-gray-400 px-4">
    <div className="bg-gray-100 rounded-full p-5 mb-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
      {type === "bookings" ? (
        <Calendar className="h-9 w-9 text-gray-500" />
      ) : (
        <BarChart3 className="h-9 w-9 text-gray-500" />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-700">No {type === "bookings" ? "Bookings" : "Reports"} Found</h3>
    <p className="mt-3 text-sm max-w-xs text-center text-gray-500">
      {type === "bookings"
        ? "You have no upcoming or past bookings. Create your first booking to get started."
        : "No reports have been generated yet. Create a new report to analyze your data."}
    </p>
  
  </div>
)

const BookingCard = ({ booking }: { booking: Booking }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • hh:mm a")
    } catch (e) {
      return dateString
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 mr-1.5" />
      case "PENDING":
        return <AlertCircle className="h-4 w-4 mr-1.5" />
      default:
        return null
    }
  }

  const getParametersObject = (paramString: string) => {
    try {
      return JSON.parse(paramString)
    } catch (e) {
      return {}
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-blue-200">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-2.5 mr-4 shadow-sm border border-blue-100">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900">Order #{booking.id}</h3>
                <span
                  className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    booking.status,
                  )}`}
                >
                  {getStatusIcon(booking.status)}
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Booked on:</span> {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 sm:p-5">
        {/* Items */}
        <div className="space-y-4">
          {booking.items && booking.items.length > 0 ? (
            booking.items.map((item) => {
              const params = item.product?.parameters ? getParametersObject(item.product.parameters) : {}
              return (
                <div key={item.id} className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-lg">{item.product?.name || "Product"}</h4>
                      {item.product?.reportTime && (
                        <div className="mt-2 flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                          <span>
                            Report Time: <span className="font-medium">{item.product.reportTime} mins</span>
                          </span>
                        </div>
                      )}
                      {/* Parameters display */}
                      {Object.keys(params).length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(params).map(([key, value], idx) => (
                            <div
                              key={idx}
                              className="text-xs bg-white px-2 py-1.5 rounded border border-gray-100 text-gray-700"
                            >
                              <span className="font-medium">{key}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0 flex flex-col items-end">
                      <div className="inline-flex items-center justify-center bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700 font-medium">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1.5">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <p className="text-gray-500 text-center">No items in this booking</p>
            </div>
          )}
        </div>

        {/* Footer with payment info and total */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <div className="text-sm text-gray-500">Payment ID</div>
              <div className="font-mono text-sm font-medium text-gray-800 mt-0.5">
                {booking.razorpayPaymentId || "Not available"}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-700">Total Amount</div>
              <div className="text-xl font-bold text-blue-800 mt-0.5">₹{booking.amount.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MyReportCard = ({ report }: { report: MyReport }) => {
  const productNames = (report.items || []).map((it) => it.product?.name).filter(Boolean).join(", ") || "-"
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-blue-200">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 border-b border-gray-100">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-2.5 mr-4 shadow-sm border border-blue-100">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Report #{report.id}</h3>
            <p className="text-sm text-gray-600 mt-1">{report.member?.name} ({report.member?.email})</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Products</div>
            <div className="text-sm text-gray-800">{productNames}</div>
          </div>
          {report.note && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Note</div>
              <div className="text-sm text-gray-800">{report.note}</div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <a href={report.resultUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <ExternalLink className="h-4 w-4 mr-2" /> View Report (PDF)
          </a>
        </div>
      </div>
    </div>
  )
}

const BookingAndReportsComponent = () => {
  const [activeTab, setActiveTab] = useState<TabType>("bookings")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reports, setReports] = useState<MyReport[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filteredReports, setFilteredReports] = useState<MyReport[]>([])
  const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)

  // Get userId from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  // Fetch meta tags from API
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/2")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 2,
          filename: "BookingsReports",
          title: "RedTest Lab - Bookings & Reports",
          description: "View your health test bookings and medical reports online with RedTest Lab",
          keywords: "bookings, reports, health tests, medical reports, lab results",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: window.location.href,
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Bookings and Reports",
          twitter: "RedTest Lab",
          schema: "",
          viewport: "width=device-width, initial-scale=1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } finally {
        setIsLoadingMeta(false)
      }
    }

    fetchMetaTags()
  }, [])

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setError("User not logged in. Please log in to view your bookings.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch("https://redtestlab.com/api/bookings")
        if (!response.ok) {
          throw new Error(`Error fetching bookings: ${response.statusText}`)
        }
        const data = await response.json()
        // Filter bookings by userId
        const userBookings = data.filter((booking: Booking) => booking.userId === Number.parseInt(userId))
        setBookings(userBookings)
        setFilteredBookings(userBookings)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  // Fetch reports data (My Reports API)
  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) return
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token") || ""
        const res = await fetch(`https://redtestlab.com/api/bookings/my/reports`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        if (!res.ok) throw new Error(`Error fetching reports: ${res.statusText}`)
        const data = await res.json()
        const list: MyReport[] = Array.isArray(data?.reports) ? data.reports : []
        setReports(list)
        setFilteredReports(list)
      } catch (err) {
        console.error("Error fetching reports:", err)
      }
    }
    fetchReports()
  }, [userId])

  // Handle search for bookings
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBookings(bookings)
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase()
      const filtered = bookings.filter(
        (booking) =>
          booking.items?.some((item) => item.product?.name?.toLowerCase().includes(lowerCaseSearch)) ||
          booking.id.toString().includes(lowerCaseSearch) ||
          booking.status.toLowerCase().includes(lowerCaseSearch),
      )
      setFilteredBookings(filtered)
    }
  }, [searchTerm, bookings])

  // Handle search for reports
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReports(reports)
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase()
      const filtered = reports.filter((report) => {
        const member = `${report.member?.name || ""} ${report.member?.email || ""}`.toLowerCase()
        const products = (report.items || []).map((it) => it.product?.name || "").join(" ").toLowerCase()
        const note = (report.note || "").toLowerCase()
        return (
          report.id.toString().includes(lowerCaseSearch) ||
          member.includes(lowerCaseSearch) ||
          products.includes(lowerCaseSearch) ||
          note.includes(lowerCaseSearch)
        )
      })
      setFilteredReports(filtered)
    }
  }, [searchTerm, reports])

  return (
    <>
      {/* React Helmet for dynamic meta tags */}
      {metaTags && !isLoadingMeta && (
  <Head>
    <title>{metaTags.title}</title>
    <meta name="description" content={metaTags.description} />
    <meta name="keywords" content={metaTags.keywords} />
    <meta name="author" content={metaTags.author} />
    <meta charSet={metaTags.charset} />
    <meta name="viewport" content={metaTags.viewport} />

    {/* Canonical Link */}
    {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}

    {/* Favicon */}
    {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}

    {/* Open Graph Tags */}
    {metaTags.opengraph && (
      <>
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
      </>
    )}

    {/* Twitter Card Tags */}
    {metaTags.twitter && (
      <>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
      </>
    )}

    {/* Schema.org structured data */}
    {metaTags.schema && <script type="application/ld+json">{metaTags.schema}</script>}
  </Head>
)}

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center">
            <Link href="/">
              <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </Link>
            <h1 className="ml-3 text-xl font-semibold text-gray-800">Bookings & Reports</h1>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          {/* Desktop Layout - Single line */}
          <div className="hidden md:flex md:items-center md:justify-between space-x-3">
            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "bookings"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "reports"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Reports
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "bookings" ? "bookings" : "reports"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-200 hover:border-gray-400"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Mobile Layout - Stacked with spacing */}
          <div className="md:hidden flex flex-col space-y-5">
            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg self-stretch">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "bookings"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === "reports"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Reports
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search ${activeTab === "bookings" ? "bookings" : "reports"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-200"
                />
                <div className="absolute left-3 top-2.5 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button className="inline-flex items-center px-3 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          {activeTab === "bookings" ? (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-72">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-200 animate-ping opacity-20"></div>
                  </div>
                  <p className="mt-6 text-gray-600 font-medium">Loading your bookings...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400 px-4">
                  <div className="bg-red-100 rounded-full p-5 mb-5 shadow-sm">
                    <AlertCircle className="h-9 w-9 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Error Loading Bookings</h3>
                  <p className="mt-3 text-sm max-w-xs text-center text-gray-500">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-7 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredBookings.length === 0 ? (
                searchTerm ? (
                  <div className="flex flex-col items-center justify-center h-72 text-gray-400 px-4">
                    <div className="bg-gray-100 rounded-full p-5 mb-5 shadow-sm">
                      <Search className="h-9 w-9 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">No Results Found</h3>
                    <p className="mt-3 text-sm max-w-xs text-center text-gray-500">
                      We couldn't find any bookings matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-7 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <EmptyState type="bookings" />
                )
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-blue-500">
                    <div className="flex items-center text-blue-700">
                      <Calendar className="h-5 w-5 mr-2" />
                      <h2 className="text-lg font-medium">Your Health Checkup Bookings</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      You have {filteredBookings.length} {filteredBookings.length === 1 ? "booking" : "bookings"} in
                      total.{searchTerm && ` Showing results for "${searchTerm}".`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {filteredBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center h-72">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-green-200 animate-ping opacity-20"></div>
                  </div>
                  <p className="mt-6 text-gray-600 font-medium">Loading your reports...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400 px-4">
                  <div className="bg-red-100 rounded-full p-5 mb-5 shadow-sm">
                    <AlertCircle className="h-9 w-9 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Error Loading Reports</h3>
                  <p className="mt-3 text-sm max-w-xs text-center text-gray-500">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-7 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredReports.length === 0 ? (
                searchTerm ? (
                  <div className="flex flex-col items-center justify-center h-72 text-gray-400 px-4">
                    <div className="bg-gray-100 rounded-full p-5 mb-5 shadow-sm">
                      <Search className="h-9 w-9 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">No Results Found</h3>
                    <p className="mt-3 text-sm max-w-xs text-center text-gray-500">
                      We couldn't find any reports matching "{searchTerm}"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-7 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <EmptyState type="reports" />
                )
              ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-green-500">
                    <div className="flex items-center text-green-700">
                      <FileText className="h-5 w-5 mr-2" />
                      <h2 className="text-lg font-medium">Your Health Reports</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      You have {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"} in total.
                      {searchTerm && ` Showing results for "${searchTerm}".`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {filteredReports.map((report) => (
                      <MyReportCard key={report.id} report={report} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default BookingAndReportsComponent
