"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, UserCheck, Eye, StickyNote, MapPin, Mail, Phone, User, CreditCard, IndianRupee, Hash, Home, Users, UserIcon, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const BASE_URL = "https://redtestlab.com"

interface BookingItemProductParam { id: number; name: string; unit: string; referenceRange: string }
interface BookingItemProductCategory { id: number; name: string }
interface BookingItemProduct {
  id: number
  name: string
  reportTime?: number | string
  tags?: string
  actualPrice?: number
  discountedPrice?: number
  category?: BookingItemProductCategory
  Parameter?: BookingItemProductParam[]
}

interface BookingItem {
  id: number
  bookingId: number
  productId: number
  quantity: number
  price: number
  product?: BookingItemProduct
}

interface BookingUser { id: number; name: string; email: string; role: string }
interface BookingMember { name: string; phoneNumber: string; gender: string; age: number }
interface BookingAddress { name: string; addressLine: string; city: string; state: string; pincode: string }

interface Booking {
  id: number
  userId: number
  razorpayOrderId?: string
  razorpayPaymentId?: string
  paymentMethod?: string
  status: string
  amount: number
  bookingType: string
  createdAt: string
  updatedAt: string
  collectionStatus?: string
  collectionDate?: string
  collectionTime?: string
  collectionNotes?: string
  collectionProofUrl?: string
  actualCollectionTime?: string
  assignedBCBId?: string
  user?: BookingUser
  member?: BookingMember
  address?: BookingAddress
  items?: BookingItem[]
}

interface BCB {
  id: string
  name: string
  email: string
  phoneNumber: string
  city: string
  state: string
  status: string
  isActive: boolean
  isAvailable: boolean
}

type TimeSlot = "6:00 AM - 8:00 AM" | "8:00 AM - 10:00 AM" | "10:00 AM - 12:00 PM" | "12:00 PM - 2:00 PM" | "2:00 PM - 4:00 PM" | "4:00 PM - 6:00 PM"

