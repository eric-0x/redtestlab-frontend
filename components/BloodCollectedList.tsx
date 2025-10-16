"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Loader2,
  Eye,
  StickyNote,
  MapPin,
  Mail,
  Phone,
  User as UserIcon,
  CreditCard,
  IndianRupee,
  Hash,
  Home,
  Users,
  Package,
} from "lucide-react"

const BASE_URL = "https://redtestlab.com"

interface BookingItemProductCategory { id: number; name: string }
interface BookingItemProduct {
  id: number
  name: string
  reportTime?: number | string
  tags?: string
  actualPrice?: number
  discountedPrice?: number
  category?: BookingItemProductCategory
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: {
    id: number
    packageId: number
    testId: number
    Product_ProductPackageLink_testIdToProduct: {
      id: number
      name: string
      slug: string
      reportTime?: number | string
      tags?: string
      actualPrice?: number
      discountedPrice?: number
      category?: { id: number; name: string }
    }
  }[]
}

interface BookingItem {
  id: number
  bookingId: number
  productId: number
  quantity: number
  price: number
  product?: BookingItemProduct
}

interface BookingUser { id: number; name: string; email: string }
interface BookingMember { id: number; userId: number; name: string; email?: string; phoneNumber: string; gender?: string; age?: number; relation?: string }
interface BookingAddress { id: number; userId: number; name: string; addressLine: string; city: string; state: string; pincode: string; landmark?: string | null }

interface Booking {
  id: number
  userId: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  status: string
  amount: number
  bookingType: string
  createdAt: string
  updatedAt: string
  memberId?: number
  addressId?: number
  assignedBCBId?: string | null
  collectionDate?: string
  collectionTime?: string
  collectionStatus?: string
  collectionNotes?: string
  collectionProofUrl?: string | null
  actualCollectionTime?: string
  user?: BookingUser
  member?: BookingMember
  address?: BookingAddress
  items?: BookingItem[]
  assignedBCB?: { id: string; name: string; phoneNumber: string; email?: string }
}

