"use client"

import { Undo2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  category: Category
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
  otpVerified: boolean | null
  otpGeneratedAt: string | null
  createdAt: string
  updatedAt: string
  memberId: number | null
  addressId: number | null
  user?: User
  assignedTo?: ServiceProvider
  items?: BookingItem[]
  member?: {
    id: number;
    userId: number;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    age: number;
    relation: string;
    createdAt: string;
    updatedAt: string;
  };
  address?: {
    id: number;
    userId: number;
    name: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    createdAt: string;
    updatedAt: string;
  };
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

  const router = useRouter()

  const extractParametersFromBooking = (booking: Booking) => {
    const allParameters: Array<{
      name: string;
      unit: string;
      referenceRange: string;
    }> = []

    booking.items?.forEach(item => {
      if (item.product?.productType === "PACKAGE") {
        // Extract parameters from package tests
        item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct?.forEach(packageTest => {
          packageTest.Product_ProductPackageLink_testIdToProduct.Parameter?.forEach(param => {
            allParameters.push({
              name: param.name,
              unit: param.unit,
              referenceRange: param.referenceRange
            })
          })
        })
      } else if (item.product?.productType === "TEST") {
        // Extract parameters directly from test
        item.product.Parameter?.forEach(param => {
          allParameters.push({
            name: param.name,
            unit: param.unit,
            referenceRange: param.referenceRange
          })
        })
      }
    })

    return allParameters
  }

  const handleAddToReport = (booking: Booking) => {
    if (!booking.member) return
    
    const parameters = extractParametersFromBooking(booking)
    const otpGeneratedDate = booking.otpGeneratedAt ? new Date(booking.otpGeneratedAt).toISOString().split('T')[0] : ''
    
    const params = new URLSearchParams({
      name: booking.member.name,
      age: booking.member.age?.toString() || "",
      gender: booking.member.gender,
      collectionDate: otpGeneratedDate,
      parameters: JSON.stringify(parameters),
    }).toString()
    router.push(`/admin/booking/report?${params}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Undo2 className="w-5 h-5 text-blue-600" />
              Returned Bookings ({returnedBookings.length})
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              List of bookings that have been returned by service providers
            </p>
          </div>
          <div className="p-4 sm:p-6">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading returned bookings...</span>
              </div>
            )}
            {!loading && (
              <div className="space-y-4 sm:space-y-6">
                {returnedBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="inline-block h-12 w-12 rounded-full bg-purple-100 text-purple-400 text-3xl font-bold mb-4">R</span>
                    <p className="text-gray-500 text-lg">No returned bookings found</p>
                  </div>
                ) : (
                  returnedBookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <span className=" h-4 w-4 text-blue-600 flex items-center justify-center">#</span>
                                Booking {booking.id}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">Updated {formatDate(booking.updatedAt)}</p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-purple-100 text-purple-800 border-purple-200 self-start">
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => setDetailsModal({ isOpen: true, booking })}
                              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            >
                              View Details
                            </button>
                            {booking.member && (
                              <button
                                onClick={() => handleAddToReport(booking)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Add to Report
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                          {/* Customer Information */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-blue-200">
                              <h4 className="text-sm font-semibold text-gray-900">Customer Information</h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              <div><strong>Name:</strong> {booking.user?.name}</div>
                              <div><strong>Email:</strong> {booking.user?.email}</div>
                              <div><strong>Customer ID:</strong> {booking.userId}</div>
                            </div>
                          </div>
                          {/* Member Information */}
                          <div className="bg-green-50 border border-green-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-green-200">
                              <h4 className="text-sm font-semibold text-gray-900">Member Information</h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              {booking.member ? (
                                <>
                                  <div><strong>Name:</strong> {booking.member.name}</div>
                                  <div><strong>Email:</strong> {booking.member.email}</div>
                                  <div><strong>Phone:</strong> {booking.member.phoneNumber}</div>
                                  <div><strong>Gender:</strong> {booking.member.gender}</div>
                                  <div><strong>Date of Birth:</strong> {new Date(booking.member.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                                  <div><strong>Age:</strong> {booking.member.age}</div>
                                  <div><strong>Relation:</strong> {booking.member.relation}</div>
                                </>
                              ) : (
                                <div className="text-gray-500 italic">No member information</div>
                              )}
                            </div>
                          </div>
                          {/* Address Information */}
                          <div className="bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="px-3 sm:px-4 py-3 border-b border-orange-200">
                              <h4 className="text-sm font-semibold text-gray-900">Address Information</h4>
                            </div>
                            <div className="p-3 sm:p-4 space-y-2 text-sm">
                              {booking.address ? (
                                <>
                                  <div><strong>Name:</strong> {booking.address.name}</div>
                                  <div><strong>Address Line:</strong> {booking.address.addressLine}</div>
                                  <div><strong>City:</strong> {booking.address.city}</div>
                                  <div><strong>State:</strong> {booking.address.state}</div>
                                  <div><strong>Pincode:</strong> {booking.address.pincode}</div>
                                  {booking.address.landmark && <div><strong>Landmark:</strong> {booking.address.landmark}</div>}
                                </>
                              ) : (
                                <div className="text-gray-500 italic">No address information</div>
                              )}
                            </div>
                          </div>
                          {/* Service Provider Information */}
                          <div className="bg-purple-50 border border-purple-200 rounded-lg md:col-span-3">
                            <div className="px-3 sm:px-4 py-3 border-b border-purple-200">
                              <h4 className="text-sm font-semibold text-gray-900">Service Provider Information</h4>
                            </div>
                            <div className="p-3 sm:p-4 text-sm">
                              {booking.assignedTo ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                                  <div className="space-y-2">
                                    <div><strong>Lab Name:</strong> {booking.assignedTo.labName}</div>
                                    <div><strong>Owner:</strong> {booking.assignedTo.ownerName}</div>
                                    <div><strong>Email:</strong> {booking.assignedTo.email}</div>
                                  </div>
                                  <div className="space-y-2">
                                    <div><strong>Contact:</strong> {booking.assignedTo.contactNumber}</div>
                                    <div><strong>Address:</strong> {booking.assignedTo.address}</div>
                                    <div><strong>City:</strong> {booking.assignedTo.city}</div>
                                    <div><strong>State:</strong> {booking.assignedTo.state}</div>
                                  </div>
                                  <div className="space-y-2">
                                    <div><strong>Pincode:</strong> {booking.assignedTo.pincode}</div>
                                    <div><strong>Registration:</strong> {booking.assignedTo.registrationNumber}</div>
                                    <div><strong>GST:</strong> {booking.assignedTo.gstNumber}</div>
                                    <div><strong>Commission:</strong> {booking.assignedTo.commissionPercentage}%</div>
                                    <div><strong>Current Coins:</strong> {booking.assignedTo.coins}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 italic">No service provider information</div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Result Information */}
                        {booking.resultFileUrl && (
                          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
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
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
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
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* Details Modal */}
        {detailsModal.isOpen && detailsModal.booking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="flex h-5 w-5 rounded-full bg-purple-100 text-purple-800 items-center justify-center font-bold">R</span>
                  Returned Booking Details #{detailsModal.booking.id}
                </h3>
                <button
                  onClick={() => setDetailsModal({ isOpen: false, booking: null })}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Customer Details */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900">Customer Information</h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        <div><strong>Name:</strong> {detailsModal.booking.user?.name}</div>
                        <div><strong>Email:</strong> {detailsModal.booking.user?.email}</div>
                        <div><strong>Customer ID:</strong> {detailsModal.booking.userId}</div>
                        <div><strong>Role:</strong> {detailsModal.booking.user?.role}</div>
                        <div><strong>Google ID:</strong> {detailsModal.booking.user?.googleId || "N/A"}</div>
                      </div>
                    </div>
                    {/* Member Details */}
                    <div className="bg-green-50 border border-green-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-green-200">
                        <h4 className="text-sm font-semibold text-gray-900">Member Information</h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        {detailsModal.booking.member ? (
                          <>
                            <div><strong>Name:</strong> {detailsModal.booking.member.name}</div>
                            <div><strong>Email:</strong> {detailsModal.booking.member.email}</div>
                            <div><strong>Phone:</strong> {detailsModal.booking.member.phoneNumber}</div>
                            <div><strong>Gender:</strong> {detailsModal.booking.member.gender}</div>
                            <div><strong>Date of Birth:</strong> {new Date(detailsModal.booking.member.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                            <div><strong>Age:</strong> {detailsModal.booking.member.age}</div>
                            <div><strong>Relation:</strong> {detailsModal.booking.member.relation}</div>
                          </>
                        ) : (
                          <div className="text-gray-500 italic">No member information</div>
                        )}
                      </div>
                    </div>
                    {/* Address Details */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-orange-200">
                        <h4 className="text-sm font-semibold text-gray-900">Address Information</h4>
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 text-sm">
                        {detailsModal.booking.address ? (
                          <>
                            <div><strong>Name:</strong> {detailsModal.booking.address.name}</div>
                            <div><strong>Address Line:</strong> {detailsModal.booking.address.addressLine}</div>
                            <div><strong>City:</strong> {detailsModal.booking.address.city}</div>
                            <div><strong>State:</strong> {detailsModal.booking.address.state}</div>
                            <div><strong>Pincode:</strong> {detailsModal.booking.address.pincode}</div>
                            {detailsModal.booking.address.landmark && <div><strong>Landmark:</strong> {detailsModal.booking.address.landmark}</div>}
                          </>
                        ) : (
                          <div className="text-gray-500 italic">No address information</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Service Provider Details */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg mt-4">
                    <div className="px-3 sm:px-4 py-3 border-b border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900">Service Provider Information</h4>
                    </div>
                    <div className="p-3 sm:p-4 text-sm">
                      {detailsModal.booking.assignedTo ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                          <div className="space-y-2">
                            <div><strong>Lab Name:</strong> {detailsModal.booking.assignedTo.labName}</div>
                            <div><strong>Owner:</strong> {detailsModal.booking.assignedTo.ownerName}</div>
                            <div><strong>Email:</strong> {detailsModal.booking.assignedTo.email}</div>
                          </div>
                          <div className="space-y-2">
                            <div><strong>Contact:</strong> {detailsModal.booking.assignedTo.contactNumber}</div>
                            <div><strong>Address:</strong> {detailsModal.booking.assignedTo.address}</div>
                            <div><strong>City:</strong> {detailsModal.booking.assignedTo.city}</div>
                            <div><strong>State:</strong> {detailsModal.booking.assignedTo.state}</div>
                          </div>
                          <div className="space-y-2">
                            <div><strong>Pincode:</strong> {detailsModal.booking.assignedTo.pincode}</div>
                            <div><strong>Registration:</strong> {detailsModal.booking.assignedTo.registrationNumber}</div>
                            <div><strong>GST:</strong> {detailsModal.booking.assignedTo.gstNumber}</div>
                            <div><strong>Commission:</strong> {detailsModal.booking.assignedTo.commissionPercentage}%</div>
                            <div><strong>Current Coins:</strong> {detailsModal.booking.assignedTo.coins}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 italic">No service provider information</div>
                      )}
                    </div>
                  </div>
                  {/* Provider Services & Tests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailsModal.booking.assignedTo?.servicesOffered?.map((service, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-green-100 rounded-lg p-4">
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
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                          Items Details ({detailsModal.booking.items.length})
                        </h4>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="space-y-4">
                          {detailsModal.booking.items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-lg">
                              <div className="p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                                  <div className="min-w-0">
                                    <h5 className="font-medium text-gray-900 break-words">{item.product?.name}</h5>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
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
                                  <div className="space-y-1">
                                    <div><strong>Report Time:</strong> {item.product?.reportTime} hours</div>
                                    <div><strong>Tags:</strong> {item.product?.tags}</div>
                                    <div><strong>Category:</strong> {item.product?.category?.name}</div>
                                  </div>
                                <div>
                                    <p className="font-medium mb-2">Product Details:</p>
                                    <div className="bg-gray-50 border border-gray-200 rounded p-2">
                                      <div className="text-xs space-y-2">
                                        {item.product?.productType === "PACKAGE" ? (
                                          <div>
                                            <div className="font-medium text-blue-600 mb-1">Package includes:</div>
                                            {item.product?.ProductPackageLink_ProductPackageLink_packageIdToProduct?.map((packageTest) => (
                                              <div key={packageTest.id} className="ml-2 mb-2 p-2 bg-white border rounded">
                                                <div className="font-medium text-green-600">
                                                  {packageTest.Product_ProductPackageLink_testIdToProduct.name}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-1">
                                                  Report Time: {packageTest.Product_ProductPackageLink_testIdToProduct.reportTime}h | 
                                                  Category: {packageTest.Product_ProductPackageLink_testIdToProduct.category.name}
                                                </div>
                                                {packageTest.Product_ProductPackageLink_testIdToProduct.Parameter?.length > 0 && (
                                                  <div className="mt-1">
                                                    <div className="font-medium text-gray-700">Parameters:</div>
                                                    {packageTest.Product_ProductPackageLink_testIdToProduct.Parameter.map((param) => (
                                                      <div key={param.id} className="ml-2 text-xs">
                                                        • {param.name} ({param.unit}) - Range: {param.referenceRange}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="font-medium text-green-600 mb-1">Test Parameters:</div>
                                            {item.product?.Parameter?.map((param) => (
                                              <div key={param.id} className="flex justify-between items-center py-1">
                                                <span className="font-medium">{param.name}:</span>
                                                <span>{param.unit} (Range: {param.referenceRange})</span>
                                              </div>
                                            ))}
                                            {(!item.product?.Parameter || item.product?.Parameter.length === 0) && (
                                              <div className="text-gray-500 italic">No parameters available</div>
                                            )}
                                          </div>
                                        )}
                                      </div>
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

export default ReturnedBookings
