"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import type { Doctor, Hospital } from "../../components/api"

interface BookingModalProps {
  doctor: Doctor
  hospital: Hospital
  onClose: () => void
}

export default function FixedBookingModal({ doctor, hospital, onClose }: BookingModalProps) {
  // Form states
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phoneNumber: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  })

  // Flow states
  const [currentStep, setCurrentStep] = useState<"form" | "otp" | "payment">("form")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Load Razorpay SDK
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if ((window as any).Razorpay) {
          setRazorpayLoaded(true)
          resolve(true)
          return
        }

        // Create script element
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        script.onload = () => {
          console.log("Razorpay SDK loaded successfully")
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => {
          console.error("Failed to load Razorpay SDK")
          setRazorpayLoaded(false)
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    loadRazorpay()
  }, [])

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    const start = 9 // 9 AM
    const end = 17 // 5 PM

    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Format phone number
    if (name === "phoneNumber") {
      const digits = value.replace(/\D/g, "")
      if (digits.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: digits,
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    setError("")
  }

  const validateForm = () => {
    if (!formData.patientName.trim()) {
      setError("Please enter patient name")
      return false
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number")
      return false
    }
    if (!formData.appointmentDate) {
      setError("Please select appointment date")
      return false
    }
    if (!formData.appointmentTime) {
      setError("Please select appointment time")
      return false
    }
    if (!formData.reason.trim()) {
      setError("Please enter reason for consultation")
      return false
    }
    return true
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const userId = localStorage.getItem("userId")
    if (!userId) {
      setError("User session not found. Please login again.")
      return
    }

    // Send OTP first
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://redtestlab.com/api/doctor/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number.parseInt(userId),
          phoneNumber: `+91${formData.phoneNumber}`,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentStep("otp")
        setSuccess("OTP sent successfully!")
        setResendTimer(30)
        // Focus first OTP input
        setTimeout(() => {
          otpRefs.current[0]?.focus()
        }, 100)
      } else {
        setError(data.message || "Failed to send OTP. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    const userId = localStorage.getItem("userId")
    if (!userId) {
      setError("User session not found. Please login again.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://redtestlab.com/api/doctor/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number.parseInt(userId),
          phoneNumber: `+91${formData.phoneNumber}`,
          otp: otpString,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Phone number verified successfully!")
        // Now proceed to payment
        setTimeout(() => {
          handlePayment()
        }, 1000)
      } else {
        setError(data.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      setError("User session not found. Please login again.")
      return
    }

    // Check if Razorpay is loaded
    if (!razorpayLoaded || !(window as any).Razorpay) {
      setError("Payment system is loading. Please wait a moment and try again.")
      return
    }

    setCurrentStep("payment")
    setLoading(true)
    setError("")

    try {
      // Create payment order
      const paymentData = {
        userId: Number.parseInt(userId),
        doctorId: doctor.id,
        hospitalId: hospital.id,
        patientName: formData.patientName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        amountPaid: doctor.consultationFee,
      }

      console.log("Creating payment order with data:", paymentData)

      const response = await fetch("https://redtestlab.com/api/doctor/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()
      console.log("Payment order response:", data)

      if (response.ok && data.success && data.razorpayOrderId) {
        // Initialize Razorpay
        const options = {
          key: "rzp_test_Iycvp4aODn242I",
          amount: data.amount,
          currency: data.currency || "INR",
          name: hospital.name,
          description: `Consultation with Dr. ${doctor.name}`,
          order_id: data.razorpayOrderId,
          handler: async (razorpayResponse: any) => {
            console.log("Razorpay payment success:", razorpayResponse)
            // Verify payment
            try {
              setLoading(true)
              const verifyResponse = await fetch("https://redtestlab.com/api/doctor/verify-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpayOrderId: data.razorpayOrderId,
                  razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                  razorpaySignature: razorpayResponse.razorpay_signature,
                  consultationId: data.consultationId,
                }),
              })

              const verifyData = await verifyResponse.json()
              console.log("Payment verification response:", verifyData)

              if (verifyData.success) {
                setSuccess("Booking confirmed successfully!")
                setTimeout(() => {
                  onClose()
                }, 2000)
              } else {
                setError("Payment verification failed. Please contact support.")
              }
            } catch (err) {
              console.error("Payment verification error:", err)
              setError("Payment verification failed. Please contact support.")
            } finally {
              setLoading(false)
            }
          },
          prefill: {
            name: formData.patientName,
            email: formData.email,
            contact: formData.phoneNumber.replace("+91", ""),
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: () => {
              console.log("Payment modal dismissed")
              setLoading(false)
              setError("Payment was cancelled. Please try again.")
            },
          },
        }

        console.log("Opening Razorpay with options:", options)
        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()

        // Set loading to false after opening the modal
        setLoading(false)
      } else {
        throw new Error(data.message || "Failed to create payment order")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Failed to process payment. Please try again.")
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setOtp(["", "", "", "", "", ""])
      handleFormSubmit(new Event("submit") as any)
    }
  }

  const renderFormStep = () => (
    <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Patient Name *
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter patient name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter email address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter 10-digit phone number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Appointment Date *
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleInputChange}
            min={getTomorrowDate()}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-2" />
          Appointment Time *
        </label>
        <select
          name="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
          required
        >
          <option value="">Select time slot</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Reason for Consultation *
        </label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
          placeholder="Describe your symptoms or reason for consultation"
          required
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm leading-relaxed">{error}</span>
        </div>
      )}

      {!razorpayLoaded && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Loader2 className="w-4 h-4 text-yellow-600 animate-spin flex-shrink-0 mt-0.5" />
          <span className="text-yellow-700 text-sm leading-relaxed">Loading payment system...</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium text-sm sm:text-base">Consultation Fee:</span>
          <span className="text-xl sm:text-2xl font-bold text-blue-600">
            ₹{doctor.consultationFee.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !razorpayLoaded}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Sending OTP...
          </>
        ) : !razorpayLoaded ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Loading Payment System...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            Book Now
          </>
        )}
      </button>
    </form>
  )

  const renderOTPStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Verify Your Phone Number</h3>
        <p className="text-gray-600 text-sm sm:text-base px-4">
          We've sent a 6-digit code to <span className="font-medium">{formData.phoneNumber}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Enter Verification Code</label>
        <div className="flex gap-1.5 sm:gap-2 justify-center px-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
    otpRefs.current[index] = el;
  }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => handleOTPKeyDown(index, e)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm leading-relaxed">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-green-700 text-sm leading-relaxed">{success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setCurrentStep("form")}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
        >
          Back
        </button>
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.join("").length !== 6}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  )

  const renderPaymentStep = () => (
    <div className="text-center space-y-4 sm:space-y-6">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
        <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600 text-sm sm:text-base px-4">Please complete the payment to confirm your booking</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-600" />
          <span className="text-gray-600 text-sm sm:text-base">Initializing payment...</span>
        </div>
      )}

      {success && (
        <div className="flex items-start justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span className="text-green-700 text-sm sm:text-base leading-relaxed">{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm sm:text-base leading-relaxed">{error}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <img
              src={doctor.imageUrl || "/placeholder.svg?height=60&width=60"}
              alt={`Dr. ${doctor.name}`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Book Consultation</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Dr. {doctor.name} • {doctor.specialization}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <div
              className={`flex items-center ${currentStep === "form" ? "text-blue-600" : currentStep === "otp" || currentStep === "payment" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep === "form" ? "bg-blue-100" : currentStep === "otp" || currentStep === "payment" ? "bg-green-100" : "bg-gray-100"}`}
              >
                1
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden xs:inline">Details</span>
            </div>

            <div
              className={`w-4 sm:w-8 h-0.5 ${currentStep === "otp" || currentStep === "payment" ? "bg-green-600" : "bg-gray-300"}`}
            />

            <div
              className={`flex items-center ${currentStep === "otp" ? "text-blue-600" : currentStep === "payment" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep === "otp" ? "bg-blue-100" : currentStep === "payment" ? "bg-green-100" : "bg-gray-100"}`}
              >
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden xs:inline">Verify</span>
            </div>

            <div className={`w-4 sm:w-8 h-0.5 ${currentStep === "payment" ? "bg-green-600" : "bg-gray-300"}`} />

            <div className={`flex items-center ${currentStep === "payment" ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${currentStep === "payment" ? "bg-blue-100" : "bg-gray-100"}`}
              >
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden xs:inline">Payment</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {currentStep === "form" && renderFormStep()}
          {currentStep === "otp" && renderOTPStep()}
          {currentStep === "payment" && renderPaymentStep()}
        </div>
      </div>
    </div>
  )
}