export default function BloodCollectedList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null })
  const [reportModal, setReportModal] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null })
  const [pdfUploading, setPdfUploading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [pdfFileName, setPdfFileName] = useState<string>("")
  const [reportNote, setReportNote] = useState<string>("")
  const [submittingReport, setSubmittingReport] = useState(false)

  useEffect(() => {
    fetchBloodCollected()
  }, [])

  const fetchBloodCollected = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${BASE_URL}/api/booking-assignment/blood-collected`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) throw new Error("Failed to fetch collected bookings")
      const data = await response.json()
      const list = Array.isArray(data?.bookings) ? data.bookings : []
      setBookings(list)
    } catch (e: any) {
      setError(e?.message || "Failed to fetch collected bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const formattedBookings = useMemo(() => bookings, [bookings])

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount || 0)

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
      case "BLOOD_COLLECTED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openReportModal = (booking: Booking) => {
    setReportModal({ isOpen: true, booking })
    setPdfUrl("")
    setPdfFileName("")
    setReportNote("")
  }

  const closeReportModal = () => {
    setReportModal({ isOpen: false, booking: null })
  }

  const normalizeCloudinaryPdfUrl = (url: string) => {
    if (!url) return url
    if (url.includes("/image/upload/") && url.toLowerCase().endsWith(".pdf")) {
      return url.replace("/image/upload/", "/raw/upload/")
    }
    return url
  }

  const uploadPdfToCloudinary = async (file: File) => {
    setPdfUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "E-Rickshaw")
      // Use raw resource type to ensure PDFs are handled correctly
      const res = await fetch(`https://api.cloudinary.com/v1_1/dm8jxispy/raw/upload`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to upload report")
      const data = await res.json()
      const secureUrl: string = data.secure_url
      setPdfUrl(normalizeCloudinaryPdfUrl(secureUrl))
    } catch (e) {
      alert("PDF upload failed. Please try again.")
    } finally {
      setPdfUploading(false)
    }
  }

  const handlePdfInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file")
      return
    }
    setPdfFileName(file.name)
    uploadPdfToCloudinary(file)
  }

  const submitReport = async () => {
    if (!reportModal.booking || !pdfUrl) {
      alert("Please upload a PDF report first")
      return
    }
    try {
      setSubmittingReport(true)
      const token = localStorage.getItem("adminToken")
      const res = await fetch(`${BASE_URL}/api/booking-assignment/upload-result/${reportModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bcbResultUrl: pdfUrl, bcbResultNote: reportNote }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Failed to submit report")
      }
      closeReportModal()
      await fetchBloodCollected()
      alert("Report submitted successfully")
    } catch (e: any) {
      alert(e?.message || "Failed to submit report")
    } finally {
      setSubmittingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Blood Collected Bookings
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Bookings with collection status BLOOD_COLLECTED</p>
          </div>

          {loading ? (
            <div className="p-8 flex items-center justify-center text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading bookings...
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-700 bg-red-50 border-t border-red-200">{error}</div>
          ) : (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {formattedBookings.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No bookings found.</div>
              ) : (
                formattedBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                              <Hash className="h-4 w-4 text-blue-600" />
                              Booking {b.id}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">Created {formatDateTime(b.createdAt)}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClasses(b.collectionStatus || b.status)} self-start`}>
                            {b.collectionStatus || b.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setDetailsModal({ isOpen: true, booking: b })}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => openReportModal(b)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Add Report
                          </button>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                              <span className="font-medium truncate">{b.user?.name || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{b.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="h-3 w-3 text-gray-500 flex-shrink-0" />
                              <span>ID: {b.userId}</span>
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
                            {b.member ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="font-medium truncate">{b.member.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{b.member.phoneNumber}</span>
                                </div>
                                {typeof b.member.age !== "undefined" && (
                                  <div className="flex items-center gap-2">
                                    <Users className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{b.member.gender || "-"}, Age {b.member.age}</span>
                                  </div>
                                )}
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
                            {b.address ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="font-medium truncate">{b.address.name}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="break-words">{b.address.addressLine}</p>
                                    <p>{b.address.city}, {b.address.state}</p>
                                    <p>{b.address.pincode}</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <p className="text-gray-500 italic">No address information</p>
                            )}
                          </div>
                        </div>

                        {/* Assigned Delivery Boy */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg">
                          <div className="px-3 sm:px-4 py-3 border-b border-indigo-200">
                            <h4 className="text-sm font-semibold text-gray-900">Assigned Delivery Boy</h4>
                          </div>
                          <div className="p-3 sm:p-4 space-y-2 text-sm">
                            {b.assignedBCB ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="font-medium truncate">{b.assignedBCB.name}</span>
                                </div>
                                {b.assignedBCB.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{b.assignedBCB.email}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{b.assignedBCB.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Hash className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">ID: {b.assignedBCB.id}</span>
                                </div>
                              </>
                            ) : (
                              <p className="text-gray-500 italic">Not assigned</p>
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
                                {formatCurrency(b.amount)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Type:</span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                {b.bookingType}
                              </span>
                            </div>
                            {b.razorpayPaymentId && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                <span>Payment ID:</span>
                                <code className="text-xs bg-gray-100 px-1 rounded border break-all">{b.razorpayPaymentId}</code>
                              </div>
                            )}
                            {b.collectionDate && (
                              <div className="flex justify-between items-center">
                                <span>Collection Date:</span>
                                <span className="font-medium">{formatDate(b.collectionDate)}</span>
                              </div>
                            )}
                            {b.collectionTime && (
                              <div className="flex justify-between items-center">
                                <span>Collection Time:</span>
                                <span className="font-medium">{b.collectionTime}</span>
                              </div>
                            )}
                            {b.actualCollectionTime && (
                              <div className="flex justify-between items-center">
                                <span>Actual Time:</span>
                                <span className="font-medium">{formatDateTime(b.actualCollectionTime)}</span>
                              </div>
                            )}
                            {b.collectionNotes && (
                              <div className="flex items-start gap-2">
                                <StickyNote className="h-4 w-4 text-gray-400 mt-0.5" />
                                <p className="text-gray-700">{b.collectionNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      {b.items && b.items.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-blue-600" />
                            Items ({b.items.length})
                          </h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="p-3 sm:p-4">
                              <div className="space-y-4">
                                {b.items.map((item) => (
                                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="font-medium text-gray-900 truncate">{item.product?.name}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                          <div>Qty: {item.quantity}</div>
                                          <div>Report: {item.product?.reportTime}h</div>
                                          <div>Category: {item.product?.category?.name || 'N/A'}</div>
                                        </div>
                                        {item.product?.ProductPackageLink_ProductPackageLink_packageIdToProduct && item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 0 && (
                                          <div className="mt-3">
                                            <div className="text-xs font-semibold text-gray-700 mb-1">Included Tests</div>
                                            <ul className="space-y-1">
                                              {item.product.ProductPackageLink_ProductPackageLink_packageIdToProduct.map((pp) => (
                                                <li key={pp.id} className="text-xs text-gray-700 flex items-center justify-between">
                                                  <span className="truncate mr-2">{pp.Product_ProductPackageLink_testIdToProduct.name}</span>
                                                  <span className="text-gray-500">{pp.Product_ProductPackageLink_testIdToProduct.reportTime}h</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <div className="font-semibold text-gray-900">{formatCurrency(item.price)}</div>
                                        <div className="text-xs text-gray-500 line-through">{formatCurrency(item.product?.actualPrice || 0)}</div>
                                      </div>
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

      {detailsModal.isOpen && detailsModal.booking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setDetailsModal({ isOpen: false, booking: null })}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Booking Details #{detailsModal.booking.id}</span>
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">Complete information about this booking and its associated data.</p>
                </div>
                <button onClick={() => setDetailsModal({ isOpen: false, booking: null })} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4">✕</button>
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Simple reuse of the above cards for detail view */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="px-3 sm:px-4 py-3 border-b border-blue-200">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                        Customer Information
                      </h4>
                    </div>
                    <div className="p-3 sm:p-4 space-y-2 text-sm">
                      <div className="break-words"><strong>Name:</strong> {detailsModal.booking.user?.name || "N/A"}</div>
                      <div className="break-words"><strong>Email:</strong> {detailsModal.booking.user?.email}</div>
                      <div><strong>Customer ID:</strong> {detailsModal.booking.userId}</div>
                    </div>
                  </div>

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
                          <div className="break-words"><strong>Name:</strong> {detailsModal.booking.member.name}</div>
                          <div className="break-words"><strong>Phone:</strong> {detailsModal.booking.member.phoneNumber}</div>
                          {typeof detailsModal.booking.member.age !== "undefined" && (
                            <div><strong>Age:</strong> {detailsModal.booking.member.age}</div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No member information available</p>
                      )}
                    </div>
                  </div>

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
                          <div className="break-words"><strong>Name:</strong> {detailsModal.booking.address.name}</div>
                          <div className="break-words"><strong>Address Line:</strong> {detailsModal.booking.address.addressLine}</div>
                          <div><strong>City:</strong> {detailsModal.booking.address.city}</div>
                          <div><strong>State:</strong> {detailsModal.booking.address.state}</div>
                          <div><strong>Pincode:</strong> {detailsModal.booking.address.pincode}</div>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No address information available</p>
                      )}
                    </div>
                  </div>
                </div>

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
                        <strong>Collection Status:</strong>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(detailsModal.booking.collectionStatus || detailsModal.booking.status)} self-start`}>
                          {detailsModal.booking.collectionStatus || detailsModal.booking.status}
                        </span>
                      </div>
                      <div><strong>Amount:</strong> {formatCurrency(detailsModal.booking.amount)}</div>
                      <div><strong>Type:</strong> {detailsModal.booking.bookingType}</div>
                      <div className="break-words"><strong>Created:</strong> {formatDateTime(detailsModal.booking.createdAt)}</div>
                    </div>
                    <div className="space-y-2">
                      {detailsModal.booking.razorpayPaymentId && (
                        <div className="break-all"><strong>Payment ID:</strong> <code className="text-xs bg-white px-1 rounded border">{detailsModal.booking.razorpayPaymentId}</code></div>
                      )}
                      {detailsModal.booking.razorpayOrderId && (
                        <div className="break-all"><strong>Order ID:</strong> <code className="text-xs bg-white px-1 rounded border">{detailsModal.booking.razorpayOrderId}</code></div>
                      )}
                      {detailsModal.booking.collectionDate && (
                        <div><strong>Collection Date:</strong> {formatDate(detailsModal.booking.collectionDate)}</div>
                      )}
                      {detailsModal.booking.collectionTime && (
                        <div><strong>Collection Time:</strong> {detailsModal.booking.collectionTime}</div>
                      )}
                      {detailsModal.booking.actualCollectionTime && (
                        <div><strong>Actual Time:</strong> {formatDateTime(detailsModal.booking.actualCollectionTime)}</div>
                      )}
                    </div>
                  </div>
                </div>

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
                                    <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                  <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                                  <p className="text-sm text-gray-500">Original: {formatCurrency(item.product?.actualPrice || 0)}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div><strong>Report Time:</strong> {item.product?.reportTime} hours</div>
                                  <div className="break-words"><strong>Tags:</strong> {item.product?.tags}</div>
                                  <div className="break-words"><strong>Category:</strong> {item.product?.category?.name || 'N/A'}</div>
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

      {reportModal.isOpen && reportModal.booking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeReportModal}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-blue-100 bg-blue-50/60">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Add Report • Booking #{reportModal.booking.id}</div>
                <button onClick={closeReportModal} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
            </div>
            <div className="p-5 space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <label className="block text-sm font-medium text-blue-900 mb-2">PDF Report</label>
                <input type="file" accept="application/pdf" onChange={handlePdfInput} className="w-full border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <div className="mt-2 space-y-1">
                  {pdfFileName && (
                    <p className="text-xs text-blue-800">Selected: {pdfFileName}</p>
                  )}
                  {pdfUploading && (
                    <p className="text-xs text-blue-600">Uploading...</p>
                  )}
                  {pdfUrl && (
                    <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline inline-block">View uploaded PDF</a>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">Report Note</label>
                <textarea value={reportNote} onChange={(e) => setReportNote(e.target.value)} className="w-full border border-blue-200 rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter any notes for the report" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-blue-100 bg-blue-50/60 flex justify-end gap-2">
              <button onClick={closeReportModal} className="px-4 py-2 rounded-md border border-blue-200 bg-white text-blue-700 hover:bg-blue-50">Cancel</button>
              <button onClick={submitReport} disabled={submittingReport || pdfUploading || !pdfUrl} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                {submittingReport ? "Submitting..." : "Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


