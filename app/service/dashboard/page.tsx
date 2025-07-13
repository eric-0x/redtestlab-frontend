"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Loader2,
  AlertCircle,
  Coins,
  ArrowDown,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  DollarSign,
  CreditCard,
  BanknoteIcon as BankIcon,
  QrCode,
} from "lucide-react"

// TypeScript interfaces
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
}

interface NotificationType {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function ServiceProviderCoins() {
  const [coins, setCoins] = useState<number>(0)
  const [pendingAmount, setPendingAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([])
  const [historyLoading, setHistoryLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: "",
    type: "success",
  })

  // Payout request form state
  const [showPayoutForm, setShowPayoutForm] = useState<boolean>(false)
  const [payoutAmount, setPayoutAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "BANK_TRANSFER" | "QR_CODE">("UPI")
  const [upiId, setUpiId] = useState<string>("")
  const [accountNumber, setAccountNumber] = useState<string>("")
  const [qrImageUrl, setQrImageUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [uploadingQr, setUploadingQr] = useState<boolean>(false)

  // Get provider ID from localStorage
  const getProviderId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("serviceId") || ""
    }
    return ""
  }

  // Fetch coins balance on component mount
  useEffect(() => {
    fetchCoinsBalance()
    fetchPayoutHistory()
  }, [])

  const fetchCoinsBalance = async () => {
    setLoading(true)
    try {
      const providerId = getProviderId()

      if (!providerId) {
        throw new Error("Provider ID not found in local storage")
      }

      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/${providerId}/coins`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch coins balance: ${response.status}`)
      }

      const data = await response.json()
      setCoins(data.coins || 0)
      setPendingAmount(data.pendingPayoutAmount || 0)
    } catch (err) {
      setError("Failed to fetch coins balance. Please try again.")
      console.error("Error fetching coins balance:", err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const fetchPayoutHistory = async () => {
    setHistoryLoading(true)
    try {
      const providerId = getProviderId()

      if (!providerId) {
        throw new Error("Provider ID not found in local storage")
      }

      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/provider/${providerId}/payout-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch payout history: ${response.status}`)
      }

      const data = await response.json()
      setPayoutHistory(data)
    } catch (err) {
      console.error("Error fetching payout history:", err instanceof Error ? err.message : String(err))
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleQrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingQr(true)

    // Create form data for upload
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "E-Rickshaw") // Replace with your Cloudinary upload preset

    try {
      // Upload to Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dm8jxispy/upload", // Replace with your Cloudinary cloud name
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error("Failed to upload QR code image")
      }

      const data = await response.json()
      setQrImageUrl(data.secure_url)

      setNotification({
        show: true,
        message: "QR code image uploaded successfully",
        type: "success",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } catch (err) {
      console.error("Error uploading QR code:", err instanceof Error ? err.message : String(err))

      setNotification({
        show: true,
        message: "Failed to upload QR code image. Please try again.",
        type: "error",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } finally {
      setUploadingQr(false)
    }
  }

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    if (!payoutAmount || Number.parseInt(payoutAmount) <= 0) {
      setNotification({
        show: true,
        message: "Please enter a valid amount",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    if (Number.parseInt(payoutAmount) > coins) {
      setNotification({
        show: true,
        message: "Requested amount exceeds available coins balance",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    // Validate payment method specific fields
    if (paymentMethod === "UPI" && !upiId) {
      setNotification({
        show: true,
        message: "Please enter your UPI ID",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    if (paymentMethod === "BANK_TRANSFER" && !accountNumber) {
      setNotification({
        show: true,
        message: "Please enter your bank account number",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    if (paymentMethod === "QR_CODE" && !qrImageUrl) {
      setNotification({
        show: true,
        message: "Please upload your payment QR code",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
      return
    }

    setIsSubmitting(true)

    try {
      const providerId = getProviderId()

      const response = await fetch(
        "https://redtestlab.com/api/prescriptions/provider/payout-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
            amount: Number.parseInt(payoutAmount),
            paymentMethod,
            upiId: paymentMethod === "UPI" ? upiId : null,
            accountNumber: paymentMethod === "BANK_TRANSFER" ? accountNumber : null,
            qrImageUrl: paymentMethod === "QR_CODE" ? qrImageUrl : null,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to submit payout request: ${response.status}`)
      }

      const data = await response.json()

      // Update coins balance and payout history
      setCoins(coins - Number.parseInt(payoutAmount))
      setPendingAmount(pendingAmount + Number.parseInt(payoutAmount))
      setPayoutHistory([data, ...payoutHistory])

      // Reset form
      setPayoutAmount("")
      setUpiId("")
      setAccountNumber("")
      setQrImageUrl("")
      setShowPayoutForm(false)

      // Show success notification
      setNotification({
        show: true,
        message: "Payout request submitted successfully",
        type: "success",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } catch (err) {
      console.error("Error submitting payout request:", err instanceof Error ? err.message : String(err))

      // Show error notification
      setNotification({
        show: true,
        message: "Failed to submit payout request. Please try again.",
        type: "error",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" })
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-gray-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading coins balance...</p>
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
          onClick={() => fetchCoinsBalance()}
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Coins Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your coins and request payouts</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Coins Balance Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Coins className="h-8 w-8 text-yellow-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Available Coins</h2>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">{coins}</span>
                <span className="ml-2 text-gray-500">coins</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Each coin is worth ₹1. You can request a payout for your available coins.
              </p>
              <button
                onClick={() => setShowPayoutForm(true)}
                disabled={coins <= 0}
                className={`mt-4 w-full py-2 rounded-md transition flex items-center justify-center ${
                  coins <= 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Request Payout
              </button>
            </div>
          </div>

          {/* Pending Payouts Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Pending Payouts</h2>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">{pendingAmount}</span>
                <span className="ml-2 text-gray-500">coins</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                These coins are pending approval from the admin. Once approved, you will receive the payment.
              </p>
              <button
                onClick={() => fetchPayoutHistory()}
                className="mt-4 w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh History
              </button>
            </div>
          </div>
        </div>

        {/* Payout Request Form */}
        {showPayoutForm && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Request Payout</h2>
                <button onClick={() => setShowPayoutForm(false)} className="text-gray-500 hover:text-gray-700">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePayoutRequest}>
                <div className="space-y-4">
                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (in coins)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        min="1"
                        max={coins}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Available balance: {coins} coins</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          paymentMethod === "UPI" ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setPaymentMethod("UPI")}
                      >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                          <CreditCard className="h-6 w-6 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium">UPI</span>
                      </div>
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          paymentMethod === "BANK_TRANSFER"
                            ? "border-black bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                          <BankIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium">Bank</span>
                      </div>
                      <div
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer transition ${
                          paymentMethod === "QR_CODE"
                            ? "border-black bg-gray-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setPaymentMethod("QR_CODE")}
                      >
                        <div className="w-8 h-8 flex items-center justify-center mb-2">
                          <QrCode className="h-6 w-6 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium">QR Code</span>
                      </div>
                    </div>
                  </div>

                  {/* UPI ID (for UPI payment method) */}
                  {paymentMethod === "UPI" && (
                    <div>
                      <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="yourname@upi"
                      />
                    </div>
                  )}

                  {/* Account Number (for Bank Transfer payment method) */}
                  {paymentMethod === "BANK_TRANSFER" && (
                    <div>
                      <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                        placeholder="Enter your account number"
                      />
                    </div>
                  )}

                  {/* QR Code Image (for QR Code payment method) */}
                  {paymentMethod === "QR_CODE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment QR Code</label>
                      {qrImageUrl ? (
                        <div className="mt-2 relative">
                          <img
                            src={qrImageUrl || "/placeholder.svg"}
                            alt="Payment QR Code"
                            className="h-48 mx-auto border rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setQrImageUrl("")}
                            className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <label
                            htmlFor="qrImage"
                            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400"
                          >
                            <div className="space-y-1 text-center">
                              <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <span className="relative font-medium text-gray-600 hover:text-gray-500">
                                  {uploadingQr ? (
                                    <div className="flex items-center">
                                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                      Uploading...
                                    </div>
                                  ) : (
                                    "Upload a QR code"
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              id="qrImage"
                              name="qrImage"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleQrImageUpload}
                              disabled={uploadingQr}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPayoutForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Payout History</h2>
              <button
                onClick={fetchPayoutHistory}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                disabled={historyLoading}
              >
                {historyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </button>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : payoutHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payout history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Method
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payoutHistory.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payout.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payout.amount} coins</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payout.paymentMethod === "UPI" ? (
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                              UPI
                            </div>
                          ) : payout.paymentMethod === "BANK_TRANSFER" ? (
                            <div className="flex items-center">
                              <BankIcon className="h-4 w-4 mr-1 text-gray-400" />
                              Bank Transfer
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <QrCode className="h-4 w-4 mr-1 text-gray-400" />
                              QR Code
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payout.status === "PENDING" ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : payout.status === "COMPLETED" ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
