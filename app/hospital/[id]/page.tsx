"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Building2,
  Calendar,
  Award,
  Languages,
  CheckCircle,
  Shield,
  Users,
  Heart,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { apiService, type Hospital, type Doctor } from "../api"
import FullyResponsiveBookingModal from "../booking-modal"

export default function MobileOptimizedHospitalDetail() {
  const params = useParams()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        const [hospitalData, doctorsData] = await Promise.all([
          apiService.getHospital(Number.parseInt(params.id as string)),
          apiService.getDoctors(),
        ])
        setHospital(hospitalData)
        // Filter doctors for this hospital
        const hospitalDoctors = doctorsData.filter(
          (doctor) => doctor.affiliatedHospitalId === Number.parseInt(params.id as string),
        )
        setDoctors(hospitalDoctors)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch hospital data")
      } finally {
        setLoading(false)
      }
    }

    fetchHospitalData()
  }, [params.id])

  const handleBookConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    // Check if user is logged in
    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert("Please login to book a consultation")
      return
    }
    // Show booking modal directly
    setShowBookingModal(true)
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
    setSelectedDoctor(null)
  }

  const nextImage = () => {
    if (hospital?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % hospital.images.length)
    }
  }

  const prevImage = () => {
    if (hospital?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + hospital.images.length) % hospital.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading hospital details...</p>
        </div>
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl text-center max-w-sm sm:max-w-md w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">Hospital not found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
            {error || "The hospital you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.push("/hospitals")}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Go back to hospitals
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Enhanced Fixed Header - Fully Mobile Responsive */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
            <button
              onClick={() => router.push("/hospitals")}
              className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium text-sm sm:text-base">Back to Hospitals</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                <Star className="w-3 h-3 fill-current text-yellow-500" />
                <span className="font-medium">4.8</span>
              </div>
              {hospital.isScanProvider && (
                <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span className="hidden sm:inline">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-12 sm:pt-14 lg:pt-16">
        {/* Hero Section - Fully Mobile Responsive */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
            <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-start">
              {/* Image Gallery - Mobile First */}
              <div className="lg:col-span-3 order-1 lg:order-1">
                <div className="relative group">
                  <div className="aspect-[4/3] rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md sm:shadow-lg lg:shadow-2xl">
                    <img
                      src={hospital.images?.[currentImageIndex] || "/placeholder.svg?height=600&width=800"}
                      alt={`${hospital.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Image Navigation */}
                    {hospital.images && hospital.images.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                    {/* Rating Badge */}
                    <div className="absolute top-2 sm:top-3 lg:top-6 right-2 sm:right-3 lg:right-6 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 shadow-lg">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Star className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-800 text-xs sm:text-sm lg:text-lg">4.8</span>
                        <span className="text-gray-600 text-xs sm:text-sm lg:text-base hidden sm:inline">(1,234)</span>
                      </div>
                    </div>
                  </div>
                  {/* Image Indicators */}
                  {hospital.images && hospital.images.length > 1 && (
                    <div className="flex justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 lg:mt-4">
                      {hospital.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-blue-600" : "bg-gray-300"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Information - Mobile Responsive */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6 order-2 lg:order-2">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
                    {hospital.name}
                  </h1>
                  <div className="flex items-start gap-2 sm:gap-3 text-gray-600 mb-3 sm:mb-4 lg:mb-6">
                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mt-0.5 sm:mt-1 text-blue-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base leading-relaxed">
                      {hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}
                    </span>
                  </div>
                </div>

                {/* Quick Stats Cards - Mobile Responsive */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-center border border-blue-200">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">
                      {hospital.departments.length}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">Departments</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 sm:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-center border border-emerald-200">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-emerald-600 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-700">{doctors.length}</div>
                    <div className="text-xs sm:text-sm text-emerald-600 font-medium">Doctors</div>
                  </div>
                </div>

                {/* Fee Range - Mobile Responsive */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Consultation Fee Range</h3>
                  <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-1">
                    ₹{hospital.feeRangeMin.toLocaleString()} - ₹{hospital.feeRangeMax.toLocaleString()}
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm">Varies by department and specialization</p>
                </div>

                {/* Contact Information - Mobile Responsive */}
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 mb-3 sm:mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Operating Hours</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {hospital.fromTime} - {hospital.toTime}
                        </div>
                      </div>
                    </div>
                    {hospital.contactPhone && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Phone</div>
                          <div className="text-xs sm:text-sm text-gray-600">{hospital.contactPhone}</div>
                        </div>
                      </div>
                    )}
                    {hospital.contactEmail && (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Email</div>
                          <div className="text-xs sm:text-sm text-gray-600 break-all">{hospital.contactEmail}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base">Available Days</div>
                        <div className="text-xs sm:text-sm text-gray-600">{hospital.availableDays.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments and Facilities - Mobile Responsive */}
        <section className="py-6 sm:py-8 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
              {/* Departments */}
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                    Medical Departments
                  </h2>
                </div>
                <div className="grid gap-2 sm:gap-3">
                  {hospital.departments.map((dept, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md sm:rounded-lg lg:rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-sm sm:rounded-md lg:rounded-lg flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800 text-xs sm:text-sm lg:text-base">{dept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6 xl:p-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                    Facilities & Services
                  </h2>
                </div>
                <div className="grid gap-2 sm:gap-3">
                  {hospital.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-emerald-50 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-200"
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Section - Fully Mobile Responsive */}
        <section className="py-6 sm:py-8 lg:py-16 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4">
                Our Expert Medical Team
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Meet our experienced medical professionals dedicated to providing exceptional healthcare
              </p>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Doctors Available</h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  Please check back later or contact the hospital directly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-40 sm:h-48 lg:h-56 xl:h-64 overflow-hidden">
                      <img
                        src={doctor.imageUrl || "/placeholder.svg?height=400&width=400"}
                        alt={`Dr. ${doctor.name}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 shadow-lg">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 fill-current" />
                          <span className="text-xs sm:text-sm font-bold text-gray-800">4.9</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-6">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-blue-600 font-semibold text-xs sm:text-sm lg:text-base">
                          {doctor.specialization}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">{doctor.qualifications}</p>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mb-3 sm:mb-4 lg:mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Award className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{doctor.experienceYears} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Languages className="w-3 sm:w-4 h-3 sm:h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{doctor.languagesSpoken.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {doctor.fromTime} - {doctor.toTime}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-3 sm:pt-4">
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <div>
                            <span className="text-xs sm:text-sm text-gray-500">Consultation Fee</span>
                            <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                              ₹{doctor.consultationFee.toLocaleString()}
                            </div>
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                          </div>
                        </div>
                        <button
                          onClick={() => handleBookConsultation(doctor)}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg lg:rounded-xl transition-all duration-300 text-xs sm:text-sm lg:text-base"
                        >
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && hospital && (
        <FullyResponsiveBookingModal doctor={selectedDoctor} hospital={hospital} onClose={handleCloseBookingModal} />
      )}
    </div>
  )
}
