"use client"

import { useState, useEffect } from "react"
import {
  Loader2,
  AlertCircle,
  FileText,
  X,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react"

// TypeScript interfaces
interface User {
  id: number
  email: string
  name: string | null
  role: string
}

interface ServiceProvider {
  id: string
  labName: string
  registrationNumber: string
  ownerName: string
  contactNumber: string
  email: string
  address: string
  city: string
  state: string
  openingTime: string
  closingTime: string
  operatingDays: string[]
  servicesOffered: string[]
  testsAvailable: string[]
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  reportDeliveryMethods: string[]
  homeCollectionCharges: number
  minimumOrderValue: number
  reportGenerationTime: string
  paymentModesAccepted: string[]
}

interface Prescription {
  id: number
  userId: number
  fileUrl: string
  status: string
  assignedToId: string
  resultFileUrl: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
  user: User
  assignedTo: ServiceProvider
}

export default function ReturnedPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: string
  }>({
    show: false,
    message: "",
    type: "",
  })
  const [finalizing, setFinalizing] = useState<{ [key: number]: boolean }>({})

  // Fetch returned prescriptions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch returned prescriptions
        const response = await fetch("https://redtestlab.com/api/prescriptions/admin/returned")

        if (!response.ok) {
          throw new Error(`Failed to fetch prescriptions: ${response.status}`)
        }

        const data = await response.json()
        setPrescriptions(data)
      } catch (err) {
        setError("Failed to fetch data. Please try again.")
        console.error("Error fetching data:", err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewDetails = (provider: ServiceProvider) => {
    setSelectedProvider(provider)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProvider(null)
  }

  const handleFinalize = async (prescriptionId: number) => {
    setFinalizing((prev) => ({ ...prev, [prescriptionId]: true }))

    try {
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/admin/finalize/${prescriptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to finalize prescription: ${response.status}`)
      }

      const updatedPrescription = await response.json()

      // Remove the finalized prescription from the list
      setPrescriptions((prev) => prev.filter((p) => p.id !== prescriptionId))

      // Show success notification
      setNotification({
        show: true,
        message: `Prescription #${prescriptionId} has been finalized successfully`,
        type: "success",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } catch (err) {
      console.error("Error finalizing prescription:", err instanceof Error ? err.message : String(err))

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to finalize prescription #${prescriptionId}`,
        type: "error",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } finally {
      setFinalizing((prev) => ({ ...prev, [prescriptionId]: false }))
    }
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg text-gray-700">Loading prescriptions...</p>
      </div>
    )
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <p className="mt-4 text-lg text-gray-700">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center z-50 transition-opacity ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Returned Prescriptions</h1>
          <p className="text-gray-600 mt-2">
            View prescriptions that have been processed and returned by service providers
          </p>
        </header>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">No returned prescriptions</h2>
            <p className="text-gray-500 mt-2">
              No prescriptions have been returned by service providers at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-green-50 border-b border-green-100">
                  <h3 className="font-medium text-green-800 flex items-center">
                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                      #{prescription.id}
                    </span>
                    Prescription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Updated: {new Date(prescription.updatedAt).toLocaleDateString()} at{" "}
                    {new Date(prescription.updatedAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="p-4">
                  {/* Patient Info */}
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">Patient:</span>
                    <span className="text-gray-600">{prescription.user.name || prescription.user.email}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {prescription.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Service Provider */}
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">Provider:</span>
                    <span className="text-gray-600">{prescription.assignedTo.ownerName}</span>
                  </div>

                  {/* Lab Name */}
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">Lab:</span>
                    <span className="text-gray-600">{prescription.assignedTo.labName}</span>
                  </div>

                  {/* Remarks */}
                  {prescription.remarks && (
                    <div className="mb-3">
                      <span className="font-medium text-gray-700 block mb-1">Remarks:</span>
                      <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                        {prescription.remarks}
                      </p>
                    </div>
                  )}

                  {/* Document Links */}
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <a
                      href={prescription.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Original Prescription
                    </a>

                    {prescription.resultFileUrl && (
                      <a
                        href={prescription.resultFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Result Report
                      </a>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleViewDetails(prescription.assignedTo)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Provider Details
                    </button>

                    <button
                      onClick={() => handleFinalize(prescription.id)}
                      disabled={finalizing[prescription.id]}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center"
                    >
                      {finalizing[prescription.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Send User
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Provider Details Modal */}
        {showModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 md:p-6 relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-4">Service Provider Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{selectedProvider.labName}</h3>
                      <p className="text-gray-600 text-sm">Registration: {selectedProvider.registrationNumber}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{selectedProvider.address}</p>
                          <p className="text-gray-600">
                            {selectedProvider.city}, {selectedProvider.state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{selectedProvider.contactNumber}</span>
                      </div>

                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{selectedProvider.email}</span>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{selectedProvider.operatingDays.join(", ")}</span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">
                          {selectedProvider.openingTime} - {selectedProvider.closingTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Services Offered</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.servicesOffered.map((service) => (
                          <span key={service} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Tests Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.testsAvailable.map((test) => (
                          <span key={test} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Features</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span
                            className={`mr-2 ${selectedProvider.homeCollection ? "text-green-500" : "text-gray-400"}`}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </span>
                          <span className="text-gray-700">
                            Home Collection
                            {selectedProvider.homeCollection &&
                              selectedProvider.homeCollectionCharges > 0 &&
                              ` (₹${selectedProvider.homeCollectionCharges})`}
                          </span>
                        </li>
                        <li className="flex items-center">
                          <span
                            className={`mr-2 ${selectedProvider.appointmentBooking ? "text-green-500" : "text-gray-400"}`}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </span>
                          <span className="text-gray-700">Appointment Booking</span>
                        </li>
                        <li className="flex items-center">
                          <span
                            className={`mr-2 ${selectedProvider.emergencyTestFacility ? "text-green-500" : "text-gray-400"}`}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </span>
                          <span className="text-gray-700">Emergency Testing</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Payment Methods</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.paymentModesAccepted.map((payment) => (
                          <span key={payment} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {payment}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Report Delivery</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.reportDeliveryMethods.map((method) => (
                          <span key={method} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Additional Info</h4>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Minimum Order:</span> ₹{selectedProvider.minimumOrderValue}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Report Generation Time:</span>{" "}
                        {selectedProvider.reportGenerationTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
