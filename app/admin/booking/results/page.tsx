"use client"

import { useState, useEffect } from "react"
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

export interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
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
  createdAt: string
  updatedAt: string
  user?: User
  assignedTo?: ServiceProvider
  items?: BookingItem[]
}


const BASE_URL = "https://redtestlab.com"

const ReturnedBookings = () => {
  const [returnedBookings, setReturnedBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean
    booking: Booking | null
  }>({ isOpen: false, booking: null })

  useEffect(() => {
    fetchReturnedBookings()
  }, [])

  const fetchReturnedBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/admin/returned`)
      const data = await response.json()
      setReturnedBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching returned bookings:", error)
      setReturnedBookings([])
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

  const parseParameters = (parametersString: string) => {
    try {
      return JSON.parse(parametersString)
    } catch {
      return {}
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Returned Bookings ({returnedBookings.length})</h2>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              {returnedBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No returned bookings found</p>
              ) : (
                returnedBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">Booking #{booking.id}</span>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                          {booking.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setDetailsModal({ isOpen: true, booking })}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                      >
                        View Details
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Customer Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Name:</strong> {booking.user?.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {booking.user?.email}
                          </p>
                          <p>
                            <strong>Customer ID:</strong> {booking.userId}
                          </p>
                        </div>
                      </div>

                      {/* Provider Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Service Provider</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Lab:</strong> {booking.assignedTo?.labName}
                          </p>
                          <p>
                            <strong>Owner:</strong> {booking.assignedTo?.ownerName}
                          </p>
                          <p>
                            <strong>Contact:</strong> {booking.assignedTo?.contactNumber}
                          </p>
                          <p>
                            <strong>City:</strong> {booking.assignedTo?.city}, {booking.assignedTo?.state}
                          </p>
                          <p>
                            <strong>Coins Used:</strong> {booking.assignedCoins}
                          </p>
                        </div>
                      </div>

                      {/* Booking Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Booking Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Amount:</strong> {formatCurrency(booking.amount)}
                          </p>
                          <p>
                            <strong>Type:</strong> {booking.bookingType}
                          </p>
                          <p>
                            <strong>Completed:</strong> {formatDate(booking.updatedAt)}
                          </p>
                          <p>
                            <strong>Payment ID:</strong> {booking.razorpayPaymentId}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Result Information */}
                    {booking.resultFileUrl && (
                      <div className="mt-4 bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Test Results</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <a
                              href={booking.resultFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Download Report
                            </a>
                            {booking.remarks && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Remarks:</strong> {booking.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Items Preview */}
                    {booking.items && booking.items.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items ({booking.items.length})</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          {booking.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-1">
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">{item.product?.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({item.product?.productType}) x{item.quantity}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                          {booking.items.length > 3 && (
                            <p className="text-xs text-gray-500 mt-1">+{booking.items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.booking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Returned Booking Details #{detailsModal.booking.id}
              </h3>
              <button
                onClick={() => setDetailsModal({ isOpen: false, booking: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {detailsModal.booking.user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {detailsModal.booking.user?.email}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {detailsModal.booking.userId}
                  </p>
                  <p>
                    <strong>Role:</strong> {detailsModal.booking.user?.role}
                  </p>
                  <p>
                    <strong>Google ID:</strong> {detailsModal.booking.user?.googleId || "N/A"}
                  </p>
                </div>
              </div>

              {/* Provider Details */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Service Provider</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Lab Name:</strong> {detailsModal.booking.assignedTo?.labName}
                  </p>
                  <p>
                    <strong>Owner:</strong> {detailsModal.booking.assignedTo?.ownerName}
                  </p>
                  <p>
                    <strong>Email:</strong> {detailsModal.booking.assignedTo?.email}
                  </p>
                  <p>
                    <strong>Contact:</strong> {detailsModal.booking.assignedTo?.contactNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {detailsModal.booking.assignedTo?.address}
                  </p>
                  <p>
                    <strong>City:</strong> {detailsModal.booking.assignedTo?.city},{" "}
                    {detailsModal.booking.assignedTo?.state}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {detailsModal.booking.assignedTo?.pincode}
                  </p>
                  <p>
                    <strong>Registration:</strong> {detailsModal.booking.assignedTo?.registrationNumber}
                  </p>
                  <p>
                    <strong>GST:</strong> {detailsModal.booking.assignedTo?.gstNumber}
                  </p>
                  <p>
                    <strong>Commission:</strong> {detailsModal.booking.assignedTo?.commissionPercentage}%
                  </p>
                  <p>
                    <strong>Current Coins:</strong> {detailsModal.booking.assignedTo?.coins}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status:</strong>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {detailsModal.booking.status}
                    </span>
                  </p>
                  <p>
                    <strong>Amount:</strong> {formatCurrency(detailsModal.booking.amount)}
                  </p>
                  <p>
                    <strong>Type:</strong> {detailsModal.booking.bookingType}
                  </p>
                  <p>
                    <strong>Coins Used:</strong> {detailsModal.booking.assignedCoins}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(detailsModal.booking.createdAt)}
                  </p>
                  <p>
                    <strong>Completed:</strong> {formatDate(detailsModal.booking.updatedAt)}
                  </p>
                  <p>
                    <strong>Payment ID:</strong> {detailsModal.booking.razorpayPaymentId}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {detailsModal.booking.razorpayOrderId}
                  </p>
                </div>
              </div>
            </div>

            {/* Provider Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {detailsModal.booking.assignedTo?.servicesOffered?.map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Tests Available</h4>
                <div className="flex flex-wrap gap-2">
                  {detailsModal.booking.assignedTo?.testsAvailable?.map((test, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {test}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Information */}
            {detailsModal.booking.resultFileUrl && (
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Test Results</h4>
                <div className="space-y-2">
                  <p>
                    <strong>Report URL:</strong>
                    <a
                      href={detailsModal.booking.resultFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download Report
                    </a>
                  </p>
                  {detailsModal.booking.remarks && (
                    <p>
                      <strong>Remarks:</strong> {detailsModal.booking.remarks}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Items Details */}
            {detailsModal.booking.items && detailsModal.booking.items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Items Details ({detailsModal.booking.items.length})
                </h4>
                <div className="space-y-4">
                  {detailsModal.booking.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                          <p className="text-sm text-gray-600">
                            {item.product?.productType} • Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                          <p className="text-sm text-gray-500">
                            Original: {formatCurrency(item.product?.actualPrice || 0)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p>
                            <strong>Report Time:</strong> {item.product?.reportTime} hours
                          </p>
                          <p>
                            <strong>Tags:</strong> {item.product?.tags}
                          </p>
                          <p>
                            <strong>Category ID:</strong> {item.product?.categoryId}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Parameters:</strong>
                          </p>
                          <div className="mt-1 text-xs bg-gray-100 rounded p-2">
                            {Object.entries(parseParameters(item.product?.parameters || "{}")).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span>{key}:</span>
                                <span>{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnedBookings
