"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  CalendarDays,
  Clock,
  Phone,
  Mail,
  FileText,
  User,
  Award,
  Stethoscope,
  Star,
  MapPin,
  CheckCircle,
  X,
} from "lucide-react"

export interface Doctor {
  id: number
  name: string
  imageUrl: string
  experienceYears: number
  specialization: string
  doctorType: string
  createdAt: string
}

export interface Consultation {
  id: number
  doctorId: number
  patientName: string
  email: string
  phoneNumber: string
  appointmentDate: string
  appointmentTime: string
  requirement: string
  createdAt: string
  doctor: Doctor
}

export interface ConsultationFormData {
  doctorId: number
  patientName: string
  email: string
  phoneNumber: string
  appointmentDate: string
  appointmentTime: string
  requirement: string
}

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}


export default function TopDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ConsultationFormData>({
    doctorId: 0,
    patientName: "",
    email: "",
    phoneNumber: "",
    appointmentDate: "",
    appointmentTime: "",
    requirement: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://redtestlab.com/api/doctor")
      if (!response.ok) {
        throw new Error("Failed to fetch doctors")
      }
      const data = await response.json()
      setDoctors(data)
      setError(null)
    } catch (err) {
      setError("Failed to load doctors. Please try again later.")
      console.error("Error fetching doctors:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      ...formData,
      doctorId: doctor.id,
    })
    setShowModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(null)

    try {
      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        throw new Error("Authentication required. Please log in.")
      }

      const response = await fetch("https://redtestlab.com/api/doctor/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to book consultation")
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setShowModal(false)
        setFormData({
          doctorId: 0,
          patientName: "",
          email: "",
          phoneNumber: "",
          appointmentDate: "",
          appointmentTime: "",
          requirement: "",
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to book consultation. Please try again.")
      console.error("Error booking consultation:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSubmitSuccess(false)
    setSubmitError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <div className="bg-white/80 backdrop-blur-lg border border-red-200 text-red-700 px-6 py-4 md:px-8 md:py-6 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center mr-3 md:mr-4">
              <X className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base md:text-lg">Connection Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchDoctors}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section - More compact on mobile */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30"></div>
        <div className="relative container mx-auto px-4 py-8 md:py-16 lg:py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Meet Our
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Expert{" "}
              </span>
              Doctors
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-blue-100 mb-6 md:mb-8 leading-relaxed px-4">
              Book consultations with world-class healthcare professionals who care about your wellbeing
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-8 text-blue-100">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 mr-2" />
                <span className="text-sm md:text-lg">24/7 Available</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 mr-2" />
                <span className="text-sm md:text-lg">Verified Experts</span>
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400 mr-2" />
                <span className="text-sm md:text-lg">Instant Booking</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 md:h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Doctors Grid */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Top Specialists
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Choose from our carefully selected team of medical professionals, each bringing years of expertise and
            dedication to your care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="group relative bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Doctor Image */}
              <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden rounded-t-2xl md:rounded-t-3xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                {doctor.imageUrl && doctor.imageUrl !== "https://example.com/images/dr-alice.jpg" ? (
                  <img
                    src={doctor.imageUrl || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center justify-center">
                    <User size={60} className="text-white/80 mb-3" />
                    <p className="text-white/90 font-medium text-sm">Professional Photo</p>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1 flex items-center z-20">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-xs md:text-sm font-semibold text-gray-800">4.9</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="relative p-4 md:p-6 z-10">
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                    {doctor.name}
                  </h3>

                  <div className="flex items-center text-blue-600 mb-2 md:mb-3">
                    <Stethoscope size={14} className="mr-2 flex-shrink-0 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-medium line-clamp-1">{doctor.specialization}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-2 md:mb-3">
                    <Award size={14} className="mr-2 flex-shrink-0 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">
                      {doctor.experienceYears} Years • {doctor.doctorType}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 mb-3 md:mb-4">
                    <MapPin size={14} className="mr-2 flex-shrink-0 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">Available Online</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookConsultation(doctor)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 md:py-3 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-blue-500/25 text-sm md:text-base"
                >
                  <span className="flex items-center justify-center">
                    <CalendarDays size={16} className="mr-2 md:w-5 md:h-5" />
                    Book Consultation
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Booking Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border border-white/50">
            <div className="p-4 md:p-6 lg:p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6 md:mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                    Book Your Consultation
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">Schedule your appointment with our expert</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Doctor Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-blue-100">
                <div className="flex items-center">
                  <div className="relative">
                    {selectedDoctor.imageUrl &&
                    selectedDoctor.imageUrl !== "https://example.com/images/dr-alice.jpg" ? (
                      <img
                        src={selectedDoctor.imageUrl || "/placeholder.svg"}
                        alt={selectedDoctor.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                        <User size={24} className="text-white md:w-8 md:h-8" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4 md:ml-6">
                    <h4 className="text-lg md:text-xl font-bold text-gray-800">{selectedDoctor.name}</h4>
                    <p className="text-blue-600 font-medium text-sm md:text-base">{selectedDoctor.specialization}</p>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {selectedDoctor.experienceYears} years experience • {selectedDoctor.doctorType}
                    </p>
                  </div>
                </div>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                    Consultation Booked Successfully!
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 px-4">
                    We've received your booking request. Our team will contact you within 24 hours with confirmation
                    details and payment instructions.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 text-left">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">What's Next?</h4>
                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                      <li>• You'll receive a confirmation email shortly</li>
                      <li>• Our team will call you to confirm the appointment</li>
                      <li>• Payment link will be shared via email/SMS</li>
                      <li>• Video call link will be provided before the session</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 md:px-6 py-3 md:py-4 rounded-xl">
                      <div className="flex items-center">
                        <X className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        <p className="font-medium text-sm md:text-base">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="patientName">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                          <User size={16} className="text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="text"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                          <Phone size={16} className="text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="appointmentDate">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                          <CalendarDays size={16} className="text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="date"
                          id="appointmentDate"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="appointmentTime">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                          <Clock size={16} className="text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="time"
                          id="appointmentTime"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                          className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="requirement">
                      Reason for Consultation *
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 md:top-4 left-3 md:left-4 pointer-events-none">
                        <FileText size={16} className="text-gray-400 md:w-5 md:h-5" />
                      </div>
                      <textarea
                        id="requirement"
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleInputChange}
                        className="pl-10 md:pl-12 w-full border border-gray-200 rounded-xl py-3 md:py-4 px-3 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm md:text-base"
                        rows={4}
                        placeholder="Please describe your symptoms, concerns, or reason for consultation in detail..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 md:mr-3"></div>
                        Processing Your Request...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CalendarDays size={18} className="mr-2 md:w-5 md:h-5" />
                        Confirm Booking
                      </span>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By booking this consultation, you agree to our terms of service and privacy policy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
