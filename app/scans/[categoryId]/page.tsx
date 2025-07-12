"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Head from "next/head"
import Script from "next/script"
import {
  ChevronLeft,
  Search,
  MapPin,
  Clock,
  Shield,
  Filter,
  Navigation,
  User,
  Phone,
  Calendar,
  CreditCard,
  X,
  CheckCircle,
  Building2,
  Timer,
  FileText,
  SlidersHorizontal,
  Target,
  ChevronDown,
  MapPinOff,
} from "lucide-react"

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

// Suppress Google Sign-In console warnings
// This is kept as per user instruction "not to ignore anything",
// but generally not recommended for production.
if (typeof window !== "undefined") {
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn

  console.error = (...args) => {
    if (args[0]?.includes?.("GSI_LOGGER") || args[0]?.includes?.("FedCM")) {
      return
    }
    originalConsoleError.apply(console, args)
  }

  console.warn = (...args) => {
    if (args[0]?.includes?.("GSI_LOGGER") || args[0]?.includes?.("FedCM")) {
      return
    }
    originalConsoleWarn.apply(console, args)
  }
}

interface ScanModel {
  id: number
  name: string
  description: string
  features: string
  startingPrice: string
  createdAt: string
  updatedAt: string
}

interface ScanCenter {
  id: number
  name: string
  type: "LAB" | "CLINIC" | "HOSPITAL"
  address: string
  city: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  createdAt: string
}

interface Scan {
  id: number
  title: string
  description: string
  price: number
  discountedPrice: number | null
  waitTime: string
  reportTimeEstimate: string
  isVerified: boolean
  tags: string[]
  scanModelId: number
  scanCenterId: number
  scanModel: ScanModel
  scanCenter: ScanCenter
  createdAt: string
}

interface LocationFilter {
  latitude: number | null
  longitude: number | null
  radius: number
  city: string
  state: string
}

interface BookingForm {
  name: string
  phoneNumber: string
  location: string
  file?: string
  preferredTime: string
  notes: string
  paymentMethod: "online" | "cod"
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayInstance {
  open(): void
  on(event: string, handler: (...args: any[]) => void): void
  close(): void
}

const ScanListing: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const categoryId = params?.categoryId as string

  // Backend URL
  const BACKEND_URL = "https://redtestlab.com"

