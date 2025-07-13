"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Building2,
  User,
  Phone,
  MapPin,
  Mail,
  Home,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  TestTube,
  ImageIcon,
  CheckCircle,
  XCircle,
  Activity,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Plus,
  Minus,
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

interface ApiResponse {
  message: string
  serviceProviders: ServiceProvider[]
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

const ServiceProviderShowcase: React.FC = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingProvider, setEditingProvider] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isEditing, setIsEditing] = useState(false) // Declare isEditing variable

  const fetchProviders = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://redtestlab.com/api/auth/service/all")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setProviders(data.serviceProviders)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch service providers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
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

  const startEdit = (provider: ServiceProvider) => {
    setEditingProvider(provider.id)
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
    setIsEditing(true) // Set isEditing to true when starting edit
  }

  const cancelEdit = () => {
    setEditingProvider(null)
    setEditFormData(null)
    setIsEditing(false) // Set isEditing to false when canceling edit
  }

  const handleUpdate = async () => {
    if (!editFormData || !editingProvider) return

    setLoading(true)
    try {
      const response = await fetch(`https://redtestlab.com/api/auth/service/${editingProvider}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to update provider")
      }

      await fetchProviders()
      setEditingProvider(null)
      setEditFormData(null)
      setIsEditing(false) // Set isEditing to false after update
      showNotification("success", "Provider updated successfully")
    } catch (error) {
      showNotification("error", "Failed to update provider")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`https://redtestlab.com/api/auth/service/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete provider")
      }

      await fetchProviders()
      setDeleteConfirm(null)
      showNotification("success", "Provider deleted successfully")
    } catch (error) {
      showNotification("error", "Failed to delete provider")
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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
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

  const BooleanIndicator: React.FC<{ value: boolean; label: string; icon: React.ComponentType<any> }> = ({
    value,
    label,
    icon: Icon,
  }) => (
    <div className="flex items-center space-x-2">
      <div className={`p-1.5 rounded-full ${value ? "bg-green-100" : "bg-red-100"}`}>
        {value ? <CheckCircle className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-red-600" />}
      </div>
      <Icon className="h-4 w-4 text-gray-600" />
      <span className={`text-xs font-medium ${value ? "text-green-700" : "text-red-700"}`}>{label}</span>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
            <span className="text-lg font-medium text-gray-700">Loading service providers...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Error Loading Providers</h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProviders}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Service Provider Directory</h1>
          <p className="text-lg md:text-xl text-gray-600">Comprehensive healthcare laboratory network</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-1 w-12 bg-blue-600 rounded"></div>
            <div className="h-1 w-6 bg-blue-400 rounded"></div>
            <div className="h-1 w-3 bg-blue-300 rounded"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-blue-100">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                <Building2 className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Labs</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{providers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-green-100">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 md:p-3 rounded-full">
                <Home className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Home Collection</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {providers.filter((p) => p.homeCollection).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-purple-100">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {providers.filter((p) => p.appointmentBooking).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-red-100">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 md:p-3 rounded-full">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
              </div>
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600">Emergency</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">
                  {providers.filter((p) => p.emergencyTestFacility).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {providers.map((provider) => {
            const isExpanded = expandedCards.has(provider.id)
            const isEditingLocal = editingProvider === provider.id

            return (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                {/* Main Card Content */}
                <div className="p-4 md:p-6">
                  {/* Header with Action Buttons */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{provider.labName}</h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm">{provider.ownerName}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(provider)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit Provider"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(provider.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete Provider"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm truncate">{provider.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{provider.contactNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {provider.city}, {provider.state}
                      </span>
                    </div>
                  </div>

                  {/* Quick Features */}
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <BooleanIndicator value={provider.homeCollection} label="Home Collection" icon={Home} />
                    <BooleanIndicator value={provider.appointmentBooking} label="Appointment Booking" icon={Calendar} />
                    <BooleanIndicator
                      value={provider.emergencyTestFacility}
                      label="Emergency Facility"
                      icon={AlertTriangle}
                    />
                  </div>

                  {/* Services Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.servicesOffered.slice(0, 3).map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                      {provider.servicesOffered.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{provider.servicesOffered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => toggleExpanded(provider.id)}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50">
                    {/* All Services */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        All Services Offered
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {provider.servicesOffered.map((service, index) => {
                          const ServiceIcon = getServiceIcon(service)
                          return (
                            <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                              <ServiceIcon className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-gray-700">{service}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tests Available */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <TestTube className="h-4 w-4 mr-2" />
                        Tests Available
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {provider.testsAvailable.map((test, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded-lg">
                            <TestTube className="h-3 w-3 text-green-600" />
                            <span className="text-sm text-gray-700">{test}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lab Images */}
                    {provider.labImagesUrls.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Lab Images
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {provider.labImagesUrls.map((url, index) => (
                            <div
                              key={index}
                              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Service Provider</h2>
                <button
                  onClick={cancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lab Name</label>
                    <input
                      type="text"
                      value={editFormData.labName}
                      onChange={(e) => setEditFormData({ ...editFormData, labName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      value={editFormData.ownerName}
                      onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={editFormData.contactNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={editFormData.state}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Features and Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Features & Services</h3>

                  {/* Boolean Features */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editFormData.homeCollection}
                        onChange={(e) => setEditFormData({ ...editFormData, homeCollection: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Home Collection</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editFormData.appointmentBooking}
                        onChange={(e) => setEditFormData({ ...editFormData, appointmentBooking: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Appointment Booking</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editFormData.emergencyTestFacility}
                        onChange={(e) => setEditFormData({ ...editFormData, emergencyTestFacility: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Emergency Test Facility</span>
                    </label>
                  </div>

                  {/* Services Offered */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                    <div className="space-y-2">
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
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeArrayItem("servicesOffered", index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("servicesOffered", "New Service")}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Add Service</span>
                      </button>
                    </div>
                  </div>

                  {/* Tests Available */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tests Available</label>
                    <div className="space-y-2">
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
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeArrayItem("testsAvailable", index)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem("testsAvailable", "New Test")}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Add Test</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Images */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lab Images</h3>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Click to upload images</span>
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
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-blue-600">Uploading images...</span>
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
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Confirm Delete</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this service provider? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
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
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <XCircle className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceProviderShowcase