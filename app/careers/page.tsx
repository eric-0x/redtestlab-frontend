"use client"

import type React from "react"

import { useState, useEffect } from "react"

const BASE_URL = "https://redtestlab.com"

interface Career {
  id: number
  title: string
  location: string
  experience: string
  vacancy: number
  employmentType: string
  jobDescription: string
  jobResponsibilities: string
  skillsRequired: string
}

export default function UserCareerPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    jobProfile: "",
    totalExperience: "",
    currentOrganization: "",
    currentDesignation: "",
    noticePeriod: "",
    cv: "",
  })

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/career`)
      const data = await response.json()
      setCareers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching careers:", error)
      setCareers([])
    } finally {
      setLoading(false)
    }
  }

  const handleApply = (career: Career) => {
    setSelectedCareer(career)
    setIsApplyModalOpen(true)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "E-Rickshaw") // Replace with your Cloudinary upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dm8jxispy/auto/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("document")) {
        const url = await handleFileUpload(file)
        if (url) {
          setFormData({ ...formData, cv: url })
        }
      } else {
        alert("Please upload a PDF or document file")
      }
    }
  }

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCareer) return

    setSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/api/career/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          careerId: selectedCareer.id,
        }),
      })

      if (response.ok) {
     
        setIsApplyModalOpen(false)
        resetForm()
      } else {
        alert("Error submitting application. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error submitting application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      jobProfile: "",
      totalExperience: "",
      currentOrganization: "",
      currentDesignation: "",
      noticePeriod: "",
      cv: "",
    })
    setSelectedCareer(null)
  }

  const closeModal = () => {
    setIsApplyModalOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 text-lg font-medium">Loading opportunities...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">Life @ Our Company</h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Join our mission to transform healthcare and make a difference in people's lives
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-12 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl lg:text-3xl font-bold text-blue-200">500+</div>
                <div className="text-blue-100 mt-1">Team Members</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl lg:text-3xl font-bold text-blue-200">50+</div>
                <div className="text-blue-100 mt-1">Countries</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-2xl lg:text-3xl font-bold text-blue-200">10M+</div>
                <div className="text-blue-100 mt-1">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Opportunities @ Our Company</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover exciting career opportunities and be part of a team that's revolutionizing healthcare technology
          </p>
        </div>

        {/* Current Openings */}
        <div className="mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-6">Current Openings</h3>

          {careers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No current openings available</h3>
              <p className="text-gray-500">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                        <h4 className="text-xl lg:text-2xl font-semibold text-blue-900">{career.title}</h4>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium w-fit">
                          {career.employmentType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          <span>{career.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{career.experience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>
                            {career.vacancy} {career.vacancy === 1 ? "position" : "positions"}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">{career.jobDescription}</p>

                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Key Skills:</h5>
                        <div className="flex flex-wrap gap-2">
                          {career.skillsRequired
                            .split(",")
                            .slice(0, 5)
                            .map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {skill.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleApply(career)}
                        className="w-full lg:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && selectedCareer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Apply for Position</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedCareer.title} - {selectedCareer.location}
                  </p>
                </div>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Profile *</label>
                    <input
                      type="text"
                      value={formData.jobProfile}
                      onChange={(e) => setFormData({ ...formData, jobProfile: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Experience *</label>
                    <input
                      type="text"
                      value={formData.totalExperience}
                      onChange={(e) => setFormData({ ...formData, totalExperience: e.target.value })}
                      placeholder="e.g., 3 years"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Organization</label>
                    <input
                      type="text"
                      value={formData.currentOrganization}
                      onChange={(e) => setFormData({ ...formData, currentOrganization: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Current company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Designation</label>
                    <input
                      type="text"
                      value={formData.currentDesignation}
                      onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Current job title"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notice Period *</label>
                  <select
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Notice Period</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 days">15 days</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resume/CV *</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          ) : (
                            <>
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {formData.cv && (
                      <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-green-800">CV uploaded successfully!</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading || !formData.cv}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
