"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Users,
  Calendar,
  Plus,
  Phone,
  MapPin,
  Clock,
  Star,
  X,
  Loader2,
  Save,
  ChevronDown,
  TrendingUp,
  UserCheck,
} from "lucide-react"

import { CloudinaryUpload } from "../../../../components/Cloudinary"

// Import your actual API service
import { apiService } from "../../../../components/api"

// Types
interface Hospital {
  id: number
  name: string
  images?: string[]
  address: string
  city: string
  state: string
  pincode: string
  departments: string[]
  facilities: string[]
  contactEmail?: string
  contactPhone?: string
  availableDays: string[]
  fromTime: string
  toTime: string
  feeRangeMin: number
  feeRangeMax: number
  commission: number
  isScanProvider: boolean
  treatmentTags: string[]
  doctors?: Doctor[]
  createdAt?: string
}

interface Doctor {
  id: number
  name: string
  imageUrl: string
  gender: string
  experienceYears: number
  qualifications: string
  specialization: string
  languagesSpoken: string[]
  affiliatedHospitalId: number
  consultationFee: number
  availableDays: string[]
  fromTime: string
  toTime: string
  contactPhone?: string
  contactEmail?: string
  commission: number
  treatmentTags: string[]
  createdAt?: string
}

interface Consultation {
  id: number
  patientName: string
  email: string
  phoneNumber: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  amountPaid: number
  showContactInfo: boolean
  createdAt: string
  doctor?: Doctor
  hospital?: Hospital
}

type TabType = "hospitals" | "doctors" | "bookings" | "stats"

interface HospitalFormData {
  name: string
  images: string[]
  address: string
  city: string
  state: string
  pincode: string
  departments: string[]
  facilities: string[]
  contactEmail: string
  contactPhone: string
  availableDays: string[]
  fromTime: string
  toTime: string
  feeRangeMin: number
  feeRangeMax: number
  commission: number
  isScanProvider: boolean
  treatmentTags: string[]
}

interface DoctorFormData {
  name: string
  imageUrl: string
  gender: string
  experienceYears: number
  qualifications: string
  specialization: string
  languagesSpoken: string[]
  affiliatedHospitalId: number
  consultationFee: number
  availableDays: string[]
  fromTime: string
  toTime: string
  contactPhone: string
  contactEmail: string
  commission: number
  treatmentTags: string[]
}

