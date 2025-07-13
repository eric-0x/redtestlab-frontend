"use client"

import { useState, useEffect } from "react"
import { ChevronDown, CheckCircle, AlertCircle, Loader2, FileText, Coins } from "lucide-react"

// TypeScript interfaces
interface User {
  id: number
  email: string
  password: string
  name: string | null
  role: string
  createdAt: string
  updatedAt: string
  googleId: string | null
}

interface Prescription {
  id: number
  userId: number
  fileUrl: string
  status: string
  assignedToId: string | null
  resultFileUrl: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
  user: User
}

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

interface NotificationType {
  show: boolean
  message: string
  type: string
}

interface AssigningState {
  [key: number]: boolean
}

export default function PendingPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [assigning, setAssigning] = useState<AssigningState>({})
  const [notification, setNotification] = useState<NotificationType>({
    show: false,
    message: "",
    type: "",
  })
  const [selectedProvider, setSelectedProvider] = useState<{
    [key: number]: string
  }>({})
  const [coinsAmount, setCoinsAmount] = useState<{
    [key: number]: string
  }>({})

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".dropdown-container")) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch pending prescriptions and service providers on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch pending prescriptions
        const prescriptionsResponse = await fetch(
          "https://redtestlab.com/api/prescriptions/admin/pending",
        )

        if (!prescriptionsResponse.ok) {
          throw new Error(`Failed to fetch prescriptions: ${prescriptionsResponse.status}`)
        }

        const prescriptionsData = await prescriptionsResponse.json()

        // Fetch service providers
        const providersResponse = await fetch("https://redtestlab.com/api/auth/service/all")

        if (!providersResponse.ok) {
          throw new Error(`Failed to fetch service providers: ${providersResponse.status}`)
        }

        const providersData = await providersResponse.json()

        setPrescriptions(prescriptionsData)
        setServiceProviders(providersData.serviceProviders || [])

        // Initialize coins amount for each prescription
        const initialCoinsAmount: { [key: number]: string } = {}
        prescriptionsData.forEach((prescription: Prescription) => {
          initialCoinsAmount[prescription.id] = "10" // Default value
        })
        setCoinsAmount(initialCoinsAmount)
      } catch (err) {
        setError("Failed to fetch data. Please try again.")
        console.error("Error fetching data:", err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDropdownToggle = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  const assignPrescription = async (prescriptionId: number, providerId: string) => {
    // Validate coins amount
    if (!coinsAmount[prescriptionId] || Number.parseInt(coinsAmount[prescriptionId]) <= 0) {
      setNotification({
        show: true,
        message: "Please enter a valid coins amount",
        type: "error",
      })
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
      return
    }

    // Set assigning state for this prescription to show loading
    setAssigning((prev) => ({ ...prev, [prescriptionId]: true }))

    try {
      const response = await fetch(
        `https://redtestlab.com/api/prescriptions/admin/assign/${prescriptionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
            coins: Number.parseInt(coinsAmount[prescriptionId]),
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to assign prescription: ${response.status} ${errorText}`)
      }

      const updatedPrescription = await response.json()

      // Update the prescriptions list - remove the assigned prescription
      setPrescriptions((prev) => prev.filter((p) => p.id !== prescriptionId))

      // Show success notification
      setNotification({
        show: true,
        message: `Prescription #${prescriptionId} has been successfully assigned to ${
          serviceProviders.find((p) => p.id === providerId)?.labName || "provider"
        } with ${coinsAmount[prescriptionId]} coins`,
        type: "success",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } catch (err) {
      console.error("Error assigning prescription:", err instanceof Error ? err.message : String(err))

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to assign prescription #${prescriptionId}`,
        type: "error",
      })

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } finally {
      // Clear assigning state
      setAssigning((prev) => ({ ...prev, [prescriptionId]: false }))
      // Close dropdown
      setOpenDropdown(null)
    }
  }

  // Handle coins amount change
  const handleCoinsChange = (prescriptionId: number, value: string) => {
    // Only allow positive numbers
    if (/^\d*$/.test(value)) {
      setCoinsAmount((prev) => ({
        ...prev,
        [prescriptionId]: value,
      }))
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
    <div className="min-h-screen bg-gray-50 p-6">
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
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Pending Prescriptions</h1>
          <p className="text-gray-600 mt-2">Assign prescriptions to service providers for processing</p>
        </header>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">No pending prescriptions</h2>
            <p className="text-gray-500 mt-2">
              All prescriptions have been assigned or none are available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-4 bg-blue-50 border-b border-blue-100">
                  <h3 className="font-medium text-blue-800 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                      #{prescription.id}
                    </span>
                    Prescription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Uploaded: {new Date(prescription.createdAt).toLocaleDateString()} at{" "}
                    {new Date(prescription.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-gray-700 mr-2">Patient:</span>
                    <span className="text-gray-600">{prescription.user.email}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <span className="font-medium text-gray-700 mr-2">Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {prescription.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <a
                        href={prescription.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Prescription File
                      </a>
                    </div>
                  </div>

                  {/* Coins input field */}
                  <div className="mb-4">
                    <label
                      htmlFor={`coins-${prescription.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Assign Coins
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Coins className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id={`coins-${prescription.id}`}
                        value={coinsAmount[prescription.id] || ""}
                        onChange={(e) => handleCoinsChange(prescription.id, e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter coins amount"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Each coin is worth ₹1 and will be credited to the service provider upon completion.
                    </p>
                  </div>

                  {/* New layout with dropdown on left, button on right */}
                  <div className="flex gap-2">
                    {/* Provider Dropdown */}
                    <div className="relative dropdown-container flex-grow z-10">
                      <div className="w-full border border-gray-300 rounded-md bg-white">
                        <button
                          onClick={() => handleDropdownToggle(prescription.id)}
                          className="w-full px-3 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          disabled={assigning[prescription.id]}
                        >
                          <span className="text-sm text-gray-700 truncate">
                            {selectedProvider[prescription.id]
                              ? serviceProviders.find((p) => p.id === selectedProvider[prescription.id])?.labName ||
                                "Select provider"
                              : "Select provider"}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-gray-500 transition-transform ${
                              openDropdown === prescription.id ? "transform rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openDropdown === prescription.id && (
                          <div className="fixed z-50 mt-1 w-[calc(100%-3rem)] sm:w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {serviceProviders.map((provider) => (
                              <button
                                key={provider.id}
                                onClick={() => {
                                  setSelectedProvider((prev) => ({
                                    ...prev,
                                    [prescription.id]: provider.id,
                                  }))
                                  setOpenDropdown(null)
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                                  selectedProvider[prescription.id] === provider.id ? "bg-blue-100 font-medium" : ""
                                }`}
                              >
                                {provider.labName} – {provider.city}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assign Button */}
                    <button
                      onClick={() => assignPrescription(prescription.id, selectedProvider[prescription.id])}
                      disabled={!selectedProvider[prescription.id] || assigning[prescription.id]}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
                    >
                      {assigning[prescription.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
