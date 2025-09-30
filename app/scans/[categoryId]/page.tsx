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
          <div className="text-center max-w-md mx-auto">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {locationActive ? "Finding Labs Near You" : "Loading Available Tests"}
            </h3>
            <p className="text-gray-600 mb-6">
              {locationActive 
                ? "Searching for the best labs in your area" 
                : "Fetching the latest test options"
              }
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
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
          <div className="text-center max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchScans}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/scans")}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Scans
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

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20">
        {/* Professional Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 md:py-5">
              <div className="flex items-center space-x-3 md:space-x-5">
                <button
                  onClick={() => router.push("/scans")}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group p-1.5 rounded-lg hover:bg-gray-100/60"
                >
                  <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="font-medium hidden sm:inline">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-700">
                      {selectedCategory?.name || "Medical"} Tests
                    </h1>
                    {locationActive && (
                      <span className="flex items-center px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs sm:text-sm font-medium border border-green-100">
                        <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                        <span className="hidden sm:inline">Location Active</span>
                        <span className="sm:hidden">GPS</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                    {locationActive && userLocation && (
                      <span className="flex items-center text-blue-600">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">{locationFilter.radius}km</span> radius
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Active Filters Display */}
          {(searchQuery || locationActive || locationFilter.city || locationFilter.state) && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {locationActive && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    GPS Location ({locationFilter.radius}km)
                    <button
                      onClick={() => {
                        setLocationActive(false)
                        setUserLocation(null)
                      }}
                      className="ml-2 hover:text-green-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {locationFilter.city && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    City: {locationFilter.city}
                    <button
                      onClick={() => setLocationFilter((prev) => ({ ...prev, city: "" }))}
                      className="ml-2 hover:text-purple-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {locationFilter.state && (
                  <span className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                    State: {locationFilter.state}
                    <button
                      onClick={() => setLocationFilter((prev) => ({ ...prev, state: "" }))}
                      className="ml-2 hover:text-orange-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results Section */}
          {filteredScans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Tests Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your filters or search criteria to find available tests in this category</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow hover:scale-105 active:scale-95"
                >
                  Clear All Filters
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                    className="group bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-blue-100 hover:-translate-y-1"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 pr-3">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {scan.title}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2 text-sm">
                            <span className="flex items-center text-gray-700 font-medium">
                              <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
                              <span className="line-clamp-1">{scan.scanCenter.name}</span>
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                scan.scanCenter.type === "HOSPITAL"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : scan.scanCenter.type === "CLINIC"
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-purple-50 text-purple-700 border border-purple-100"
                              }`}
                            >
                              {scan.scanCenter.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {scan.isVerified && (
                            <span className="flex items-center px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {discountPercentage > 0 && (
                            <span className="flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="flex-1 line-clamp-2">
                          {scan.scanCenter.address}, {scan.scanCenter.city}
                        </span>
                        {distance && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap border border-blue-100">
                            {distance.toFixed(1)}km
                          </span>
                        )}
                      </div>

                      {/* Description - only show on larger screens */}
                      {scan.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 hidden sm:block">{scan.description}</p>
                      )}

                      {/* Test Details */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {scan.waitTime && (
                          <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-lg border border-gray-100">
                            <Timer className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-blue-600" />
                            <span>{scan.waitTime}</span>
                          </div>
                        )}
                        {scan.reportTimeEstimate && (
                          <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 rounded-lg border border-gray-100">
                            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-green-600" />
                            <span>Report in {scan.reportTimeEstimate}</span>
                          </div>
                        )}
                      </div>

                      {/* Price and CTA */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl sm:text-2xl font-bold text-gray-900">₹{finalPrice}</span>
                              {scan.discountedPrice && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">₹{originalPrice}</span>
                              )}
                            </div>
                            {discountPercentage > 0 && (
                              <p className="text-xs text-green-600 font-medium mt-0.5">
                                Save ₹{originalPrice - finalPrice}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleBookNow(scan)}
                            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow hover:scale-105 active:scale-95"
                          >
                            Book Now
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500 mt-3">
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            <span className="hidden sm:inline">Instant</span> confirmation
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            Digital reports
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Professional Booking Modal */}
        {showBookingModal && selectedScan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-fadeIn animate-slideUp">
              {/* Header - Sticky on mobile */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Book Your Test</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Complete your booking details</p>
                </div>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setBookingError(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  aria-label="Close booking form"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Selected Test Info */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{selectedScan.title}</h3>
                    <div className="space-y-1.5">
                      <p className="text-xs sm:text-sm text-gray-700 flex items-center">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600 flex-shrink-0" />
                        <span className="line-clamp-1">{selectedScan.scanCenter.name}, {selectedScan.scanCenter.city}</span>
                      </p>
                      {selectedScan.waitTime && (
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-600 flex-shrink-0" />
                          {selectedScan.waitTime}
                        </p>
                      )}
                      {selectedScan.reportTimeEstimate && (
                        <p className="text-xs sm:text-sm text-gray-700 flex items-center">
                          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-purple-600 flex-shrink-0" />
                          Report in {selectedScan.reportTimeEstimate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2 sm:gap-1 mt-2 sm:mt-0">
                    <div>
                      {selectedScan.discountedPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-2xl font-bold text-gray-900">₹{selectedScan.discountedPrice}</span>
                          <span className="text-xs sm:text-sm text-gray-500 line-through">₹{selectedScan.price}</span>
                        </div>
                      ) : (
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">₹{selectedScan.price}</span>
                      )}
                      {selectedScan.discountedPrice && (
                        <p className="text-xs text-green-600 font-medium hidden sm:block">
                          Save ₹{selectedScan.price - selectedScan.discountedPrice}
                        </p>
                      )}
                    </div>
                    {selectedScan.isVerified && (
                      <div className="flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>Verified Lab</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-2">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">{bookingError}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                        value={bookingForm.phoneNumber}
                        onChange={(e) => setBookingForm({ ...bookingForm, phoneNumber: e.target.value })}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Your Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm appearance-none"
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                    >
                      <option value="">Select preferred time</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 7 PM)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm resize-none"
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    placeholder="Special notes (e.g., diabetic, pregnant, fasting)"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="relative flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
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
                        className="mr-2 sm:mr-3 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">Pay Online</div>
                        <div className="text-xs text-gray-600 mt-0.5">UPI, Card, Net Banking</div>
                      </div>
                    </label>
                    <label className="relative flex items-center p-3 sm:p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
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
                        className="mr-2 sm:mr-3 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">Pay at Lab</div>
                        <div className="text-xs text-gray-600 mt-0.5">Pay during your visit</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Fixed bottom action buttons on mobile */}
                <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-0 sm:border-0 sm:bg-transparent mt-4 sm:mt-6 -mx-4 sm:mx-0">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingModal(false)
                        setBookingError(null)
                      }}
                      className="flex-1 px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {bookingLoading
                        ? "Processing..."
                        : `Confirm - ₹${selectedScan.discountedPrice || selectedScan.price}`}
                    </button>
                  </div>
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