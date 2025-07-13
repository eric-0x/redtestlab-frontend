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

  useEffect(() => {
    fetchPendingBookings()
    fetchServiceProviders()
  }, [])

  const fetchPendingBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/bookings/admin/pending`)
      const data = await response.json()
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

  const parseParameters = (parametersString: string) => {
    try {
      return JSON.parse(parametersString)
    } catch {
      return {}
    }
  }

  const formatDateOfBirth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pending Bookings ({pendingBookings.length})</h2>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && (
            <div className="space-y-6">
              {pendingBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pending bookings found</p>
              ) : (
                pendingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-gray-900">Booking #{booking.id}</span>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            booking.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setDetailsModal({ isOpen: true, booking })}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setAssignModal({ isOpen: true, booking })}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Customer Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Name:</strong> {booking.user?.name || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong> {booking.user?.email}
                          </p>
                          <p>
                            <strong>Customer ID:</strong> {booking.userId}
                          </p>
                          <p>
                            <strong>Role:</strong> {booking.user?.role}
                          </p>
                        </div>
                      </div>

                      {/* Member Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Member Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {booking.member ? (
                            <>
                              <p>
                                <strong>Name:</strong> {booking.member.name}
                              </p>
                              <p>
                                <strong>Phone:</strong> {booking.member.phoneNumber}
                              </p>
                              <p>
                                <strong>Gender:</strong> {booking.member.gender}
                              </p>
                              <p>
                                <strong>Relation:</strong> {booking.member.relation}
                              </p>
                              <p>
                                <strong>Age:</strong> {booking.member.age}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-400 italic">No member information</p>
                          )}
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Address Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {booking.address ? (
                            <>
                              <p>
                                <strong>Name:</strong> {booking.address.name}
                              </p>
                              <p>
                                <strong>Address:</strong> {booking.address.addressLine}
                              </p>
                              <p>
                                <strong>City:</strong> {booking.address.city}
                              </p>
                              <p>
                                <strong>State:</strong> {booking.address.state}
                              </p>
                              <p>
                                <strong>Pincode:</strong> {booking.address.pincode}
                              </p>
                              {booking.address.landmark && (
                                <p>
                                  <strong>Landmark:</strong> {booking.address.landmark}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-400 italic">No address information</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking Information */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Booking Details</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Amount:</strong> {formatCurrency(booking.amount)}
                          </p>
                          <p>
                            <strong>Type:</strong> {booking.bookingType}
                          </p>
                          <p>
                            <strong>Created:</strong> {formatDate(booking.createdAt)}
                          </p>
                          <p>
                            <strong>Payment ID:</strong> {booking.razorpayPaymentId}
                          </p>
                          <p>
                            <strong>Order ID:</strong> {booking.razorpayOrderId}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Items Preview */}
                    {booking.items && booking.items.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items ({booking.items.length})</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          {booking.items.slice(0, 2).map((item) => (
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
                          {booking.items.length > 2 && (
                            <p className="text-xs text-gray-500 mt-1">+{booking.items.length - 2} more items</p>
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

      {/* Assignment Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Booking #{assignModal.booking?.id}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a provider</option>
                  {serviceProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.labName} - {provider.ownerName} ({provider.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coins</label>
                <input
                  type="number"
                  value={coins}
                  onChange={(e) => setCoins(e.target.value)}
                  placeholder="Enter coins amount"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setAssignModal({ isOpen: false, booking: null })
                  setSelectedProvider("")
                  setCoins("")
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignBooking}
                disabled={!selectedProvider || !coins || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.booking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Booking Details #{detailsModal.booking.id}</h3>
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
                    <strong>Name:</strong> {detailsModal.booking.user?.name || "N/A"}
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
                  <p>
                    <strong>Created:</strong> {formatDate(detailsModal.booking.user?.createdAt || "")}
                  </p>
                </div>
              </div>

              {/* Member Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Member Information</h4>
                <div className="space-y-2 text-sm">
                  {detailsModal.booking.member ? (
                    <>
                      <p>
                        <strong>Name:</strong> {detailsModal.booking.member.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {detailsModal.booking.member.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {detailsModal.booking.member.phoneNumber}
                      </p>
                      <p>
                        <strong>Gender:</strong> {detailsModal.booking.member.gender}
                      </p>
                      <p>
                        <strong>Date of Birth:</strong> {formatDateOfBirth(detailsModal.booking.member.dateOfBirth)}
                      </p>
                      <p>
                        <strong>Age:</strong> {detailsModal.booking.member.age}
                      </p>
                      <p>
                        <strong>Relation:</strong> {detailsModal.booking.member.relation}
                      </p>
                      <p>
                        <strong>Member ID:</strong> {detailsModal.booking.memberId}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">No member information available</p>
                  )}
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Address Information</h4>
                <div className="space-y-2 text-sm">
                  {detailsModal.booking.address ? (
                    <>
                      <p>
                        <strong>Name:</strong> {detailsModal.booking.address.name}
                      </p>
                      <p>
                        <strong>Address Line:</strong> {detailsModal.booking.address.addressLine}
                      </p>
                      <p>
                        <strong>City:</strong> {detailsModal.booking.address.city}
                      </p>
                      <p>
                        <strong>State:</strong> {detailsModal.booking.address.state}
                      </p>
                      <p>
                        <strong>Pincode:</strong> {detailsModal.booking.address.pincode}
                      </p>
                      {detailsModal.booking.address.landmark && (
                        <p>
                          <strong>Landmark:</strong> {detailsModal.booking.address.landmark}
                        </p>
                      )}
                      <p>
                        <strong>Address ID:</strong> {detailsModal.booking.addressId}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">No address information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        detailsModal.booking.status === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
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
                    <strong>Created:</strong> {formatDate(detailsModal.booking.createdAt)}
                  </p>
                  <p>
                    <strong>Updated:</strong> {formatDate(detailsModal.booking.updatedAt)}
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
                          <p>
                            <strong>Discounted Price:</strong> {formatCurrency(item.product?.discountedPrice || 0)}
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

export default AdminPanel
