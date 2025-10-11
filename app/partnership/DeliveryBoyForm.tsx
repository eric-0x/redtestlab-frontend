"use client"

import { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Upload, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Clock,
  DollarSign
} from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  photo: File | null
}

interface DeliveryBoyFormProps {
  onClose?: () => void
}

const DeliveryBoyForm = ({ onClose }: DeliveryBoyFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: null
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error"
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      photo: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification({ show: false, message: "", type: "success" })

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("address", formData.address)
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo)
      }

      const response = await fetch("https://redtestlab.com/api/delivery-boy/interest", {
        method: "POST",
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setNotification({
        show: true,
        message: "Application submitted successfully! We'll contact you soon.",
        type: "success"
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        photo: null
      })

      // Clear file input
      const fileInput = document.getElementById("photo") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Close modal after 3 seconds
      setTimeout(() => {
        if (onClose) onClose()
      }, 3000)

    } catch (error) {
      console.error("Error submitting form:", error)
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : "Failed to submit application. Please try again.",
        type: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Truck className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Delivery Boy Application
        </h2>
        <p className="text-sm text-gray-600">
          Join our delivery team and help us provide excellent service
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-800 text-center">Competitive Pay</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-800 text-center">Flexible Hours</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <Truck className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-medium text-purple-800 text-center">Growth Opportunities</span>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          notification.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none text-sm"
              placeholder="Enter your complete address"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="photo" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {formData.photo ? formData.photo.name : "Click to upload photo"}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">What happens next?</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• We'll review your application within 2-3 business days</li>
          <li>• If selected, we'll contact you for an interview</li>
          <li>• Successful candidates will receive training and onboarding</li>
        </ul>
      </div>
    </div>
  )
}

export default DeliveryBoyForm
