"use client"

import { useState, useEffect } from "react"
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  CreditCard,
  BanknoteIcon as BankIcon,
  QrCode,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// TypeScript interfaces
interface ServiceProvider {
  id: string
  name: string
  email: string
}

interface PayoutRequest {
  id: number
  serviceProviderId: string
  amount: number
  paymentMethod: "UPI" | "BANK_TRANSFER" | "QR_CODE"
  upiId: string | null
  accountNumber: string | null
  qrImageUrl: string | null
  status: "PENDING" | "COMPLETED" | "REJECTED"
  rejectionReason: string | null
  createdAt: string
  processedAt: string | null
  serviceProvider: ServiceProvider
}

interface NotificationType {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function AdminPayoutRequests() {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: "",
    type: "success",
  })
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null)
  const [processingRequest, setProcessingRequest] = useState<{ [key: number]: boolean }>({})
  const [rejectionReason, setRejectionReason] = useState<{ [key: number]: string }>({})
  const [showRejectForm, setShowRejectForm] = useState<{ [key: number]: boolean }>({})

  // Fetch payout requests on component mount
  useEffect(() => {
    fetchPayoutRequests()
  }, [])

  const fetchPayoutRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://redtestlab.com/api/prescriptions/admin/payout-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch payout requests: ${response.status}`)
      }

      const data = await response.json()
      setPayoutRequests(data)
    } catch (err) {
      setError("Failed to fetch payout requests. Please try again.")
      console.error("Error fetching payout requests:", err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId: number) => {
    setProcessingRequest((prev) => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/admin/payout-request/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to approve payout request: ${response.status}`)
      }

      // Update the payout requests list
      setPayoutRequests((prev) => prev.filter((request) => request.id !== requestId))

      // Show success notification
      setNotification({
        show: true,
        message: `Payout request #${requestId} has been approved`,
        type: "success",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } catch (err) {
      console.error("Error approving payout request:", err instanceof Error ? err.message : String(err))

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to approve payout request #${requestId}`,
        type: "error",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    if (!rejectionReason[requestId] || rejectionReason[requestId].trim() === "") {
      setNotification({
        show: true,
        message: "Please provide a reason for rejection",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    setProcessingRequest((prev) => ({ ...prev, [requestId]: true }))

    try {
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/admin/payout-request/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: rejectionReason[requestId],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to reject payout request: ${response.status}`)
      }

      // Update the payout requests list
      setPayoutRequests((prev) => prev.filter((request) => request.id !== requestId))

      // Show success notification
      setNotification({
        show: true,
        message: `Payout request #${requestId} has been rejected`,
        type: "success",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } catch (err) {
      console.error("Error rejecting payout request:", err instanceof Error ? err.message : String(err))

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to reject payout request #${requestId}`,
        type: "error",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }))
      setShowRejectForm((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

  // Toggle expanded request
  const toggleExpandRequest = (requestId: number) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId)
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-gray-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading payout requests...</p>
      </div>
    )
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-gray-600" />
        <p className="mt-4 text-lg text-gray-700">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          onClick={() => fetchPayoutRequests()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center z-50 transition-opacity ${
            notification.type === "success"
              ? "bg-gray-100 text-gray-800 border border-gray-200"
              : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payout Requests</h1>
            <p className="text-gray-600 mt-2">Manage payout requests from service providers</p>
          </div>
          <button
            onClick={fetchPayoutRequests}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </header>

        {payoutRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">No pending payout requests</h2>
            <p className="text-gray-500 mt-2">There are no pending payout requests at the moment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Requests</h2>

              <div className="space-y-4">
                {payoutRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg overflow-hidden">
                    <div
                      className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpandRequest(request.id)}
                    >
                      <div className="flex items-center">
                        <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {request.serviceProvider.name || request.serviceProvider.email}
                          </h3>
                          <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 mr-4">{request.amount} coins</span>
                        {expandedRequest === request.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedRequest === request.id && (
                      <div className="p-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Service Provider</h4>
                            <p className="text-gray-800">{request.serviceProvider.name || "N/A"}</p>
                            <p className="text-gray-600 text-sm">{request.serviceProvider.email}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Method</h4>
                            {request.paymentMethod === "UPI" ? (
                              <div>
                                <div className="flex items-center mb-1">
                                  <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-gray-800">UPI</span>
                                </div>
                                <p className="text-gray-600 text-sm">UPI ID: {request.upiId}</p>
                              </div>
                            ) : request.paymentMethod === "BANK_TRANSFER" ? (
                              <div>
                                <div className="flex items-center mb-1">
                                  <BankIcon className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-gray-800">Bank Transfer</span>
                                </div>
                                <p className="text-gray-600 text-sm">Account: {request.accountNumber}</p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center mb-1">
                                  <QrCode className="h-4 w-4 mr-1 text-gray-400" />
                                  <span className="text-gray-800">QR Code</span>
                                </div>
                                {request.qrImageUrl && (
                                  <div className="mt-2">
                                    <a
                                      href={request.qrImageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                                    >
                                      <img
                                        src={request.qrImageUrl || "/placeholder.svg"}
                                        alt="Payment QR Code"
                                        className="h-24 border rounded-md"
                                      />
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {!showRejectForm[request.id] ? (
                          <div className="flex space-x-3 mt-4">
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              disabled={processingRequest[request.id]}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                            >
                              {processingRequest[request.id] ? (
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Approve Payout
                            </button>
                            <button
                              onClick={() => setShowRejectForm((prev) => ({ ...prev, [request.id]: true }))}
                              disabled={processingRequest[request.id]}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-3">
                            <label className="block text-sm font-medium text-gray-700">Reason for rejection</label>
                            <textarea
                              value={rejectionReason[request.id] || ""}
                              onChange={(e) =>
                                setRejectionReason((prev) => ({ ...prev, [request.id]: e.target.value }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                              rows={3}
                              placeholder="Please provide a reason for rejection..."
                            />
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={processingRequest[request.id]}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                              >
                                {processingRequest[request.id] ? (
                                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Confirm Rejection
                              </button>
                              <button
                                onClick={() => setShowRejectForm((prev) => ({ ...prev, [request.id]: false }))}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