export default function AdminHospitalComponent() {
  // State management
  const [activeTab, setActiveTab] = useState<TabType>("hospitals")
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Dialog states
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"create" | "edit">("create")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  // Form states
  const [hospitalForm, setHospitalForm] = useState<HospitalFormData>({
    name: "",
    images: [],
    address: "",
    city: "",
    state: "",
    pincode: "",
    departments: [],
    facilities: [],
    contactEmail: "",
    contactPhone: "",
    availableDays: [],
    fromTime: "",
    toTime: "",
    feeRangeMin: 0,
    feeRangeMax: 0,
    commission: 0,
    isScanProvider: false,
    treatmentTags: [],
  })

  const [doctorForm, setDoctorForm] = useState<DoctorFormData>({
    name: "",
    imageUrl: "",
    gender: "",
    experienceYears: 0,
    qualifications: "",
    specialization: "",
    languagesSpoken: [],
    affiliatedHospitalId: 0,
    consultationFee: 0,
    availableDays: [],
    fromTime: "",
    toTime: "",
    contactPhone: "",
    contactEmail: "",
    commission: 0,
    treatmentTags: [],
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [hospitalsData, doctorsData, consultationsData] = await Promise.all([
        apiService.getHospitals(),
        apiService.getDoctors(),
        apiService.getConsultations(),
      ])
      setHospitals(hospitalsData)
      setDoctors(doctorsData)
      setConsultations(consultationsData)
    } catch (err) {
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Hospital operations
  const handleCreateHospital = () => {
    setModalType("create")
    setSelectedItem(null)
    setHospitalForm({
      name: "",
      images: [],
      address: "",
      city: "",
      state: "",
      pincode: "",
      departments: [],
      facilities: [],
      contactEmail: "",
      contactPhone: "",
      availableDays: [],
      fromTime: "",
      toTime: "",
      feeRangeMin: 0,
      feeRangeMax: 0,
      commission: 0,
      isScanProvider: false,
      treatmentTags: [],
    })
    setShowModal(true)
  }

  const handleEditHospital = (hospital: Hospital) => {
    setModalType("edit")
    setSelectedItem(hospital)
    setHospitalForm({
      name: hospital.name,
      images: hospital.images || [],
      address: hospital.address,
      city: hospital.city,
      state: hospital.state,
      pincode: hospital.pincode,
      departments: hospital.departments,
      facilities: hospital.facilities,
      contactEmail: hospital.contactEmail || "",
      contactPhone: hospital.contactPhone || "",
      availableDays: hospital.availableDays,
      fromTime: hospital.fromTime,
      toTime: hospital.toTime,
      feeRangeMin: hospital.feeRangeMin,
      feeRangeMax: hospital.feeRangeMax,
      commission: hospital.commission,
      isScanProvider: hospital.isScanProvider,
      treatmentTags: hospital.treatmentTags,
    })
    setShowModal(true)
  }

  const handleSaveHospital = async () => {
    try {
      setFormLoading(true)
      if (modalType === "create") {
        await apiService.createHospital(hospitalForm)
        setSuccess("Hospital created successfully!")
      } else {
        await apiService.updateHospital(selectedItem.id, hospitalForm)
        setSuccess("Hospital updated successfully!")
      }
      await loadData()
      setShowModal(false)
    } catch (error) {
      setError("Failed to save hospital")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteHospital = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return
    try {
      await apiService.deleteHospital(id)
      setSuccess("Hospital deleted successfully!")
      await loadData()
    } catch (error) {
      setError("Failed to delete hospital")
    }
  }

  // Doctor operations
  const handleCreateDoctor = () => {
    setModalType("create")
    setSelectedItem(null)
    setDoctorForm({
      name: "",
      imageUrl: "",
      gender: "",
      experienceYears: 0,
      qualifications: "",
      specialization: "",
      languagesSpoken: [],
      affiliatedHospitalId: 0,
      consultationFee: 0,
      availableDays: [],
      fromTime: "",
      toTime: "",
      contactPhone: "",
      contactEmail: "",
      commission: 0,
      treatmentTags: [],
    })
    setShowModal(true)
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setModalType("edit")
    setSelectedItem(doctor)
    setDoctorForm({
      name: doctor.name,
      imageUrl: doctor.imageUrl,
      gender: doctor.gender,
      experienceYears: doctor.experienceYears,
      qualifications: doctor.qualifications,
      specialization: doctor.specialization,
      languagesSpoken: doctor.languagesSpoken,
      affiliatedHospitalId: doctor.affiliatedHospitalId,
      consultationFee: doctor.consultationFee,
      availableDays: doctor.availableDays,
      fromTime: doctor.fromTime,
      toTime: doctor.toTime,
      contactPhone: doctor.contactPhone || "",
      contactEmail: doctor.contactEmail || "",
      commission: doctor.commission,
      treatmentTags: doctor.treatmentTags,
    })
    setShowModal(true)
  }

  const handleSaveDoctor = async () => {
    try {
      setFormLoading(true)
      if (modalType === "create") {
        await apiService.createDoctor(doctorForm)
        setSuccess("Doctor created successfully!")
      } else {
        await apiService.updateDoctor(selectedItem.id, doctorForm)
        setSuccess("Doctor updated successfully!")
      }
      await loadData()
      setShowModal(false)
    } catch (error) {
      setError("Failed to save doctor")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteDoctor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return
    try {
      await apiService.deleteDoctor(id)
      setSuccess("Doctor deleted successfully!")
      await loadData()
    } catch (error) {
      setError("Failed to delete doctor")
    }
  }

  // Filter data based on search
  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Helper functions
  const handleArrayInput = (value: string, field: string, isHospital = true) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item)

    if (isHospital) {
      setHospitalForm((prev) => ({ ...prev, [field]: items }))
    } else {
      setDoctorForm((prev) => ({ ...prev, [field]: items }))
    }
  }

  const handleCheckboxArray = (value: string, field: string, isHospital = true) => {
    const currentForm = isHospital ? hospitalForm : doctorForm
    const currentArray = currentForm[field as keyof typeof currentForm] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    if (isHospital) {
      setHospitalForm((prev) => ({ ...prev, [field]: newArray }))
    } else {
      setDoctorForm((prev) => ({ ...prev, [field]: newArray }))
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Mock stats
  const stats = {
    totalHospitals: hospitals.length,
    totalDoctors: doctors.length,
    totalConsultations: consultations.length,
    totalRevenue: consultations.reduce((sum, c) => sum + c.amountPaid, 0),
    recentConsultations: consultations.slice(0, 5),
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Hospital Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Manage hospitals, doctors, and consultations</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-2 mb-4 sm:mb-6 lg:mb-8">
          <div className="sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-full flex items-center justify-between py-3 px-4 text-left font-medium text-gray-900 bg-gray-50 rounded-lg"
            >
              <span className="flex items-center space-x-2">
                <span>
                  {activeTab === "hospitals" && "🏥"}
                  {activeTab === "doctors" && "👨‍⚕️"}
                  {activeTab === "bookings" && "📅"}
                  {activeTab === "stats" && "📊"}
                </span>
                <span>
                  {activeTab === "hospitals" && "Hospitals"}
                  {activeTab === "doctors" && "Doctors"}
                  {activeTab === "bookings" && "Bookings"}
                  {activeTab === "stats" && "Statistics"}
                </span>
              </span>
              <ChevronDown className={`w-5 h-5 transform transition-transform ${showMobileMenu ? "rotate-180" : ""}`} />
            </button>
            {showMobileMenu && (
              <div className="mt-2 space-y-1">
                {[
                  { key: "hospitals", label: "Hospitals", icon: "🏥" },
                  { key: "doctors", label: "Doctors", icon: "👨‍⚕️" },
                  { key: "bookings", label: "Bookings", icon: "📅" },
                  { key: "stats", label: "Statistics", icon: "📊" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as TabType)
                      setShowMobileMenu(false)
                      clearMessages()
                    }}
                    className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className="hidden sm:flex space-x-2">
            {[
              { key: "hospitals", label: "Hospitals", icon: "🏥" },
              { key: "doctors", label: "Doctors", icon: "👨‍⚕️" },
              { key: "bookings", label: "Bookings", icon: "📅" },
              { key: "stats", label: "Statistics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as TabType)
                  clearMessages()
                }}
                className={`flex items-center space-x-2 py-3 px-4 lg:px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button onClick={clearMessages} className="text-red-400 hover:text-red-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <UserCheck className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <div className="ml-auto pl-3">
                <button onClick={clearMessages} className="text-green-400 hover:text-green-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
              Dashboard Statistics
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hospitals</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHospitals}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Consultations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Consultations */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h3>
              <div className="space-y-4">
                {stats.recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.patientName}</p>
                      <p className="text-sm text-gray-600">Dr. {consultation.doctor?.name || "Unknown"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(consultation.amountPaid)}</p>
                      <p className="text-sm text-gray-600">{formatDate(consultation.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hospitals Tab */}
        {activeTab === "hospitals" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Hospitals</h2>
              <button
                onClick={handleCreateHospital}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Hospital</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Hospital Images */}
                  {hospital.images && hospital.images.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={hospital.images[0] || "/placeholder.svg"}
                        alt={hospital.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=400"
                        }}
                      />
                      {hospital.images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                          +{hospital.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>
                            {hospital.city}, {hospital.state}
                          </span>
                        </div>
                      </div>
                      <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-2">
                        {formatCurrency(hospital.feeRangeMin)} - {formatCurrency(hospital.feeRangeMax)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{hospital.contactPhone || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>
                          {hospital.fromTime} - {hospital.toTime}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{hospital.doctors?.length || 0} doctors</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {hospital.departments.slice(0, 3).map((dept, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {dept}
                        </span>
                      ))}
                      {hospital.departments.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{hospital.departments.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditHospital(hospital)}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHospital(hospital.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredHospitals.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
                <p className="text-sm sm:text-base text-gray-500 px-4">Create your first hospital to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Doctors</h2>
              <button
                onClick={handleCreateDoctor}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={doctor.imageUrl || "/placeholder.svg?height=60&width=60"}
                      alt={`Dr. ${doctor.name}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=60&width=60"
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Dr. {doctor.name}</h3>
                      <p className="text-blue-600 font-medium text-sm">{doctor.specialization}</p>
                      <p className="text-gray-600 text-xs">{doctor.qualifications}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {hospitals.find((h) => h.id === doctor.affiliatedHospitalId)?.name || "Unknown Hospital"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Star className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{doctor.experienceYears} years experience</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{doctor.contactPhone || "N/A"}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatCurrency(doctor.consultationFee)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.languagesSpoken.slice(0, 3).map((lang, index) => (
                      <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                    {doctor.languagesSpoken.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{doctor.languagesSpoken.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-sm sm:text-base text-gray-500 px-4">Create your first doctor to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Consultations</h2>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Mobile Cards View */}
              <div className="sm:hidden">
                {filteredConsultations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredConsultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{consultation.patientName}</h3>
                            <p className="text-sm text-gray-600">{consultation.phoneNumber}</p>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(consultation.createdAt)}</span>
                        </div>

                        <div className="mb-3">
                          <p className="font-medium text-gray-900">Dr. {consultation.doctor?.name || "Unknown"}</p>
                          <p className="text-sm text-gray-600">{consultation.hospital?.name || "Unknown Hospital"}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-green-600 font-medium">
                              {formatCurrency(consultation.amountPaid)}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                consultation.showContactInfo
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {consultation.showContactInfo ? "Confirmed" : "Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600 line-clamp-2">{consultation.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-2">No consultations found</h3>
                    <p className="text-sm text-gray-500">
                      Consultations will appear here when patients book appointments.
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hospital
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{consultation.patientName}</div>
                            <div className="text-sm text-gray-500">{consultation.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Dr. {consultation.doctor?.name || "Unknown"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{consultation.hospital?.name || "Unknown"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(consultation.amountPaid)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              consultation.showContactInfo
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {consultation.showContactInfo ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(consultation.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredConsultations.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
                    <p className="text-gray-500">Consultations will appear here when patients book appointments.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Hospital Modal */}
        {showModal && activeTab === "hospitals" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {modalType === "create" ? "Create Hospital" : "Edit Hospital"}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveHospital()
                }}
                className="p-4 sm:p-6 space-y-4 sm:space-y-6"
              >
                {/* Hospital Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Images</label>
                  <CloudinaryUpload
                    multiple={true}
                    currentImages={hospitalForm.images}
                    onUpload={(urls) => setHospitalForm((prev) => ({ ...prev, images: urls }))}
                    maxFiles={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Name *</label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.name}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter hospital name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={hospitalForm.contactPhone}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter contact phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.city}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.state}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, state: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={hospitalForm.pincode}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, pincode: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={hospitalForm.contactEmail}
                    onChange={(e) => setHospitalForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time *</label>
                    <input
                      type="time"
                      required
                      value={hospitalForm.fromTime}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, fromTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time *</label>
                    <input
                      type="time"
                      required
                      value={hospitalForm.toTime}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, toTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      value={hospitalForm.feeRangeMin}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, feeRangeMin: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter minimum fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      value={hospitalForm.feeRangeMax}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, feeRangeMax: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter maximum fee"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    value={hospitalForm.commission}
                    onChange={(e) => setHospitalForm((prev) => ({ ...prev, commission: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter commission percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={hospitalForm.availableDays.includes(day)}
                          onChange={() => handleCheckboxArray(day, "availableDays", true)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments (comma-separated)</label>
                  <input
                    type="text"
                    value={hospitalForm.departments.join(", ")}
                    onChange={(e) => handleArrayInput(e.target.value, "departments", true)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., Cardiology, Orthopedics, Neurology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facilities (comma-separated)</label>
                  <input
                    type="text"
                    value={hospitalForm.facilities.join(", ")}
                    onChange={(e) => handleArrayInput(e.target.value, "facilities", true)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., 24/7 Emergency, ICU, Pharmacy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={hospitalForm.treatmentTags.join(", ")}
                    onChange={(e) => handleArrayInput(e.target.value, "treatmentTags", true)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., Heart Surgery, Joint Replacement"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hospitalForm.isScanProvider}
                      onChange={(e) => setHospitalForm((prev) => ({ ...prev, isScanProvider: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Is Scan Provider</span>
                  </label>
                </div>

                <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{modalType === "create" ? "Creating..." : "Updating..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{modalType === "create" ? "Create Hospital" : "Update Hospital"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create/Edit Doctor Modal */}
        {showModal && activeTab === "doctors" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {modalType === "create" ? "Create Doctor" : "Edit Doctor"}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveDoctor()
                }}
                className="p-4 sm:p-6 space-y-4 sm:space-y-6"
              >
                {/* Doctor Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Image</label>
                  <CloudinaryUpload
                    multiple={false}
                    currentImages={doctorForm.imageUrl ? [doctorForm.imageUrl] : []}
                    onUpload={(urls) => setDoctorForm((prev) => ({ ...prev, imageUrl: urls[0] || "" }))}
                    maxFiles={1}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter doctor name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      required
                      value={doctorForm.gender}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, gender: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                    <input
                      type="text"
                      required
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, specialization: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="e.g., Cardiologist"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                    <input
                      type="number"
                      required
                      value={doctorForm.experienceYears}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter years of experience"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications *</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.qualifications}
                    onChange={(e) => setDoctorForm((prev) => ({ ...prev, qualifications: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., MBBS, MD (Cardiology)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affiliated Hospital *</label>
                  <select
                    required
                    value={doctorForm.affiliatedHospitalId}
                    onChange={(e) =>
                      setDoctorForm((prev) => ({ ...prev, affiliatedHospitalId: Number(e.target.value) }))
                    }
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value={0}>Select hospital</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={doctorForm.contactPhone}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter contact phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={doctorForm.contactEmail}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹) *</label>
                    <input
                      type="number"
                      required
                      value={doctorForm.consultationFee}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, consultationFee: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter consultation fee"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      required
                      value={doctorForm.fromTime}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, fromTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      required
                      value={doctorForm.toTime}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, toTime: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    value={doctorForm.commission}
                    onChange={(e) => setDoctorForm((prev) => ({ ...prev, commission: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Enter commission percentage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <label key={day} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={doctorForm.availableDays.includes(day)}
                          onChange={() => handleCheckboxArray(day, "availableDays", false)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={doctorForm.languagesSpoken.join(", ")}
                    onChange={(e) => handleArrayInput(e.target.value, "languagesSpoken", false)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., English, Hindi, Tamil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={doctorForm.treatmentTags.join(", ")}
                    onChange={(e) => handleArrayInput(e.target.value, "treatmentTags", false)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="e.g., Heart Disease, Hypertension"
                  />
                </div>

                <div className="sticky bottom-0 bg-white pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{modalType === "create" ? "Creating..." : "Updating..."}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{modalType === "create" ? "Create Doctor" : "Update Doctor"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
