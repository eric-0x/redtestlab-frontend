"use client"

import { useState, useEffect } from "react"

const BASE_URL = "https://redtestlab.com"

interface Application {
  id: number
  name: string
  email: string
  address: string
  jobProfile: string
  totalExperience: string
  currentOrganization: string
  currentDesignation: string
  noticePeriod: string
  cv: string
  careerId: number
  career: {
    id: number
    title: string
    location: string
  }
}

export default function AdminApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/career/apply`)
      const data = await response.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleDeleteApplication = async (id: number) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/career/apply/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchApplications()
        
        } else {
          alert("Error deleting application")
        }
      } catch (error) {
        console.error("Error deleting application:", error)
        alert("Error deleting application")
      }
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedApplication(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 text-lg font-medium">Loading applications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Job Applications</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
            <p className="text-gray-600">Manage and review job applications</p>
            <div className="mt-2 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {applications.length} Total Applications
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applicant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Current Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Notice Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-600">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{application.career?.title || "N/A"}</div>
                      <div className="text-sm text-gray-600">{application.career?.location || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{application.totalExperience}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.currentDesignation || "N/A"}</div>
                      <div className="text-sm text-gray-600">{application.currentOrganization || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {application.noticePeriod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleViewApplication(application)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteApplication(application.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{application.name}</h3>
                  <p className="text-sm text-gray-600">{application.email}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {application.noticePeriod}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Position:</span>
                  <span className="ml-2 text-gray-900">{application.career?.title || "N/A"}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="ml-2 text-gray-900">{application.totalExperience}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Current Role:</span>
                  <span className="ml-2 text-gray-900">{application.currentDesignation || "N/A"}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleViewApplication(application)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteApplication(application.id)}
                  className="flex-1 px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {applications.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">Applications will appear here when candidates apply for positions</p>
          </div>
        )}

        {/* Application Details Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">Application Details</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p className="text-gray-900 font-medium">{selectedApplication.name}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <p className="text-gray-900">{selectedApplication.email}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <p className="text-gray-900">{selectedApplication.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Profile</label>
                        <p className="text-gray-900 font-medium">{selectedApplication.jobProfile}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience</label>
                        <p className="text-gray-900">{selectedApplication.totalExperience}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Organization</label>
                        <p className="text-gray-900">{selectedApplication.currentOrganization || "Not specified"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Designation</label>
                        <p className="text-gray-900">{selectedApplication.currentDesignation || "Not specified"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {selectedApplication.noticePeriod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Applied Position</h3>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 text-lg">
                      {selectedApplication.career?.title || "Position not found"}
                    </h4>
                    <p className="text-blue-700 mt-1">
                      {selectedApplication.career?.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Resume/CV</h3>
                  {selectedApplication.cv ? (
                    <a
                      href={selectedApplication.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download CV
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">No CV uploaded</p>
                  )}
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
