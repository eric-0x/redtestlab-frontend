'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, MapPin, Mail, Phone, User, CreditCard, IndianRupee, Hash, Home, Users, UserIcon, Package, Calendar, Clock, StickyNote } from 'lucide-react'

const BASE_URL = "http://localhost:5000"

interface ProductCategory {
  id: number
  name: string
  badge: string | null
  type: string
  imageUrl: string
  color: string
}

interface Product {
  id: number
  name: string
  slug: string
  reportTime: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
  overview: string
  category: ProductCategory
  Parameter: any[]
  ProductPackageLink_ProductPackageLink_packageIdToProduct: any[]
}

interface BookingItem {
  id: number
  bookingId: number
  productId: number | null
  customPackageId: number | null
  quantity: number
  price: number
  product: Product | null
  customPackage: any | null
}

interface BookingUser {
  name: string | null
  email: string
}

interface BookingMember {
  name: string
  phoneNumber: string
  email: string
}

interface BookingAddress {
  name: string
  addressLine: string
  city: string
  state: string
  pincode: string
  landmark: string | null
}

interface AssignedBooking {
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
  memberId: number
  addressId: number
  assignedBCBId: string
  collectionDate: string
  collectionTime: string
  collectionStatus: string
  collectionNotes: string
  collectionProofUrl: string | null
  actualCollectionTime: string | null
  user: BookingUser
  member: BookingMember
  address: BookingAddress
  items: BookingItem[]
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface BookingsResponse {
  message: string
  bookings: AssignedBooking[]
  pagination: Pagination
}

function CollectionsPage() {
  const [bookings, setBookings] = useState<AssignedBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("deliveryToken")
      if (!token) {
        setError("Please login to view collections")
        return
      }

      const response = await fetch(`${BASE_URL}/api/booking-assignment/my-bookings?status=SCHEDULED`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch collections")
      }

      const data: BookingsResponse = await response.json()
      setBookings(data.bookings || [])
      setPagination(data.pagination || null)
    } catch (e: any) {
      setError(e?.message || "Failed to fetch collections")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", { 
      year: "numeric", 
      month: "short", 
      day: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit" 
    })

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", { 
      year: "numeric", 
      month: "short", 
      day: "2-digit" 
    })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { 
      style: "currency", 
      currency: "INR", 
      minimumFractionDigits: 0 
    }).format(amount || 0)

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "RETURNED_TO_ADMIN":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCollectionStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              My Collections
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              View and manage your assigned PAID collection bookings
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading collections...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-2">Error</div>
                <p className="text-gray-500">{error}</p>
                <button 
                  onClick={fetchBookings}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4 sm:space-y-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No PAID collections found</p>
                    <p className="text-gray-400 text-sm">You don't have any PAID collection bookings yet</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
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
                              <p className="text-black text-sm mt-1">Created {formatDateTime(booking.createdAt)}</p>
                              <p className="text-black text-sm">Updated {formatDateTime(booking.updatedAt)}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClasses(booking.status)} self-start`}>
                                {booking.status}
                              </span>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCollectionStatusBadgeClasses(booking.collectionStatus)} self-start`}>
                                {booking.collectionStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Collection Details */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg mb-6">
                          <div className="px-3 sm:px-4 py-3 border-b border-orange-200">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-orange-600" />
                              Collection Details
                            </h4>
                          </div>
                          <div className="p-3 sm:p-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              <span className="font-medium text-black">Date:</span>
                              <span className="text-black">{formatDate(booking.collectionDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              <span className="font-medium text-black">Time:</span>
                              <span className="text-black">{booking.collectionTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-black">Status:</span>
                              <span className="text-black">{booking.collectionStatus}</span>
                            </div>
                            {booking.collectionNotes && (
                              <div className="flex items-start gap-2">
                                <StickyNote className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="font-medium text-black">Notes:</span>
                                <span className="break-words text-black">{booking.collectionNotes}</span>
                              </div>
                            )}
                            {booking.collectionProofUrl && (
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-black">Proof URL:</span>
                                <a href={booking.collectionProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all hover:underline">
                                  {booking.collectionProofUrl}
                                </a>
                              </div>
                            )}
                            {booking.actualCollectionTime && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-black">Actual Collection Time:</span>
                                <span className="text-black">{formatDateTime(booking.actualCollectionTime)}</span>
                              </div>
                            )}
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
                                <span className="font-medium text-black">{booking.user?.name || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="text-black break-all">{booking.user?.email}</span>
                              </div>
                          
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
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="font-medium text-black">{booking.member.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="text-black">{booking.member.phoneNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="text-black break-all">{booking.member.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Address Information */}
                          <div className="bg-purple-50 border border-purple-200 rounded-lg md:col-span-2 lg:col-span-1">
                            <div className="px-3 sm:px-4 py-3 border-b border-purple-200">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Home className="h-4 w-4 text-purple-600" />
                                Address Information
                              </h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                <span className="font-medium text-black">{booking.address.name}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="break-words text-black">{booking.address.addressLine}</p>
                                  <p className="text-black">{booking.address.city}, {booking.address.state}</p>
                                  <p className="text-black">{booking.address.pincode}</p>
                                  {booking.address.landmark && (
                                    <p className="text-black break-words">Near: {booking.address.landmark}</p>
                                  )}
                                </div>
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
                                  {booking.items.map((item) => (
                                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                      <div className="flex flex-col gap-4">
                                        {/* Item Header */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="font-semibold text-black text-lg">
                                                {item.product?.name || "Custom Item"}
                                              </span>
                                              {item.product?.category && (
                                                <span 
                                                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                                  style={{ backgroundColor: item.product.category.color }}
                                                >
                                                  {item.product.category.name}
                                                </span>
                                              )}
                                            </div>
                                            <div className="text-sm text-black mb-2">
                                              {item.product?.overview && (
                                                <div 
                                                  className="text-gray-700"
                                                  dangerouslySetInnerHTML={{ __html: item.product.overview }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right flex-shrink-0">
                                            <div className="font-bold text-black text-lg">
                                              {formatCurrency(item.price)}
                                            </div>
                                            {item.product && (
                                              <div className="text-sm text-gray-600">
                                                <div className="line-through">{formatCurrency(item.product.actualPrice)}</div>
                                                <div className="text-green-600 font-medium">
                                                  {formatCurrency(item.product.discountedPrice)} (Discounted)
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* Item Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <h5 className="font-medium text-black text-sm">Basic Information</h5>
                                            <div className="space-y-1 text-sm">
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">Quantity:</span>
                                                <span className="text-black font-medium">{item.quantity}</span>
                                              </div>
                                             
                   
                                            </div>
                                          </div>

                                          {item.product && (
                                            <div className="space-y-2">
                                              <h5 className="font-medium text-black text-sm">Product Details</h5>
                                              <div className="space-y-1 text-sm">
                                        
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Report Time:</span>
                                                  <span className="text-black">{item.product.reportTime} days</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Type:</span>
                                                  <span className="text-black">{item.product.productType}</span>
                                                </div>
                                        
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Category Information */}
                                        {item.product?.category && (
                                          <div className="border-t border-gray-200 pt-3">
                                            <h5 className="font-medium text-black text-sm mb-2">Category Information</h5>
                                            <div className="flex items-center gap-3">
                                              {item.product.category.imageUrl && (
                                                <img 
                                                  src={item.product.category.imageUrl} 
                                                  alt={item.product.category.name}
                                                  className="w-8 h-8 rounded object-cover"
                                                />
                                              )}
                                              <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Category:</span>
                                                  <span className="text-black font-medium">{item.product.category.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-gray-600">Type:</span>
                                                  <span className="text-black">{item.product.category.type}</span>
                                                </div>
                                     
                                                {item.product.category.badge && (
                                                  <div className="flex justify-between">
                                                    <span className="text-gray-600">Badge:</span>
                                                    <span className="text-black">{item.product.category.badge}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
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
      </div>
    </div>
  )
}

export default CollectionsPage