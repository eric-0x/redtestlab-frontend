"use client"

import { useState, useEffect } from "react"
export interface User {
  id: number
  email: string
  password?: string
  name?: string
  role: string
  createdAt: string
  updatedAt: string
  googleId?: string
}

export interface Category {
  id: number
  name?: string
  description?: string
}

export interface Product {
  id: number
  name?: string
  desc?: string
  reportTime?: number
  parameters?: string
  tags?: string
  actualPrice?: number
  discountedPrice?: number
  categoryId?: number
  productType?: string
  sampleType?: string
  preparation?: string
  homeCollection?: boolean
  labCollection?: boolean
  reportDelivery?: string
  category?: Category
}

export interface Test {
  id: number
  name?: string
  desc?: string
  reportIn?: string
  testCount?: string
  price?: string
  discountedPrice?: string
  categoryName?: string
  sampleType?: string
  preparation?: string
  normalRange?: string
  methodology?: string
}

export interface CustomPackageItem {
  id: number
  customPackageId: number
  productId?: number
  testId?: number
  product?: Product
  test?: Test
}

export interface CustomPackage {
  id: number
  name: string
  description?: string
  totalPrice?: number
  discountedPrice?: number
  items: CustomPackageItem[]
}

export interface BookingItem {
  id: number
  bookingId: number
  productId?: number
  customPackageId?: number
  quantity: number
  price: number
  product?: Product
  customPackage?: CustomPackage
}

export interface ServiceProvider {
  id: string
  email?: string
  labName?: string
  registrationNumber?: string
  ownerName?: string
  contactNumber?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  latitude?: number
  longitude?: number
  openingTime?: string
  closingTime?: string
  operatingDays?: string[]
  servicesOffered: string[]
  testsAvailable: string[]
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  reportDeliveryMethods?: string[]
  homeCollectionCharges?: number
  minimumOrderValue?: number
  reportGenerationTime?: string
  paymentModesAccepted?: string[]
  commissionPercentage?: number
  gstNumber?: string
  licenseUrl?: string
  ownerIdProofUrl?: string
  labImagesUrls: string[]
  createdAt?: string
  updatedAt?: string
  coins?: number
  pendingPayoutAmount?: number
}

export interface Booking {
  id: number
  userId: number
  razorpayOrderId: string
  razorpayPaymentId?: string
  status: string
  amount: number
  bookingType: string
  assignedToId?: string
  assignedCoins?: number
  resultFileUrl?: string
  remarks?: string
  rejectionReason?: string
  otpCode?: string
  otpVerified?: boolean
  otpGeneratedAt?: string
  createdAt: string
  updatedAt: string
  user?: User
  assignedTo?: ServiceProvider
  items?: BookingItem[]
}

export interface OTPStatus {
  hasOTP: boolean
  isVerified: boolean
  isExpired: boolean
  generatedAt: string | null
  canUploadResults: boolean
  bookingStatus: string
}


const BASE_URL = "https://redtestlab.com"

