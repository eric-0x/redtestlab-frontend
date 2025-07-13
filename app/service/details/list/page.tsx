"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Building2,
  User,
  Home,
  Calendar,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  TestTube,
  ImageIcon,
  CheckCircle,
  XCircle,
  Activity,
  Edit,
  Save,
  X,
  Upload,
  Plus,
  Minus,
  Eye,
  EyeOff,
} from "lucide-react"

interface ServiceProvider {
  id: string
  email: string
  labName: string
  ownerName: string
  contactNumber: string
  city: string
  state: string
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  servicesOffered: string[]
  testsAvailable: string[]
  labImagesUrls: string[]
}

interface EditFormData {
  email: string
  labName: string
  ownerName: string
  contactNumber: string
  city: string
  state: string
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  servicesOffered: string[]
  testsAvailable: string[]
  labImagesUrls: string[]
}

const MyDetails: React.FC = () => {
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showAllServices, setShowAllServices] = useState(false)
  const [showAllTests, setShowAllTests] = useState(false)

  const fetchProviderDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const serviceId = localStorage.getItem("serviceId")
      if (!serviceId) {
        throw new Error("Service ID not found. Please log in again.")
      }

      const response = await fetch(`https://redtestlab.com/api/auth/service/${serviceId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProvider(data.serviceProvider || data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch provider details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviderDetails()
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "E-Rickshaw") // Replace with your Cloudinary upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dm8jxispy/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      throw new Error("Image upload failed")
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !editFormData) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadToCloudinary(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      setEditFormData({
        ...editFormData,
        labImagesUrls: [...editFormData.labImagesUrls, ...uploadedUrls],
      })

      showNotification("success", "Images uploaded successfully")
    } catch (error) {
      showNotification("error", "Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    if (!editFormData) return

    const newImages = editFormData.labImagesUrls.filter((_, i) => i !== index)
    setEditFormData({
      ...editFormData,
      labImagesUrls: newImages,
    })
  }

  const startEdit = () => {
    if (!provider) return

    setEditFormData({
      email: provider.email,
      labName: provider.labName,
      ownerName: provider.ownerName,
      contactNumber: provider.contactNumber,
      city: provider.city,
      state: provider.state,
      homeCollection: provider.homeCollection,
      appointmentBooking: provider.appointmentBooking,
      emergencyTestFacility: provider.emergencyTestFacility,
      servicesOffered: [...provider.servicesOffered],
      testsAvailable: [...provider.testsAvailable],
      labImagesUrls: [...provider.labImagesUrls],
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditFormData(null)
  }

  const handleUpdate = async () => {
    if (!editFormData || !provider) return

    setLoading(true)
    try {
      const response = await fetch(`https://redtestlab.com/api/auth/service/${provider.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to update provider details")
      }

      await fetchProviderDetails()
      setIsEditing(false)
      setEditFormData(null)
      showNotification("success", "Details updated successfully")
    } catch (error) {
      showNotification("error", "Failed to update details")
    } finally {
      setLoading(false)
    }
  }

  const addArrayItem = (field: "servicesOffered" | "testsAvailable", value: string) => {
    if (!editFormData || !value.trim()) return

    setEditFormData({
      ...editFormData,
      [field]: [...editFormData[field], value.trim()],
    })
  }

  const removeArrayItem = (field: "servicesOffered" | "testsAvailable", index: number) => {
    if (!editFormData) return

    setEditFormData({
      ...editFormData,
      [field]: editFormData[field].filter((_, i) => i !== index),
    })
  }

  const getServiceIcon = (service: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      "Blood Test": TestTube,
      MRI: Activity,
      "X-Ray": Activity,
      "CT Scan": Activity,
      ECG: Activity,
      Ultrasound: Activity,
      Other: Stethoscope,
    }
    return iconMap[service] || Stethoscope
  }

  const FeatureCard: React.FC<{ icon: React.ComponentType<any>; label: string; value: boolean }> = ({
    icon: Icon,
    label,
    value,
  }) => (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center space-x-3">
      <div className={`p-2 rounded-full ${value ? "bg-black" : "bg-gray-300"}`}>
        <Icon className={`h-5 w-5 ${value ? "text-white" : "text-gray-600"}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-lg font-bold ${value ? "text-black" : "text-gray-400"}`}>
          {value ? "Available" : "Not Available"}
        </p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-black animate-spin" />
            <span className="text-lg font-medium text-gray-700">Loading your details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full border-2 border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-black" />
            <h2 className="text-lg font-semibold text-gray-900">Error Loading Details</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProviderDetails}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
          <p className="text-gray-600">No provider details found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-2 ${
              notification.type === "success"
                ? "bg-white border-black text-black"
                : "bg-black border-gray-800 text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-black p-4 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black">{provider.labName}</h1>
                <p className="text-lg text-gray-600">Laboratory Details</p>
              </div>
            </div>
            <button
              onClick={startEdit}
              className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                <User className="h-6 w-6 mr-3" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Owner Name</label>
                    <p className="text-lg font-semibold text-black">{provider.ownerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-lg font-semibold text-black break-all">{provider.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                    <p className="text-lg font-semibold text-black">{provider.contactNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                    <p className="text-lg font-semibold text-black">
                      {provider.city}, {provider.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black flex items-center">
                  <Stethoscope className="h-6 w-6 mr-3" />
                  Services Offered
                </h2>
                {provider.servicesOffered.length > 6 && (
                  <button
                    onClick={() => setShowAllServices(!showAllServices)}
                    className="text-black hover:text-gray-600 font-medium flex items-center space-x-1"
                  >
                    {showAllServices ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showAllServices ? "Show Less" : "Show All"}</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(showAllServices ? provider.servicesOffered : provider.servicesOffered.slice(0, 6)).map(
                  (service, index) => {
                    const ServiceIcon = getServiceIcon(service)
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                        <ServiceIcon className="h-5 w-5 text-black" />
                        <span className="font-medium text-gray-800">{service}</span>
                      </div>
                    )
                  },
                )}
              </div>
            </div>

            {/* Tests Available */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black flex items-center">
                  <TestTube className="h-6 w-6 mr-3" />
                  Tests Available
                </h2>
                {provider.testsAvailable.length > 6 && (
                  <button
                    onClick={() => setShowAllTests(!showAllTests)}
                    className="text-black hover:text-gray-600 font-medium flex items-center space-x-1"
                  >
                    {showAllTests ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showAllTests ? "Show Less" : "Show All"}</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(showAllTests ? provider.testsAvailable : provider.testsAvailable.slice(0, 6)).map((test, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                    <TestTube className="h-5 w-5 text-black" />
                    <span className="font-medium text-gray-800">{test}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-black mb-6">Features</h2>
              <div className="space-y-4">
                <FeatureCard icon={Home} label="Home Collection" value={provider.homeCollection} />
                <FeatureCard icon={Calendar} label="Appointment Booking" value={provider.appointmentBooking} />
                <FeatureCard icon={AlertTriangle} label="Emergency Facility" value={provider.emergencyTestFacility} />
              </div>
            </div>

            {/* Lab Images */}
            {provider.labImagesUrls.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                  <ImageIcon className="h-6 w-6 mr-3" />
                  Lab Images
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {provider.labImagesUrls.slice(0, 4).map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200"
                      onClick={() => setSelectedImage(url)}
                    >
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Lab image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                  ))}
                </div>
                {provider.labImagesUrls.length > 4 && (
                  <p className="text-center text-gray-600 mt-4 font-medium">
                    +{provider.labImagesUrls.length - 4} more images
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-black">Edit Details</h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 border-2 border-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-black border-b-2 border-gray-200 pb-2">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lab Name</label>
                    <input
                      type="text"
                      value={editFormData.labName}
                      onChange={(e) => setEditFormData({ ...editFormData, labName: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                    <input
                      type="text"
                      value={editFormData.ownerName}
                      onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                    <input
                      type="tel"
                      value={editFormData.contactNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={editFormData.state}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* Features and Services */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-black border-b-2 border-gray-200 pb-2">Features & Services</h3>

                  {/* Boolean Features */}
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        checked={editFormData.homeCollection}
                        onChange={(e) => setEditFormData({ ...editFormData, homeCollection: e.target.checked })}
                        className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                      />
                      <span className="font-medium text-gray-700">Home Collection</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        checked={editFormData.appointmentBooking}
                        onChange={(e) => setEditFormData({ ...editFormData, appointmentBooking: e.target.checked })}
                        className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                      />
                      <span className="font-medium text-gray-700">Appointment Booking</span>
                    </label>

                    <label className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        checked={editFormData.emergencyTestFacility}
                        onChange={(e) => setEditFormData({ ...editFormData, emergencyTestFacility: e.target.checked })}
                        className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black"
                      />
                      <span className="font-medium text-gray-700">Emergency Test Facility</span>
                    </label>
                  </div>

                  {/* Services Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Services Offered</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {editFormData.servicesOffered.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={service}
                            onChange={(e) => {
                              const newServices = [...editFormData.servicesOffered]
                              newServices[index] = e.target.value
                              setEditFormData({ ...editFormData, servicesOffered: newServices })
                            }}
                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                          />
                          <button
                            onClick={() => removeArrayItem("servicesOffered", index)}
                            className="p-2 text-white bg-black hover:bg-gray-800 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("servicesOffered", "New Service")}
                        className="flex items-center space-x-2 text-black hover:text-gray-600 font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Service</span>
                      </button>
                    </div>
                  </div>

                  {/* Tests Available */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Tests Available</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {editFormData.testsAvailable.map((test, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={test}
                            onChange={(e) => {
                              const newTests = [...editFormData.testsAvailable]
                              newTests[index] = e.target.value
                              setEditFormData({ ...editFormData, testsAvailable: newTests })
                            }}
                            className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                          />
                          <button
                            onClick={() => removeArrayItem("testsAvailable", index)}
                            className="p-2 text-white bg-black hover:bg-gray-800 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("testsAvailable", "New Test")}
                        className="flex items-center space-x-2 text-black hover:text-gray-600 font-medium"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Images */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-black mb-4 border-b-2 border-gray-200 pb-2">Lab Images</h3>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 font-medium">Click to upload images</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </div>
                  </label>
                  {uploading && (
                    <div className="mt-3 flex items-center justify-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-black" />
                      <span className="text-sm text-black font-medium">Uploading images...</span>
                    </div>
                  )}
                </div>

                {/* Current Images */}
                {editFormData.labImagesUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {editFormData.labImagesUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Lab image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={uploading}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center space-x-2 font-medium"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Lab image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors border-2 border-gray-200"
            >
              <XCircle className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyDetails
