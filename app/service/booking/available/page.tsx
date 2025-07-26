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

export interface Address {
  id: number
  userId: number
  name: string
  addressLine: string
  city: string
  state: string
  pincode: string
  landmark?: string
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: number
  userId: number
  name: string
  email?: string
  phoneNumber?: string
  gender?: string
  dateOfBirth?: string
  age?: number
  relation?: string
  createdAt: string
  updatedAt: string
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
  memberId?: number
  addressId?: number
  member?: Member
  address?: Address
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

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
        return ""
      default:
        return ""
    }
  }

  const handleFileSelection = async (file: File) => {
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      setSelectedFile(null);
      setFileUrl("");
      return;
    }
    if (file.size === 0) {
      setUploadError("Selected file appears to be empty. Please choose a different file.");
      setSelectedFile(null);
      setFileUrl("");
      return;
    }
    setSelectedFile(file);
    setUploadError("");
    setFileUrl("");
    setUploading(true);
    try {
      // Determine the resource type based on file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
      const isPdf = fileExtension === 'pdf';
      let uploadUrl = "https://api.cloudinary.com/v1_1/dm8jxispy/auto/upload";
      let uploadPreset = "E-Rickshaw";
      if (isPdf) {
        uploadUrl = "https://api.cloudinary.com/v1_1/dm8jxispy/raw/upload";
      } else if (!isImage) {
        uploadUrl = "https://api.cloudinary.com/v1_1/dm8jxispy/raw/upload";
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      let res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      if (!res.ok && isPdf) {
        // Try alternative approach for PDF
        const alternativeFormData = new FormData();
        alternativeFormData.append("file", file);
        alternativeFormData.append("upload_preset", uploadPreset);
        alternativeFormData.append("resource_type", "raw");
        res = await fetch("https://api.cloudinary.com/v1_1/dm8jxispy/auto/upload", {
          method: "POST",
          body: alternativeFormData,
        });
      }
      if (!res.ok) {
        const errorText = await res.text();
        setUploadError(`Upload failed: ${res.status} ${res.statusText}`);
        setUploading(false);
        setFileUrl("");
        return;
      }
      const data = await res.json();
      if (data.secure_url) {
        setFileUrl(data.secure_url);
        setUploadError("");
      } else {
        setUploadError("Failed to get upload URL from Cloudinary.");
        setFileUrl("");
      }
    } catch (err) {
      setUploadError(`Error uploading file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setFileUrl("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 py-2 sm:px-6 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assigned Booking</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your assigned bookings ({assignedBookings.length})</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <label className="text-sm font-medium text-gray-700">Service ID:</label>
                <input
                  type="text"
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value)
                    localStorage.setItem("serviceId", e.target.value)
                  }}
                  onBlur={() => fetchAssignedBookings(serviceId)}
                  className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your service ID"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {loading && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-0 sm:ml-3 text-gray-600 mt-2 sm:mt-0">Loading bookings...</span>
            </div>
          )}

          {!loading && assignedBookings.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Bookings</h3>
              <p className="text-gray-500">You don't have any assigned bookings at the moment.</p>
            </div>
          )}

          {!loading &&
            assignedBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Booking Header */}
                <div className="px-3 py-3 sm:px-6 sm:py-4 border-b border-gray-200 bg-gray-50">
                  <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                    {/* Left: Info and badge (badge floats right on mobile) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStatusIcon(booking.status)}</span>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Booking #{booking.id}</h2>
                      </div>
                      {/* Status badge: floats right on mobile, inline on desktop */}
                      <span
                        className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full border ${getStatusColor(booking.status)}
                          absolute right-3 top-3 sm:static sm:ml-0 ml-auto`}
                        style={{ minWidth: 'fit-content' }}
                      >
                        {booking.status}
                      </span>
                      {booking.otpVerified && (
                        <span className="px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200 sm:static absolute right-3 top-10 ml-auto sm:ml-0" style={{ minWidth: 'fit-content' }}>
                           OTP Verified
                        </span>
                      )}
                    </div>
                    {/* Right: Action buttons, mobile and desktop layouts differ */}
                    <div className="w-full sm:w-auto flex flex-col gap-2 sm:flex-row sm:space-x-2 sm:gap-0 mt-2 sm:mt-0">
                      {/* ASSIGNED: Reject and Accept on top row, View Details below on mobile */}
                      {booking.status === "ASSIGNED" && (
                        <>
                          <div className="flex flex-row w-full sm:w-auto gap-2 sm:flex-row">
                            <button
                              onClick={() => handleAcceptBooking(booking.id)}
                              disabled={loading}
                              className="flex-1 sm:flex-none order-2 sm:order-1 px-3 py-2 md:py-0 text-xs sm:text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.id)}
                              disabled={loading}
                              className="flex-1 sm:flex-none order-1 sm:order-2 px-3 py-2 md:py-0 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                          <button
                            onClick={() => setDetailsModal({ isOpen: true, booking })}
                            className="w-full md:w-[150px] sm:w-auto mt-2 sm:mt-0 px-3 md:px-8 py-2 md:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            View Details
                          </button>
                        </>
                      )}
                      {/* IN_PROGRESS: OTP and Upload Result, View Details below on mobile */}
                      {booking.status === "IN_PROGRESS" && (
                        <>
                          <div className="flex flex-row w-full md:w-[140px] sm:w-auto sm:flex-row pt-4 md:pt-0">
                            {!booking.otpVerified && (
                              <button
                                onClick={() => handleShowOTPModal(booking)}
                                className="flex-1 px-3 py-2 md:py-0 padding text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                Verify OTP
                              </button>
                            )}
                            {booking.otpVerified && (
                              <button
                                onClick={() => setUploadModal({ isOpen: true, booking })}
                                className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
                              >
                                Upload Result
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => setDetailsModal({ isOpen: true, booking })}
                            className="w-full md:w-[150px] sm:w-auto mt-2 sm:mt-0 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                             View Details
                          </button>
                        </>
                      )}
                      {/* Default: Only View Details on its own row */}
                      {booking.status !== "ASSIGNED" && booking.status !== "IN_PROGRESS" && (
                        <button
                          onClick={() => setDetailsModal({ isOpen: true, booking })}
                          className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           View Details
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Member & Address summary */}
                  <div className="mt-2 text-xs sm:text-sm text-gray-700 flex flex-col gap-1">
                    {booking.member && (
                      <div>
                        <span className="font-medium">👤 Member:</span> {booking.member.name}
                        {booking.member.phoneNumber && (
                          <span> ({booking.member.phoneNumber})</span>
                        )}
                      </div>
                    )}
                    {booking.address && (
                      <div>
                        <span className="font-medium">📍 Address:</span> {booking.address.addressLine}, {booking.address.city}, {booking.address.state}, {booking.address.pincode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Content */}
                <div className="p-3 sm:p-6">
             

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
                           View Report
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
                      <div className="bg-gray-50 rounded-lg p-2 sm:p-4 space-y-4">
                        {booking.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="bg-white rounded-lg p-2 sm:p-4 border border-gray-200">
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 text-sm">
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
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
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
          <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-xs sm:max-w-md mx-2">
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
                      {otpModal.otpStatus.isVerified ? " Verified" : "⏳ Pending"}
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
                        <span className="text-red-600 mr-2"></span>
                        <span className="text-red-800 text-sm">{otpError}</span>
                      </div>
                    </div>
                  )}

                  {otpSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2"></span>
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
                    <span className="text-green-600 mr-2"></span>
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
          <div className="bg-white rounded-lg p-3 sm:p-6 w-full max-w-xs sm:max-w-md mx-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📤 Upload Result</h3>
              <button
                onClick={() => {
                  setUploadModal({ isOpen: false, booking: null })
                  setFileUrl("")
                  setRemarks("")
                  setSelectedFile(null)
                  setUploadError("")
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-4">Upload test results for Booking #{uploadModal.booking?.id}</p>

            <div className="space-y-4">
              {/* Drag and Drop File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${uploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0] || null;
                  if (file) {
                    await handleFileSelection(file);
                  }
                }}
                onClick={() => {
                  document.getElementById('hidden-upload-input')?.click();
                }}
              >
                <input
                  id="hidden-upload-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      await handleFileSelection(file);
                    }
                  }}
                />
                {!selectedFile && !fileUrl && !uploading && (
                  <>
                    <div className="text-4xl mb-2">📂</div>
                    <div className="font-medium text-gray-700">Drag & drop a file here, or <span className="text-blue-600 underline cursor-pointer">browse</span></div>
                    <div className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG, DOC, DOCX, TXT (max 10MB)</div>
                  </>
                )}
                {uploading && (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <div className="text-blue-700 font-medium">Uploading...</div>
                  </div>
                )}
                {(selectedFile || fileUrl) && !uploading && (
                  <div className="flex flex-col items-center">
                    {/* <div className="text-2xl mb-1">✅</div> */}
                    <div className="font-medium text-green-700">File uploaded!</div>
                    <div className="text-xs text-gray-600 mt-1 truncate max-w-full">{selectedFile?.name || fileUrl}</div>
                    {/* {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline mt-1"
                      >
                        View Uploaded File
                      </a>
                    )} */}
                    <button
                      className="mt-2 text-xs text-red-600 underline"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setFileUrl("");
                        setUploadError("");
                      }}
                    >Remove file</button>
                  </div>
                )}
              </div>
              {uploadError && (
                <div className="text-red-600 text-xs mt-1 p-2 bg-red-50 rounded border">
                  <div className="font-medium">{uploadError}</div>
                  {uploadError.includes("Invalid image file") && (
                    <div className="text-xs mt-1">
                      💡 Tip: Your Cloudinary upload preset might be configured for images only. 
                      Contact your admin to enable PDF uploads in the upload preset settings.
                    </div>
                  )}
                </div>
              )}
              {/* Remarks */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks about the test results"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!fileUrl}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setUploadModal({ isOpen: false, booking: null })
                    setFileUrl("")
                    setRemarks("")
                    setSelectedFile(null)
                    setUploadError("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!fileUrl) {
                      setUploadError("Please upload a file first.");
                      return;
                    }
                    if (!remarks) {
                      setUploadError("Please enter remarks.");
                      return;
                    }
                    await handleUploadResult();
                  }}
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
          <div className="bg-white rounded-lg w-full max-w-2xl md:max-w-6xl max-h-[90vh] overflow-y-auto mx-2">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-3 sm:px-6 sm:py-4">
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

            <div className="p-3 sm:p-6">
              {/* Member Details */}
              {detailsModal.booking.member && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">👤 Member Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Name:</span> {detailsModal.booking.member.name}</div>
                    {detailsModal.booking.member.phoneNumber && (
                      <div><span className="font-medium">Phone:</span> {detailsModal.booking.member.phoneNumber}</div>
                    )}
                    {detailsModal.booking.member.gender && (
                      <div><span className="font-medium">Gender:</span> {detailsModal.booking.member.gender}</div>
                    )}
                    {detailsModal.booking.member.dateOfBirth && (
                      <div><span className="font-medium">DOB:</span> {formatDate(detailsModal.booking.member.dateOfBirth)}</div>
                    )}
                    {detailsModal.booking.member.relation && (
                      <div><span className="font-medium">Relation:</span> {detailsModal.booking.member.relation}</div>
                    )}
                    {detailsModal.booking.member.email && (
                      <div><span className="font-medium">Email:</span> {detailsModal.booking.member.email}</div>
                    )}
                  </div>
                </div>
              )}
              {/* Address Details */}
              {detailsModal.booking.address && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-green-800 mb-2">📍 Address Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">Address:</span> {detailsModal.booking.address.addressLine}</div>
                    <div><span className="font-medium">City:</span> {detailsModal.booking.address.city}</div>
                    <div><span className="font-medium">State:</span> {detailsModal.booking.address.state}</div>
                    <div><span className="font-medium">Pincode:</span> {detailsModal.booking.address.pincode}</div>
                    {detailsModal.booking.address.landmark && (
                      <div><span className="font-medium">Landmark:</span> {detailsModal.booking.address.landmark}</div>
                    )}
                  </div>
                </div>
              )}
              {/* Overview Section */}

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
                       Download Report
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
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-yellow-800 mb-4">
                    📦 Complete Items Details ({detailsModal.booking.items.length})
                  </h4>
                  <div className="space-y-6">
                    {detailsModal.booking.items.map((item) => (
                      <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                          <div>
                            <h5 className="text-base sm:text-lg font-medium text-gray-900">
                              {item.product?.name || item.customPackage?.name || "Unknown Item"}
                            </h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {item.product?.productType || "PACKAGE"}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-medium text-gray-900">{formatCurrency(item.price)}</p>
                            {item.product?.actualPrice && (
                              <p className="text-xs sm:text-sm text-gray-500">
                                Original: {formatCurrency(item.product.actualPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Product Details - organized grid, no Collection & Delivery title */}
                        {item.product && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 text-sm">
                            <div className="space-y-2">
                              {item.product.desc && (
                                <div>
                                  <span className="font-medium text-gray-700">Description:</span>
                                  <p className="text-gray-600 mt-1">{item.product.desc}</p>
                                </div>
                              )}
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
                            <div className="space-y-2">
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
                        )}

                        {/* Parameters */}
                        {item.product?.parameters && (
                          <div className="mt-4">
                            <h6 className="font-medium text-gray-700 mb-2">Test Parameters:</h6>
                            <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2 text-xs">
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

                        {/* Custom Package Details */}
                        {item.customPackage && (
                          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
                            <h6 className="font-medium text-purple-900 mb-2 sm:mb-3">📦 Custom Package Details</h6>
                            {item.customPackage.description && (
                              <p className="text-sm text-purple-700 mb-3">{item.customPackage.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4 text-sm">
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
                                <h6 className="font-medium text-purple-800 mb-1 sm:mb-2">
                                  Package Items ({item.customPackage.items.length}):
                                </h6>
                                <div className="space-y-2 sm:space-y-3">
                                  {item.customPackage.items.map((packageItem) => (
                                    <div key={packageItem.id} className="bg-white rounded p-2 sm:p-3 border border-purple-200">
                                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 sm:mb-2">
                                        <div>
                                          <h6 className="font-medium text-gray-900 text-xs sm:text-sm">
                                            {packageItem.product?.name || packageItem.test?.name || "Unknown Item"}
                                          </h6>
                                          <span className="text-xs text-purple-600">
                                            {packageItem.product ? "Product" : "Test"}
                                          </span>
                                        </div>
                                        <span className="font-medium text-gray-900 text-xs sm:text-sm">
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
                                        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs text-gray-600">
                                          {packageItem.product.reportTime && (
                                            <span>Report: {packageItem.product.reportTime}h</span>
                                          )}
                                          {packageItem.product.sampleType && (
                                            <span>Sample: {packageItem.product.sampleType}</span>
                                          )}
                                        </div>
                                      )}

                                      {packageItem.test && (
                                        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs text-gray-600">
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
                                        <p className="text-xs text-gray-600 mt-1 sm:mt-2">{packageItem.test.desc}</p>
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