  const [scans, setScans] = useState<Scan[]>([])
  const [filteredScans, setFilteredScans] = useState<Scan[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ScanModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "rating" | "distance">("price")
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    latitude: null,
    longitude: null,
    radius: 10,
    city: "",
    state: "",
  })
  const [showLocationFilter, setShowLocationFilter] = useState(false)

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [locationActive, setLocationActive] = useState(false)

  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    phoneNumber: "",
    location: "",
    preferredTime: "",
    notes: "",
    paymentMethod: "online",
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Fetch meta tags from API
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/6")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 6,
          filename: "ScanListing",
          title: "RedTest Lab - Medical Scans & Imaging",
          description: "Book medical scans and imaging tests at verified labs and hospitals near you with RedTest Lab",
          keywords: "medical scans, imaging tests, CT scan, MRI, ultrasound, X-ray, diagnostic imaging",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: typeof window !== "undefined" ? window.location.href : "",
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Medical Scans",
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

  useEffect(() => {
    if (categoryId) {
      fetchScans()
      fetchCategoryDetails()
    }
  }, [categoryId])

  useEffect(() => {
    filterAndSortScans()
  }, [scans, searchQuery, sortBy, locationFilter, userLocation, locationActive])

  const fetchCategoryDetails = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/scan/scan-models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Failed to fetch category details")
      const data = await response.json()
      const category = data.find((model: ScanModel) => model.id === Number.parseInt(categoryId!))
      setSelectedCategory(category || null)
    } catch (err) {
      console.error("Error fetching category details:", err)
    }
  }

  const fetchScans = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (categoryId) {
        params.append("scanModelId", categoryId)
      }
      // Only add location params if location is active and we have coordinates
      if (locationActive && userLocation) {
        params.append("latitude", userLocation.lat.toString())
        params.append("longitude", userLocation.lng.toString())
        params.append("radius", locationFilter.radius.toString())
      }
      if (locationFilter.city) {
        params.append("city", locationFilter.city)
      }
      if (locationFilter.state) {
        params.append("state", locationFilter.state)
      }

      const url = `${BACKEND_URL}/api/scan/scans?${params.toString()}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setScans(data)
      } else {
        setScans([])
      }
    } catch (err) {
      console.error("Error fetching scans:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch scans")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortScans = () => {
    const filtered = scans.filter((scan) => {
      const matchesSearch =
        scan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.scanCenter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.scanCenter.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLocation = (() => {
        // If location is active, only show scans with valid coordinates
        if (locationActive && userLocation) {
          if (!scan.scanCenter.latitude || !scan.scanCenter.longitude) {
            return false // Exclude scans without coordinates when location filter is active
          }
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            scan.scanCenter.latitude,
            scan.scanCenter.longitude,
          )
          return distance <= locationFilter.radius
        }
        // City-based filtering (when location is not active)
        if (locationFilter.city && !scan.scanCenter.city.toLowerCase().includes(locationFilter.city.toLowerCase())) {
          return false
        }
        return true
      })()

      return matchesSearch && matchesLocation
    })

    // Sort scans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          const priceA = a.discountedPrice || a.price
          const priceB = b.discountedPrice || b.price
          return priceA - priceB
        case "rating":
          return (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0)
        case "distance":
          if (
            locationActive &&
            userLocation &&
            a.scanCenter.latitude &&
            a.scanCenter.longitude &&
            b.scanCenter.latitude &&
            b.scanCenter.longitude
          ) {
            const distanceA = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              a.scanCenter.latitude,
              a.scanCenter.longitude,
            )
            const distanceB = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              b.scanCenter.latitude,
              b.scanCenter.longitude,
            )
            return distanceA - distanceB
          }
          return a.scanCenter.city.localeCompare(b.scanCenter.city)
        default:
          return 0
      }
    })
    setFilteredScans(filtered)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getCurrentLocation = () => {
    if (locationActive) {
      // If location is already active, disable it
      setLocationActive(false)
      setUserLocation(null)
      setLocationFilter((prev) => ({
        ...prev,
        latitude: null,
        longitude: null,
      }))
      return
    }
    if (typeof window !== "undefined" && navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          setLocationFilter((prev) => ({
            ...prev,
            latitude: location.lat,
            longitude: location.lng,
          }))
          setLocationActive(true)
          setLoading(false)
        },
        (error) => {
          setLoading(false)
          console.error("Error getting location:", error)
          let errorMessage = "Unable to get your location. "
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access and try again."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out."
              break
            default:
              errorMessage += "An unknown error occurred."
              break
          }
          alert(errorMessage + " You can still search by city manually.")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      )
    } else {
      alert("Geolocation is not supported by this browser. Please enter city manually.")
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setLocationFilter({ latitude: null, longitude: null, radius: 10, city: "", state: "" })
    setUserLocation(null)
    setLocationActive(false)
    setShowLocationFilter(false)
  }

  const handleBookNow = (scan: Scan) => {
    setSelectedScan(scan)
    setShowBookingModal(true)
    setBookingError(null)
  }

  const handlePayment = async () => {
    if (!selectedScan) return
    const finalPrice = selectedScan.discountedPrice || selectedScan.price

    if (bookingForm.paymentMethod === "cod") {
      return handleBooking()
    }

    try {
      setBookingLoading(true)
      setBookingError(null)

      if (!razorpayLoaded) {
        throw new Error("Payment gateway not loaded. Please try again.")
      }

      const orderResponse = await fetch(`${BACKEND_URL}/api/scan/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalPrice,
          scanId: selectedScan.id,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order")
      }
      const orderData = await orderResponse.json()

      const options: RazorpayOptions = {
        key: "rzp_test_Iycvp4aODn242I", // Use environment variable
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HealthScan Platform",
        description: `${selectedScan.title} at ${selectedScan.scanCenter.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch(`${BACKEND_URL}/api/scan/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed")
            }
            await handleBooking(response.razorpay_order_id, response.razorpay_payment_id)
          } catch (error) {
            console.error("Payment verification error:", error)
            setBookingError("Payment verification failed. Please contact support.")
          }
        },
        prefill: {
          name: bookingForm.name,
          email: "",
          contact: bookingForm.phoneNumber,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            setBookingLoading(false)
          },
        },
      }

      if (typeof window !== "undefined" && window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        throw new Error("Razorpay SDK not loaded or window is undefined")
      }
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBooking = async (razorpayOrderId?: string, razorpayPaymentId?: string) => {
    if (!selectedScan) return
    try {
      setBookingLoading(true)
      setBookingError(null)
      const finalPrice = selectedScan.discountedPrice || selectedScan.price
      const bookingData = {
        ...bookingForm,
        scanId: selectedScan.id,
        paidAmount: finalPrice,
        razorpayOrderId,
        razorpayPaymentId,
      }

      const response = await fetch(`${BACKEND_URL}/api/scan/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }
      alert("Booking confirmed! You will receive a confirmation SMS/Email shortly.")
      setShowBookingModal(false)
      setSelectedScan(null)
      setBookingForm({
        name: "",
        phoneNumber: "",
        location: "",
        preferredTime: "",
        notes: "",
        paymentMethod: "online",
      })
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Booking failed")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingForm.name || !bookingForm.phoneNumber || !bookingForm.location) {
      setBookingError("Please fill in all required fields")
      return
    }
    handlePayment()
  }

  if (loading) {
    return (
      <>
        {/* Next.js Head for dynamic meta tags */}
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
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
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
            {metaTags.schema && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
            )}
          </Head>
        )}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              {locationActive ? "Finding labs near you..." : "Loading available tests..."}
            </p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        {/* Next.js Head for dynamic meta tags */}
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
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
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
            {metaTags.schema && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
            )}
          </Head>
        )}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchScans}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          console.error("Failed to load Razorpay script")
          setRazorpayLoaded(false)
        }}
      />

      {/* Next.js Head for dynamic meta tags */}
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
              <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
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
          {metaTags.schema && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
          )}
        </Head>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mr-6 p-2 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span className="font-medium">Back</span>
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {selectedCategory?.name || "Medical"} Tests
                    </h1>
                    {locationActive && (
                      <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        <Target className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Location Active</span>
                        <span className="sm:hidden">GPS</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {filteredScans.length} tests available
                    </span>
                    {locationActive && userLocation && (
                      <span className="flex items-center text-blue-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        Within {locationFilter.radius}km
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            {/* Search Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search labs, tests, or locations..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters & Sorting
                </h3>
                {(searchQuery || locationActive || locationFilter.city || locationFilter.state) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "price" | "rating" | "distance")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="rating">Verified First</option>
                      <option value="distance">Distance</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Location Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <button
                    onClick={getCurrentLocation}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 font-medium border-2 ${
                      locationActive
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                        : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {locationActive ? (
                      <>
                        <MapPinOff className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Disable GPS</span>
                        <span className="sm:hidden">GPS Off</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Near Me</span>
                        <span className="sm:hidden">GPS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Advanced Filters Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">More Filters</label>
                  <button
                    onClick={() => setShowLocationFilter(!showLocationFilter)}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    <span>Advanced</span>
                    <ChevronDown
                      className={`w-4 h-4 ml-2 transition-transform ${showLocationFilter ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Radius Selector (only when location is active) */}
                {locationActive && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                        value={locationFilter.radius}
                        onChange={(e) =>
                          setLocationFilter((prev) => ({ ...prev, radius: Number.parseInt(e.target.value) }))
                        }
                      >
                        <option value={5}>Within 5 km</option>
                        <option value={10}>Within 10 km</option>
                        <option value={25}>Within 25 km</option>
                        <option value={50}>Within 50 km</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Location Filter Panel */}
              {showLocationFilter && (
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" /> Filter by City/State
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Enter city name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={locationFilter.city}
                        onChange={(e) => setLocationFilter((prev) => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        placeholder="Enter state name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={locationFilter.state}
                        onChange={(e) => setLocationFilter((prev) => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={fetchScans}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        setLocationFilter((prev) => ({ ...prev, city: "", state: "" }))
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || locationActive || locationFilter.city || locationFilter.state) && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-blue-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {locationActive && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    GPS Location ({locationFilter.radius}km)
                    <button
                      onClick={() => {
                        setLocationActive(false)
                        setUserLocation(null)
                      }}
                      className="ml-2 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {locationFilter.city && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    City: {locationFilter.city}
                    <button
                      onClick={() => setLocationFilter((prev) => ({ ...prev, city: "" }))}
                      className="ml-2 hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {locationFilter.state && (
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    State: {locationFilter.state}
                    <button
                      onClick={() => setLocationFilter((prev) => ({ ...prev, state: "" }))}
                      className="ml-2 hover:text-orange-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {filteredScans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {locationActive
                  ? `No tests found within ${locationFilter.radius}km of your location with valid coordinates. Try expanding your search radius or disabling GPS.`
                  : "No tests found matching your criteria. Try adjusting your filters."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
                {!locationActive && (
                  <button
                    onClick={getCurrentLocation}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Find Labs Near Me
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredScans.map((scan) => {
                const distance =
                  locationActive && userLocation && scan.scanCenter.latitude && scan.scanCenter.longitude
                    ? calculateDistance(
                        userLocation.lat,
                        userLocation.lng,
                        scan.scanCenter.latitude,
                        scan.scanCenter.longitude,
                      )
                    : null
                const finalPrice = scan.discountedPrice || scan.price
                const originalPrice = scan.price
                const discountPercentage = scan.discountedPrice
                  ? Math.round(((originalPrice - scan.discountedPrice) / originalPrice) * 100)
                  : 0

                return (
                  <div
                    key={scan.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{scan.title}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                                <span className="font-medium">{scan.scanCenter.name}</span>
                                <span
                                  className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                                    scan.scanCenter.type === "HOSPITAL"
                                      ? "bg-blue-100 text-blue-800"
                                      : scan.scanCenter.type === "CLINIC"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {scan.scanCenter.type}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                              {scan.isVerified && (
                                <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span>Verified</span>
                                </div>
                              )}
                              {discountPercentage > 0 && (
                                <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                                  {discountPercentage}% OFF
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {scan.scanCenter.address}, {scan.scanCenter.city}, {scan.scanCenter.state}
                            </span>
                            {distance && (
                              <span className="ml-3 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                {distance.toFixed(1)}km away
                              </span>
                            )}
                          </div>
                          {scan.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scan.description}</p>
                          )}
                          {/* Test Details */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            {scan.waitTime && (
                              <div className="flex items-center text-gray-600">
                                <Timer className="w-4 h-4 mr-2 text-blue-600" />
                                <span>{scan.waitTime}</span>
                              </div>
                            )}
                            {scan.reportTimeEstimate && (
                              <div className="flex items-center text-gray-600">
                                <FileText className="w-4 h-4 mr-2 text-green-600" />
                                <span>Report in {scan.reportTimeEstimate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Price and Action */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:w-48 flex-shrink-0">
                          <div className="text-center sm:text-right">
                            <div className="mb-4">
                              <div className="flex items-center justify-center sm:justify-end gap-2 mb-1">
                                <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{finalPrice}</span>
                                {scan.discountedPrice && (
                                  <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                                )}
                              </div>
                              {discountPercentage > 0 && (
                                <p className="text-green-600 font-medium text-sm">Save ₹{originalPrice - finalPrice}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleBookNow(scan)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
                            >
                              Book Now
                            </button>
                            <div className="mt-3 space-y-1 text-xs text-gray-500">
                              <p>✓ Instant confirmation</p>
                              <p>✓ Digital reports</p>
                              <p>✓ Free cancellation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedScan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Book Your Test</h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setBookingError(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Test Info */}
              <div className="p-6 bg-blue-50 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedScan.title}</h3>
                    <p className="text-gray-600 flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedScan.scanCenter.name}, {selectedScan.scanCenter.city}
                    </p>
                    {selectedScan.waitTime && (
                      <p className="text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedScan.waitTime}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {selectedScan.discountedPrice ? (
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{selectedScan.discountedPrice}</span>
                        <span className="text-lg text-gray-500 line-through ml-2">₹{selectedScan.price}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">₹{selectedScan.price}</span>
                    )}
                  </div>
                </div>
                {selectedScan.isVerified && (
                  <div className="flex items-center text-green-700">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Verified Lab</span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{bookingError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" /> Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={bookingForm.phoneNumber}
                    onChange={(e) => setBookingForm({ ...bookingForm, phoneNumber: e.target.value })}
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" /> Your Location *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={bookingForm.location}
                    onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" /> Preferred Time
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Any special notes (e.g., diabetic, pregnant, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    <CreditCard className="w-4 h-4 inline mr-2" /> Payment Method *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={bookingForm.paymentMethod === "online"}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            paymentMethod: e.target.value as "online" | "cod",
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">Pay Online</div>
                        <div className="text-sm text-gray-500">Secure payment via UPI, Card, or Net Banking</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={bookingForm.paymentMethod === "cod"}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            paymentMethod: e.target.value as "online" | "cod",
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-semibold">Pay at Lab</div>
                        <div className="text-sm text-gray-500">Pay directly at the lab during your visit</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false)
                      setBookingError(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {bookingLoading
                      ? "Processing..."
                      : `Confirm Booking - ₹${selectedScan.discountedPrice || selectedScan.price}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ScanListing