const TIME_SLOTS: TimeSlot[] = [
  "6:00 AM - 8:00 AM",
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

export default function AssignDeliveryBoy() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [bcbs, setBcbs] = useState<BCB[]>([])
  const [assigning, setAssigning] = useState(false)

  const [assignModal, setAssignModal] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null })
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; booking: Booking | null }>({ isOpen: false, booking: null })
  const [selectedBcbId, setSelectedBcbId] = useState<string>("")
  const [collectionDate, setCollectionDate] = useState<string>("")
  const [collectionTime, setCollectionTime] = useState<TimeSlot | "">("")
  const [notes, setNotes] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchBCBs()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`${BASE_URL}/api/bookings/admin/bcb/unassigned`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || "Failed to fetch bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBCBs = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) return
      const res = await fetch(`${BASE_URL}/api/admin/bcb`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch BCBs")
      const data = await res.json()
      const list: BCB[] = (data?.bcbs || []).filter((b: BCB) => b.status === "APPROVED")
      setBcbs(list)
    } catch (e) {
      console.error("Error fetching BCBs", e)
      setBcbs([])
    }
  }

  const openAssign = (booking: Booking) => {
    setAssignModal({ isOpen: true, booking })
    setSelectedBcbId("")
    setCollectionDate("")
    setCollectionTime("")
    setNotes("")
  }

  const closeAssign = () => {
    setAssignModal({ isOpen: false, booking: null })
  }

  const assignDeliveryBoy = async () => {
    if (!assignModal.booking || !selectedBcbId || !collectionDate || !collectionTime) return
    try {
      setAssigning(true)
      const token = localStorage.getItem("adminToken")
      if (!token) throw new Error("Missing admin token")
      const isoDate = new Date(collectionDate).toISOString()
      const res = await fetch(`${BASE_URL}/api/booking-assignment/assign/${assignModal.booking.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bcbId: selectedBcbId, collectionDate: isoDate, collectionTime, notes }),
      })
      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || "Failed to assign delivery boy")
      }
      await fetchBookings()
      closeAssign()
      toast({
        title: "Assignment successful",
        description: `Booking #${assignModal.booking.id} assigned successfully.`,
      })
    } catch (e: any) {
      toast({
        title: "Assignment failed",
        description: e?.message || "Failed to assign",
        variant: "destructive",
      })
    } finally {
      setAssigning(false)
    }
  }

  const formattedBookings = useMemo(() => bookings, [bookings])

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-IN", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })

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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentMethodBadgeClasses = (paymentMethod: string) => {
    switch (paymentMethod) {
      case "COD":
        return "bg-green-100 text-green-800 border-green-200"
      case "ONLINE":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Pending Bookings
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Review and assign pending bookings to delivery boys</p>
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
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                              <Hash className="h-4 w-4 text-blue-600" />
                              Booking {b.id}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(b.collectionStatus || b.status)}`}>
                                {b.collectionStatus || b.status}
                              </span>
                              {b.paymentMethod && (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentMethodBadgeClasses(b.paymentMethod)}`}>
                                  {b.paymentMethod === 'COD' ? 'Cash on Delivery' : b.paymentMethod}
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">Created {formatDateTime(b.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => openAssign(b)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Assign
                          </button>
                          <button
                            onClick={() => setDetailsModal({ isOpen: true, booking: b })}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
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
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">{b.member.gender}, Age {b.member.age}</span>
                                </div>
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
                            {b.paymentMethod && (
                              <div className="flex justify-between items-center">
                                <span>Payment:</span>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentMethodBadgeClasses(b.paymentMethod)}`}>
                                  {b.paymentMethod === 'COD' ? 'Cash on Delivery' : b.paymentMethod}
                                </span>
                              </div>
                            )}
                            {b.razorpayPaymentId && b.paymentMethod !== 'COD' && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                <span>Payment ID:</span>
                                <code className="text-xs bg-gray-100 px-1 rounded border break-all">{b.razorpayPaymentId}</code>
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
                                {b.items.slice(0, 3).map((item) => (
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
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <div className="font-semibold text-gray-900">{formatCurrency(item.price)}</div>
                                        <div className="text-xs text-gray-500 line-through">{formatCurrency(item.product?.actualPrice || 0)}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {b.items.length > 3 && (
                                  <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">+{b.items.length - 3} more items</p>
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

      {assignModal.isOpen && assignModal.booking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeAssign}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900">Assign Booking #{assignModal.booking.id}</div>
                <button onClick={closeAssign} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Choose delivery boy and collection slot.</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Boy</label>
                <select
                  value={selectedBcbId}
                  onChange={(e) => setSelectedBcbId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select BCB</option>
                  {bcbs.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.city} {b.isAvailable ? "(Available)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Time</label>
                <select
                  value={collectionTime}
                  onChange={(e) => setCollectionTime(e.target.value as TimeSlot)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="relative">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 min-h-[80px]"
                  />
                  <StickyNote className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={closeAssign} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700">Cancel</button>
              <button
                onClick={assignDeliveryBoy}
                disabled={assigning || !selectedBcbId || !collectionDate || !collectionTime}
                className="inline-flex items-center px-4 py-2 rounded-md bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Assign
              </button>
            </div>
          </div>
        </div>
      )}

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
                          <div><strong>Gender:</strong> {detailsModal.booking.member.gender}</div>
                          <div><strong>Age:</strong> {detailsModal.booking.member.age}</div>
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
                      {detailsModal.booking.paymentMethod && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <strong>Payment Method:</strong>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentMethodBadgeClasses(detailsModal.booking.paymentMethod)} self-start`}>
                            {detailsModal.booking.paymentMethod === 'COD' ? 'Cash on Delivery' : detailsModal.booking.paymentMethod}
                          </span>
                        </div>
                      )}
                      <div className="break-words"><strong>Created:</strong> {formatDateTime(detailsModal.booking.createdAt)}</div>
                    </div>
                    <div className="space-y-2">
                      {detailsModal.booking.razorpayPaymentId && detailsModal.booking.paymentMethod !== 'COD' && (
                        <div className="break-all"><strong>Payment ID:</strong> <code className="text-xs bg-white px-1 rounded border">{detailsModal.booking.razorpayPaymentId}</code></div>
                      )}
                      {detailsModal.booking.razorpayOrderId && detailsModal.booking.paymentMethod !== 'COD' && (
                        <div className="break-all"><strong>Order ID:</strong> <code className="text-xs bg-white px-1 rounded border">{detailsModal.booking.razorpayOrderId}</code></div>
                      )}
                      {detailsModal.booking.collectionDate && (
                        <div><strong>Collection Date:</strong> {new Date(detailsModal.booking.collectionDate).toLocaleDateString()}</div>
                      )}
                      {detailsModal.booking.collectionTime && (
                        <div><strong>Collection Time:</strong> {detailsModal.booking.collectionTime}</div>
                      )}
                      {detailsModal.booking.assignedBCBId && (
                        <div className="break-all"><strong>Assigned BCB ID:</strong> <code className="text-xs bg-white px-1 rounded border">{detailsModal.booking.assignedBCBId}</code></div>
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
    </div>
  )
}


