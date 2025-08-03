"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  CreditCard,
  Eye,
  Loader2,
  MapPin,
  Phone,
  UserIcon,
  Users,
  Building2,
  Mail,
  Hash,
  Package,
  IndianRupee,
  UserCheck,
  Home,
  X,
  ChevronDown,
} from "lucide-react"

export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
  googleId?: string
}

export interface Parameter {
  id: number
  name: string
  unit: string
  referenceRange: string
  productId: number
}

export interface Category {
  id: number
  name: string
  badge: string
}

export interface PackageTest {
  id: number
  packageId: number
  testId: number
  Product_ProductPackageLink_testIdToProduct: {
    id: number
    name: string
    reportTime: number
    tags: string
    actualPrice: number
    discountedPrice: number
    categoryId: number
    productType: string
    category: Category
    Parameter: Parameter[]
  }
}

export interface Product {
  id: number
  name: string
  reportTime: number | string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
  category?: Category
  Parameter?: Parameter[]
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: PackageTest[]
}

export interface BookingItem {
  id: number
  bookingId: number
  productId: number
  customPackageId: number | null
  quantity: number
  price: number
  product?: Product
  customPackage: any
}

export interface Member {
  id: number
  userId: number
  name: string
  email: string
  phoneNumber: string
  gender: string
  dateOfBirth: string
  age: number
  relation: string
  createdAt: string
  updatedAt: string
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

export interface ServiceProvider {
  id: string
  email: string
  labName: string
  registrationNumber?: string
  ownerName: string
  contactNumber: string
  address?: string
  city: string
  state: string
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
  razorpayPaymentId: string
  status: string
  amount: number
  bookingType: string
  assignedToId: string | null
  assignedCoins: number | null
  resultFileUrl: string | null
  remarks: string | null
  rejectionReason: string | null
  otpCode: string | null
  otpVerified: boolean
  otpGeneratedAt: string | null
  createdAt: string
  updatedAt: string
  memberId: number | null
  addressId: number | null
  user?: User
  member?: Member | null
  address?: Address | null
  assignedTo?: ServiceProvider
  items?: BookingItem[]
}

const BASE_URL = "https://redtestlab.com"

const AdminPanel = () => {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(false)
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({ isOpen: false, booking: null })
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({ isOpen: false, booking: null })
  const [selectedProvider, setSelectedProvider] = useState("")
  const [coins, setCoins] = useState("")
  const [selectOpen, setSelectOpen] = useState(false)

  useEffect(() => {
    fetchPendingBookings()
    fetchServiceProviders()
  }, [])

  const fetchPendingBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/admin/pending`)
      const data = await response.json()
      console.log("Pending bookings data:", data) // Debug log
      setPendingBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching pending bookings:", error)
      setPendingBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchServiceProviders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/service/all`)
      const data = await response.json()
      setServiceProviders(data.serviceProviders || [])
    } catch (error) {
      console.error("Error fetching service providers:", error)
      setServiceProviders([])
    }
  }

  const handleAssignBooking = async () => {
    if (!assignModal.booking || !selectedProvider || !coins) return

    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/admin/assign/${assignModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          coins: Number.parseInt(coins),
        }),
      })

      if (response.ok) {
        await fetchPendingBookings()
        setAssignModal({ isOpen: false, booking: null })
        setSelectedProvider("")
        setCoins("")
        alert("Booking assigned successfully!")
      } else {
        alert("Failed to assign booking")
      }
    } catch (error) {
      console.error("Error assigning booking:", error)
      alert("Error assigning booking")
    } finally {
      setLoading(false)
    }
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

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Pending Bookings
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Review and assign pending bookings to service providers
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading bookings...</span>
              </div>
            )}

            {!loading && (
              <div className="space-y-4 sm:space-y-6">
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No pending bookings found</p>
                  </div>
                ) : (
                  pendingBookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <Hash className="h-4 w-4 text-blue-600" />
                                Booking {booking.id}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">Created {formatDate(booking.createdAt)}</p>
                            </div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClasses(booking.status)} self-start`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => setDetailsModal({ isOpen: true, booking })}
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => setAssignModal({ isOpen: true, booking })}
                              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Assign
                            </button>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {/* Customer Information */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-blue-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                                Customer Information
                              </h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="font-medium truncate">{booking.user?.name || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{booking.user?.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span>ID: {booking.userId}</span>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {booking.user?.role}
                              </span>
                            </div>
                          </div>

                          {/* Member Information */}
                          <div className="bg-green-50 border border-green-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-green-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-600" />
                                Member Information
                              </h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              {booking.member ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="font-medium truncate">{booking.member.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{booking.member.phoneNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">
                                      {booking.member.gender}, Age {booking.member.age}
                                    </span>
                                  </div>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    {booking.member.relation}
                                  </span>
                                </>
                              ) : (
                                <p className="text-gray-500 italic">No member information</p>
                              )}
                            </div>
                          </div>

                          {/* Address Information */}
                          <div className="bg-orange-50 border border-orange-200 rounded-lg md:col-span-2 lg:col-span-1">
                            <div className="px-3 sm:px-4 py-3 border-b border-orange-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Home className="h-4 w-4 text-orange-600" />
                                Address Information
                              </h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              {booking.address ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="font-medium truncate">{booking.address.name}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="break-words">{booking.address.addressLine}</p>
                                      <p>
                                        {booking.address.city}, {booking.address.state}
                                      </p>
                                      <p>{booking.address.pincode}</p>
                                      {booking.address.landmark && (
                                        <p className="text-gray-600 break-words">Near: {booking.address.landmark}</p>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <p className="text-gray-500 italic">No address information</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-purple-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-purple-600" />
                                Booking Details
                              </h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span>Amount:</span>
                                <span className="font-semibold text-green-600 flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3" />
                                  {formatCurrency(booking.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Type:</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                  {booking.bookingType}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                <span>Payment ID:</span>
                                <code className="text-xs bg-gray-100 px-1 rounded border break-all">
                                  {booking.razorpayPaymentId}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items Preview */}
                        {booking.items && booking.items.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-600" />
                              Items ({booking.items.length})
                            </h4>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="p-3 sm:p-4">
                                <div className="space-y-4">
                                  {booking.items.slice(0, 3).map((item) => (
                                    <div
                                      key={item.id}
                                      className="bg-white border border-gray-200 rounded-lg p-3"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-gray-900 truncate">
                                              {item.product?.name}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                              item.product?.productType === "TEST" 
                                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                                : "bg-purple-100 text-purple-800 border-purple-200"
                                            }`}>
                                              {item.product?.productType}
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div>Qty: {item.quantity}</div>
                                            <div>Report: {item.product?.reportTime}h</div>
                                            <div>Category: {item.product?.category?.name || 'N/A'}</div>
                                            <div>
                                              {item.product?.productType === "TEST" 
                                                ? `Parameters: ${item.product?.Parameter?.length || 0}`
                                                : `Tests: ${item.product?.ProductPackageLink_ProductPackageLink_packageIdToProduct?.length || 0}`
                                              }
                                            </div>
                                          </div>
                                          {/* Show parameter names for TEST or included tests for PACKAGE */}
                                          <div className="mt-2">
                                            {item.product?.productType === "TEST" && item.product?.Parameter ? (
                                              <div className="text-xs text-gray-500">
                                                <span className="font-medium">Parameters: </span>
                                                {item.product.Parameter.map(p => p.name).join(", ")}
                                              </div>
                                            ) : item.product?.productType === "PACKAGE" && item.product?.ProductPackageLink_ProductPackageLink_packageIdToProduct ? (
                                              <div className="text-xs text-gray-500">
                                                <span className="font-medium">Includes: </span>
                                                {item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct
                                                  .map(link => link.Product_ProductPackageLink_testIdToProduct.name)
                                                  .join(", ")}
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                          <div className="font-semibold text-gray-900">
                                            {formatCurrency(item.price)}
                                          </div>
                                          <div className="text-xs text-gray-500 line-through">
                                            {formatCurrency(item.product?.actualPrice || 0)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {booking.items.length > 3 && (
                                    <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                                      +{booking.items.length - 3} more items
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {assignModal.isOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <span className="truncate">Assign Booking #{assignModal.booking?.id}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setAssignModal({ isOpen: false, booking: null })
                      setSelectedProvider("")
                      setCoins("")
                    }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1 text-sm">
                  Select a service provider and assign coins for this booking.
                </p>
              </div>
              <div className="p-4 sm:p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="space-y-2">
                  <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                    Service Provider
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setSelectOpen(!selectOpen)}
                      className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between min-h-[42px]"
                    >
                      <span className="block truncate text-sm">
                        {selectedProvider
                          ? serviceProviders.find((p) => p.id === selectedProvider)?.labName || "Select a provider"
                          : "Select a provider"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </button>
                    {selectOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {serviceProviders.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => {
                              setSelectedProvider(provider.id)
                              setSelectOpen(false)
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate text-sm">{provider.labName}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {provider.ownerName} • {provider.city}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="coins" className="block text-sm font-medium text-gray-700">
                    Coins
                  </label>
                  <input
                    id="coins"
                    type="number"
                    value={coins}
                    onChange={(e) => setCoins(e.target.value)}
                    placeholder="Enter coins amount"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setAssignModal({ isOpen: false, booking: null })
                    setSelectedProvider("")
                    setCoins("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignBooking}
                  disabled={!selectedProvider || !coins || loading}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {loading ? "Assigning..." : "Assign Booking"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModal.isOpen && detailsModal.booking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">Booking Details #{detailsModal.booking.id}</span>
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      Complete information about this booking and its associated data.
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailsModal({ isOpen: false, booking: null })}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Customer, Member, Address Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Customer Details */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                          Customer Information
                        </h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        <div className="break-words">
                          <strong>Name:</strong> {detailsModal.booking.user?.name || "N/A"}
                        </div>
                        <div className="break-words">
                          <strong>Email:</strong> {detailsModal.booking.user?.email}
                        </div>
                        <div>
                          <strong>Customer ID:</strong> {detailsModal.booking.userId}
                        </div>
                        <div>
                          <strong>Role:</strong> {detailsModal.booking.user?.role}
                        </div>
                        <div className="break-words">
                          <strong>Google ID:</strong> {detailsModal.booking.user?.googleId || "N/A"}
                        </div>
                        <div className="break-words">
                          <strong>Created:</strong> {formatDate(detailsModal.booking.user?.createdAt || "")}
                        </div>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-green-200">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          Member Information
                        </h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        {detailsModal.booking.member ? (
                          <>
                            <div className="break-words">
                              <strong>Name:</strong> {detailsModal.booking.member.name}
                            </div>
                            <div className="break-words">
                              <strong>Email:</strong> {detailsModal.booking.member.email}
                            </div>
                            <div className="break-words">
                              <strong>Phone:</strong> {detailsModal.booking.member.phoneNumber}
                            </div>
                            <div>
                              <strong>Gender:</strong> {detailsModal.booking.member.gender}
                            </div>
                            <div className="break-words">
                              <strong>Date of Birth:</strong>{" "}
                              {formatDateOfBirth(detailsModal.booking.member.dateOfBirth)}
                            </div>
                            <div>
                              <strong>Age:</strong> {detailsModal.booking.member.age}
                            </div>
                            <div>
                              <strong>Relation:</strong> {detailsModal.booking.member.relation}
                            </div>
                            <div>
                              <strong>Member ID:</strong> {detailsModal.booking.memberId}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 italic">No member information available</p>
                        )}
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-orange-200">
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Home className="h-4 w-4 text-orange-600" />
                          Address Information
                        </h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        {detailsModal.booking.address ? (
                          <>
                            <div className="break-words">
                              <strong>Name:</strong> {detailsModal.booking.address.name}
                            </div>
                            <div className="break-words">
                              <strong>Address Line:</strong> {detailsModal.booking.address.addressLine}
                            </div>
                            <div>
                              <strong>City:</strong> {detailsModal.booking.address.city}
                            </div>
                            <div>
                              <strong>State:</strong> {detailsModal.booking.address.state}
                            </div>
                            <div>
                              <strong>Pincode:</strong> {detailsModal.booking.address.pincode}
                            </div>
                            {detailsModal.booking.address.landmark && (
                              <div className="break-words">
                                <strong>Landmark:</strong> {detailsModal.booking.address.landmark}
                              </div>
                            )}
                            <div>
                              <strong>Address ID:</strong> {detailsModal.booking.addressId}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 italic">No address information available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="px-3 sm:px-4 py-3 border-b border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Booking Information
                      </h4>
                    </div>
                    <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <strong>Status:</strong>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(detailsModal.booking.status)} self-start`}
                          >
                            {detailsModal.booking.status}
                          </span>
                        </div>
                        <div>
                          <strong>Amount:</strong> {formatCurrency(detailsModal.booking.amount)}
                        </div>
                        <div>
                          <strong>Type:</strong> {detailsModal.booking.bookingType}
                        </div>
                        <div className="break-words">
                          <strong>Created:</strong> {formatDate(detailsModal.booking.createdAt)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="break-words">
                          <strong>Updated:</strong> {formatDate(detailsModal.booking.updatedAt)}
                        </div>
                        <div className="break-all">
                          <strong>Payment ID:</strong>{" "}
                          <code className="text-xs bg-white px-1 rounded border">
                            {detailsModal.booking.razorpayPaymentId}
                          </code>
                        </div>
                        <div className="break-all">
                          <strong>Order ID:</strong>{" "}
                          <code className="text-xs bg-white px-1 rounded border">
                            {detailsModal.booking.razorpayOrderId}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Details */}
                  {detailsModal.booking.items && detailsModal.booking.items.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          Items Details ({detailsModal.booking.items.length})
                        </h4>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="space-y-4">
                          {detailsModal.booking.items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg">
                              <div className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                                  <div className="min-w-0">
                                    <h5 className="font-medium text-gray-900 break-words">{item.product?.name}</h5>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                        item.product?.productType === "TEST" 
                                          ? "bg-blue-100 text-blue-800 border-blue-200"
                                          : "bg-purple-100 text-purple-800 border-purple-200"
                                      }`}>
                                        {item.product?.productType}
                                      </span>
                                      <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="text-left sm:text-right flex-shrink-0">
                                    <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                    <p className="text-sm text-gray-500">
                                      Original: {formatCurrency(item.product?.actualPrice || 0)}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div>
                                      <strong>Report Time:</strong> {item.product?.reportTime} hours
                                    </div>
                                    <div className="break-words">
                                      <strong>Tags:</strong> {item.product?.tags}
                                    </div>
                                    <div className="break-words">
                                      <strong>Category:</strong> {item.product?.category?.name || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Discounted Price:</strong>{" "}
                                      {formatCurrency(item.product?.discountedPrice || 0)}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-2">
                                      {item.product?.productType === "TEST" ? "Parameters:" : "Package Contents:"}
                                    </p>
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                      {item.product?.productType === "TEST" ? (
                                        <div className="space-y-2">
                                          {item.product?.Parameter && item.product.Parameter.length > 0 ? (
                                            item.product.Parameter.map((param) => (
                                              <div
                                                key={param.id}
                                                className="bg-white border border-gray-100 rounded p-2"
                                              >
                                                <div className="font-medium text-gray-900">{param.name}</div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                  <span className="font-medium">Range:</span> {param.referenceRange} {param.unit}
                                                </div>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-gray-500 italic">No parameters available</p>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {item.product?.ProductPackageLink_ProductPackageLink_packageIdToProduct && 
                                           item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 0 ? (
                                            item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct.map((link) => (
                                              <div key={link.id} className="bg-white border border-gray-100 rounded p-3">
                                                <div className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                                  {link.Product_ProductPackageLink_testIdToProduct.name}
                                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                    TEST
                                                  </span>
                                                </div>
                                                <div className="text-xs text-gray-600 mb-2">
                                                  <strong>Report Time:</strong> {link.Product_ProductPackageLink_testIdToProduct.reportTime} hours |{" "}
                                                  <strong>Tags:</strong> {link.Product_ProductPackageLink_testIdToProduct.tags}
                                                </div>
                                                {link.Product_ProductPackageLink_testIdToProduct.Parameter && 
                                                 link.Product_ProductPackageLink_testIdToProduct.Parameter.length > 0 && (
                                                  <div className="space-y-1">
                                                    <div className="text-xs font-medium text-gray-700 mb-1">Parameters:</div>
                                                    {link.Product_ProductPackageLink_testIdToProduct.Parameter.map((param) => (
                                                      <div key={param.id} className="bg-gray-50 rounded px-2 py-1">
                                                        <div className="flex justify-between text-xs">
                                                          <span className="font-medium text-gray-700">{param.name}</span>
                                                          <span className="text-gray-600">
                                                            {param.referenceRange} {param.unit}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-gray-500 italic">No package contents available</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