const ProviderPanel = () => {
  const [assignedBookings, setAssignedBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [serviceId, setServiceId] = useState("")

  // Modal States
  const [otpModal, setOtpModal] = useState<{
    isOpen: boolean
    booking: Booking | null
    otpStatus: OTPStatus | null
  }>({ isOpen: false, booking: null, otpStatus: null })

  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({ isOpen: false, booking: null })

  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({ isOpen: false, booking: null })

  // Form States
  const [fileUrl, setFileUrl] = useState("")
  const [remarks, setRemarks] = useState("")
  const [otpInput, setOtpInput] = useState("")
  const [otpError, setOtpError] = useState("")
  const [otpSuccess, setOtpSuccess] = useState("")

  useEffect(() => {
    const storedServiceId = localStorage.getItem("serviceId") || "ccbdbf47-f04d-4284-be76-fb4efa44699e"
    setServiceId(storedServiceId)
    fetchAssignedBookings(storedServiceId)
  }, [])

  const fetchAssignedBookings = async (providerId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/provider/${providerId}/assigned`)
      const data = await response.json()
      setAssignedBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching assigned bookings:", error)
      setAssignedBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOTPStatus = async (bookingId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/bookings/otp-status/${bookingId}?providerId=${serviceId}`)
      const data = await response.json()
      return data.success ? data.otpStatus : null
    } catch (error) {
      console.error("Error fetching OTP status:", error)
      return null
    }
  }

  const handleAcceptBooking = async (bookingId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/provider/accept/${bookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: serviceId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        await fetchAssignedBookings(serviceId)

        // Show OTP modal after successful acceptance
        const booking = assignedBookings.find((b) => b.id === bookingId)
        if (booking) {
          const otpStatus = await fetchOTPStatus(bookingId)
          setOtpModal({
            isOpen: true,
            booking: { ...booking, status: "IN_PROGRESS" },
            otpStatus,
          })
        }

        alert("Booking accepted successfully! OTP has been sent to the customer.")
      } else {
        const errorData = await response.json()
        alert(`Failed to accept booking: ${errorData.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error accepting booking:", error)
      alert("Error accepting booking")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otpModal.booking || !otpInput.trim()) {
      setOtpError("Please enter the OTP")
      return
    }

    try {
      setLoading(true)
      setOtpError("")
      setOtpSuccess("")

      const response = await fetch(`${BASE_URL}/api/bookings/verify-otp/${otpModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otpInput.trim(),
          providerId: serviceId,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setOtpSuccess("OTP verified successfully! You can now upload results.")
        await fetchAssignedBookings(serviceId)

        // Update OTP status
        const updatedOtpStatus = await fetchOTPStatus(otpModal.booking.id)
        setOtpModal((prev) => ({
          ...prev,
          otpStatus: updatedOtpStatus,
        }))

        setTimeout(() => {
          setOtpModal({ isOpen: false, booking: null, otpStatus: null })
          setOtpInput("")
          setOtpSuccess("")
        }, 2000)
      } else {
        setOtpError(result.message || "Failed to verify OTP")
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setOtpError("Error verifying OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateOTP = async () => {
    if (!otpModal.booking) return

    try {
      setLoading(true)
      setOtpError("")
      setOtpSuccess("")

      const response = await fetch(`${BASE_URL}/api/bookings/regenerate-otp/${otpModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: serviceId,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setOtpSuccess("New OTP has been sent to the customer!")

        // Update OTP status
        const updatedOtpStatus = await fetchOTPStatus(otpModal.booking.id)
        setOtpModal((prev) => ({
          ...prev,
          otpStatus: updatedOtpStatus,
        }))

        setOtpInput("")
      } else {
        setOtpError(result.message || "Failed to regenerate OTP")
      }
    } catch (error) {
      console.error("Error regenerating OTP:", error)
      setOtpError("Error regenerating OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    const rejectionReason = prompt("Please provide a reason for rejection (optional):")
    if (!confirm("Are you sure you want to reject this booking?")) return

    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/provider/reject/${bookingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: serviceId,
          rejectionReason,
        }),
      })

      if (response.ok) {
        await fetchAssignedBookings(serviceId)
        alert("Booking rejected successfully!")
      } else {
        alert("Failed to reject booking")
      }
    } catch (error) {
      console.error("Error rejecting booking:", error)
      alert("Error rejecting booking")
    } finally {
      setLoading(false)
    }
  }

  const handleUploadResult = async () => {
    if (!uploadModal.booking || !fileUrl || !remarks) return

    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/provider/upload-result/${uploadModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          remarks,
          providerId: serviceId,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchAssignedBookings(serviceId)
        setUploadModal({ isOpen: false, booking: null })
        setFileUrl("")
        setRemarks("")
        alert("Result uploaded successfully!")
      } else {
        alert(result.message || "Failed to upload result")
      }
    } catch (error) {
      console.error("Error uploading result:", error)
      alert("Error uploading result")
    } finally {
      setLoading(false)
    }
  }

  const handleShowOTPModal = async (booking: Booking) => {
    const otpStatus = await fetchOTPStatus(booking.id)
    setOtpModal({ isOpen: true, booking, otpStatus })
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
    }).format(amount)
  }

  const parseParameters = (parametersString: string) => {
    try {
      return JSON.parse(parametersString)
    } catch {
      return {}
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "RETURNED_TO_ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "⏳"
      case "IN_PROGRESS":
        return "🔄"
      case "RETURNED_TO_ADMIN":
        return "✅"
      default:
        return "📄"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assigned Booking</h1>
                <p className="text-gray-600 mt-1">Manage your assigned bookings ({assignedBookings.length})</p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Service ID:</label>
                <input
                  type="text"
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value)
                    localStorage.setItem("serviceId", e.target.value)
                  }}
                  onBlur={() => fetchAssignedBookings(serviceId)}
                  className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your service ID"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading bookings...</span>
            </div>
          )}

          {!loading && assignedBookings.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Bookings</h3>
              <p className="text-gray-500">You don't have any assigned bookings at the moment.</p>
            </div>
          )}

          {!loading &&
            assignedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Booking Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(booking.status)}</span>
                        <h2 className="text-xl font-semibold text-gray-900">Booking #{booking.id}</h2>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                      {booking.otpVerified && (
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                          ✅ OTP Verified
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setDetailsModal({ isOpen: true, booking })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        📄 View Details
                      </button>

                      {booking.status === "ASSIGNED" && (
                        <>
                          <button
                            onClick={() => handleAcceptBooking(booking.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => handleRejectBooking(booking.id)}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}

                      {booking.status === "IN_PROGRESS" && (
                        <>
                          <button
                            onClick={() => handleShowOTPModal(booking)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                             Verify OTP
                          </button>
                          {booking.otpVerified && (
                            <button
                              onClick={() => setUploadModal({ isOpen: true, booking })}
                              className="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
                            >
                               Upload Result
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">👤 Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{booking.user?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{booking.user?.email || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer ID:</span>
                          <span className="font-medium">{booking.userId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="font-medium">{booking.user?.role || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">💰 Booking Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-green-600">{formatCurrency(booking.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{booking.bookingType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coins:</span>
                          <span className="font-medium text-yellow-600">{booking.assignedCoins || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned:</span>
                          <span className="font-medium">{formatDate(booking.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono text-xs">{booking.razorpayPaymentId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result Information */}
                  {booking.resultFileUrl && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-green-800 mb-2 flex items-center">📋 Test Results Uploaded</h3>
                      <div className="space-y-2">
                        <a
                          href={booking.resultFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          📄 View Report
                        </a>
                        {booking.remarks && (
                          <p className="text-sm text-gray-700">
                            <strong>Remarks:</strong> {booking.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items Preview */}
                  {booking.items && booking.items.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        📦 Items ({booking.items.length})
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        {booking.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.product?.name || item.customPackage?.name || "Unknown Item"}
                                  </h4>
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {item.product?.productType || "PACKAGE"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 space-x-4">
                                  <span>Qty: {item.quantity}</span>
                                  {item.product?.reportTime && <span>Report Time: {item.product.reportTime}h</span>}
                                  {item.product?.tags && <span>Tags: {item.product.tags}</span>}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                                {item.product?.actualPrice && (
                                  <div className="text-xs text-gray-500">
                                    Original: {formatCurrency(item.product.actualPrice)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Details */}
                            {item.product && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  {item.product.desc && (
                                    <div>
                                      <span className="font-medium text-gray-700">Description:</span>
                                      <p className="text-gray-600 mt-1">{item.product.desc}</p>
                                    </div>
                                  )}
                                  {item.product.sampleType && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Sample Type:</span>
                                      <span className="font-medium">{item.product.sampleType}</span>
                                    </div>
                                  )}
                                  {item.product.preparation && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Preparation:</span>
                                      <span className="font-medium">{item.product.preparation}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  {item.product.homeCollection !== undefined && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Home Collection:</span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          item.product.homeCollection
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {item.product.homeCollection ? "Available" : "Not Available"}
                                      </span>
                                    </div>
                                  )}
                                  {item.product.labCollection !== undefined && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Lab Collection:</span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          item.product.labCollection
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {item.product.labCollection ? "Available" : "Not Available"}
                                      </span>
                                    </div>
                                  )}
                                  {item.product.reportDelivery && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Report Delivery:</span>
                                      <span className="font-medium">{item.product.reportDelivery}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Custom Package Details */}
                            {item.customPackage && (
                              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-medium text-purple-900 mb-2">Custom Package Details</h5>
                                {item.customPackage.description && (
                                  <p className="text-sm text-purple-700 mb-2">{item.customPackage.description}</p>
                                )}
                                {item.customPackage.items && item.customPackage.items.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-sm font-medium text-purple-800">
                                      Package Items ({item.customPackage.items.length}):
                                    </span>
                                    <div className="space-y-1">
                                      {item.customPackage.items.slice(0, 3).map((packageItem) => (
                                        <div
                                          key={packageItem.id}
                                          className="text-sm text-purple-700 flex justify-between"
                                        >
                                          <span>
                                            {packageItem.product?.name || packageItem.test?.name || "Unknown Item"}
                                          </span>
                                          <span>
                                            {packageItem.product?.discountedPrice
                                              ? formatCurrency(packageItem.product.discountedPrice)
                                              : packageItem.test?.discountedPrice || packageItem.test?.price
                                                ? formatCurrency(
                                                    Number.parseFloat(
                                                      packageItem.test.discountedPrice || packageItem.test.price || "0",
                                                    ),
                                                  )
                                                : "N/A"}
                                          </span>
                                        </div>
                                      ))}
                                      {item.customPackage.items.length > 3 && (
                                        <div className="text-xs text-purple-600">
                                          +{item.customPackage.items.length - 3} more items
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Parameters */}
                            {item.product?.parameters && (
                              <div className="mt-3">
                                <span className="text-sm font-medium text-gray-700">Parameters:</span>
                                <div className="mt-1 bg-gray-100 rounded p-2 text-xs">
                                  {Object.entries(parseParameters(item.product.parameters)).map(([key, value]) => (
                                    <div key={key} className="flex justify-between py-1">
                                      <span className="font-medium">{key}:</span>
                                      <span>{String(value)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {booking.items.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => setDetailsModal({ isOpen: true, booking })}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              +{booking.items.length - 3} more items (Click to view all details)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🔐 OTP Verification</h3>
              <button
                onClick={() => {
                  setOtpModal({ isOpen: false, booking: null, otpStatus: null })
                  setOtpInput("")
                  setOtpError("")
                  setOtpSuccess("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Verify the OTP sent to the customer before uploading results for Booking #{otpModal.booking?.id}
            </p>

            <div className="space-y-4">
              {otpModal.otpStatus && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>OTP Status:</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        otpModal.otpStatus.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {otpModal.otpStatus.isVerified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </div>

                  {otpModal.otpStatus.generatedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Generated:</span>
                      <span className="text-gray-600">{formatDate(otpModal.otpStatus.generatedAt)}</span>
                    </div>
                  )}

                  {otpModal.otpStatus.isExpired && !otpModal.otpStatus.isVerified && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">⚠️</span>
                        <span className="text-red-800 text-sm">OTP has expired. Please regenerate a new one.</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!otpModal.otpStatus?.isVerified && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setOtpInput(value)
                        setOtpError("")
                      }}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-3 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {otpError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">❌</span>
                        <span className="text-red-800 text-sm">{otpError}</span>
                      </div>
                    </div>
                  )}

                  {otpSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <span className="text-green-800 text-sm">{otpSuccess}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || otpInput.length !== 6}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button
                      onClick={handleRegenerateOTP}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      🔄 Regenerate
                    </button>
                  </div>
                </>
              )}

              {otpModal.otpStatus?.isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✅</span>
                    <span className="text-green-800 text-sm">
                      OTP has been verified successfully! You can now upload results for this booking.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Result Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📤 Upload Result</h3>
              <button
                onClick={() => {
                  setUploadModal({ isOpen: false, booking: null })
                  setFileUrl("")
                  setRemarks("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">Upload test results for Booking #{uploadModal.booking?.id}</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">File URL</label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://example.com/report.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks about the test results"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setUploadModal({ isOpen: false, booking: null })
                    setFileUrl("")
                    setRemarks("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadResult}
                  disabled={!fileUrl || !remarks || loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Result"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.booking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">📋 Booking Details #{detailsModal.booking.id}</h3>
                <button
                  onClick={() => setDetailsModal({ isOpen: false, booking: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Overview Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">👤 Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{detailsModal.booking.user?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{detailsModal.booking.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer ID:</span>
                      <span className="font-medium">{detailsModal.booking.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">{detailsModal.booking.user?.role || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Google ID:</span>
                      <span className="font-medium">{detailsModal.booking.user?.googleId || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">💰 Booking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(detailsModal.booking.status)}`}>
                        {detailsModal.booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-green-600">{formatCurrency(detailsModal.booking.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{detailsModal.booking.bookingType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coins Assigned:</span>
                      <span className="font-medium text-yellow-600">{detailsModal.booking.assignedCoins || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(detailsModal.booking.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Updated:</span>
                      <span className="font-medium">{formatDate(detailsModal.booking.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">💳 Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-xs">{detailsModal.booking.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-xs">{detailsModal.booking.razorpayOrderId}</span>
                  </div>
                  {detailsModal.booking.otpVerified !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">OTP Status:</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          detailsModal.booking.otpVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {detailsModal.booking.otpVerified ? "✅ Verified" : "⏳ Pending"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Results */}
              {detailsModal.booking.resultFileUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-green-800 mb-3">📋 Test Results</h4>
                  <div className="space-y-2">
                    <a
                      href={detailsModal.booking.resultFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      📄 Download Report
                    </a>
                    {detailsModal.booking.remarks && (
                      <p className="text-sm text-gray-700">
                        <strong>Remarks:</strong> {detailsModal.booking.remarks}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Items */}
              {detailsModal.booking.items && detailsModal.booking.items.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">
                    📦 Complete Items Details ({detailsModal.booking.items.length})
                  </h4>
                  <div className="space-y-6">
                    {detailsModal.booking.items.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="text-lg font-medium text-gray-900">
                              {item.product?.name || item.customPackage?.name || "Unknown Item"}
                            </h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {item.product?.productType || "PACKAGE"}
                              </span>
                              <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">{formatCurrency(item.price)}</p>
                            {item.product?.actualPrice && (
                              <p className="text-sm text-gray-500">
                                Original: {formatCurrency(item.product.actualPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        {item.product && (
                          <div className="space-y-4">
                            {item.product.desc && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-1">Description:</h6>
                                <p className="text-gray-600 text-sm">{item.product.desc}</p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h6 className="font-medium text-gray-700">Test Information</h6>
                                <div className="space-y-2 text-sm">
                                  {item.product.reportTime && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Report Time:</span>
                                      <span className="font-medium">{item.product.reportTime} hours</span>
                                    </div>
                                  )}
                                  {item.product.tags && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Tags:</span>
                                      <span className="font-medium">{item.product.tags}</span>
                                    </div>
                                  )}
                                  {item.product.categoryId && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Category ID:</span>
                                      <span className="font-medium">{item.product.categoryId}</span>
                                    </div>
                                  )}
                                  {item.product.category?.name && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Category:</span>
                                      <span className="font-medium">{item.product.category.name}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h6 className="font-medium text-gray-700">Collection & Delivery</h6>
                                <div className="space-y-2 text-sm">
                                  {item.product.sampleType && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Sample Type:</span>
                                      <span className="font-medium">{item.product.sampleType}</span>
                                    </div>
                                  )}
                                  {item.product.preparation && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Preparation:</span>
                                      <span className="font-medium">{item.product.preparation}</span>
                                    </div>
                                  )}
                                  {item.product.homeCollection !== undefined && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Home Collection:</span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          item.product.homeCollection
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {item.product.homeCollection ? "Available" : "Not Available"}
                                      </span>
                                    </div>
                                  )}
                                  {item.product.labCollection !== undefined && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Lab Collection:</span>
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          item.product.labCollection
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {item.product.labCollection ? "Available" : "Not Available"}
                                      </span>
                                    </div>
                                  )}
                                  {item.product.reportDelivery && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Report Delivery:</span>
                                      <span className="font-medium">{item.product.reportDelivery}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Parameters */}
                            {item.product.parameters && (
                              <div>
                                <h6 className="font-medium text-gray-700 mb-2">Test Parameters:</h6>
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                    {Object.entries(parseParameters(item.product.parameters)).map(([key, value]) => (
                                      <div
                                        key={key}
                                        className="flex justify-between py-1 border-b border-gray-200 last:border-b-0"
                                      >
                                        <span className="font-medium text-gray-700">{key}:</span>
                                        <span className="text-gray-600">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Custom Package Details */}
                        {item.customPackage && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h6 className="font-medium text-purple-900 mb-3">📦 Custom Package Details</h6>
                            {item.customPackage.description && (
                              <p className="text-sm text-purple-700 mb-3">{item.customPackage.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                              {item.customPackage.totalPrice && (
                                <div className="flex justify-between">
                                  <span className="text-purple-600">Total Price:</span>
                                  <span className="font-medium">{formatCurrency(item.customPackage.totalPrice)}</span>
                                </div>
                              )}
                              {item.customPackage.discountedPrice && (
                                <div className="flex justify-between">
                                  <span className="text-purple-600">Discounted Price:</span>
                                  <span className="font-medium">
                                    {formatCurrency(item.customPackage.discountedPrice)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {item.customPackage.items && item.customPackage.items.length > 0 && (
                              <div>
                                <h6 className="font-medium text-purple-800 mb-2">
                                  Package Items ({item.customPackage.items.length}):
                                </h6>
                                <div className="space-y-3">
                                  {item.customPackage.items.map((packageItem) => (
                                    <div key={packageItem.id} className="bg-white rounded p-3 border border-purple-200">
                                      <div className="flex justify-between items-start mb-2">
                                        <div>
                                          <h6 className="font-medium text-gray-900">
                                            {packageItem.product?.name || packageItem.test?.name || "Unknown Item"}
                                          </h6>
                                          <span className="text-xs text-purple-600">
                                            {packageItem.product ? "Product" : "Test"}
                                          </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                          {packageItem.product?.discountedPrice
                                            ? formatCurrency(packageItem.product.discountedPrice)
                                            : packageItem.test?.discountedPrice || packageItem.test?.price
                                              ? formatCurrency(
                                                  Number.parseFloat(
                                                    packageItem.test.discountedPrice || packageItem.test.price || "0",
                                                  ),
                                                )
                                              : "N/A"}
                                        </span>
                                      </div>

                                      {/* Product/Test specific details */}
                                      {packageItem.product && (
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          {packageItem.product.reportTime && (
                                            <span>Report: {packageItem.product.reportTime}h</span>
                                          )}
                                          {packageItem.product.sampleType && (
                                            <span>Sample: {packageItem.product.sampleType}</span>
                                          )}
                                        </div>
                                      )}

                                      {packageItem.test && (
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          {packageItem.test.reportIn && (
                                            <span>Report: {packageItem.test.reportIn}</span>
                                          )}
                                          {packageItem.test.testCount && (
                                            <span>Tests: {packageItem.test.testCount}</span>
                                          )}
                                          {packageItem.test.categoryName && (
                                            <span>Category: {packageItem.test.categoryName}</span>
                                          )}
                                          {packageItem.test.sampleType && (
                                            <span>Sample: {packageItem.test.sampleType}</span>
                                          )}
                                        </div>
                                      )}

                                      {/* Test description */}
                                      {packageItem.test?.desc && (
                                        <p className="text-xs text-gray-600 mt-2">{packageItem.test.desc}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderPanel
