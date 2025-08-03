"use client"

import React, { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X, Save, Search, AlertCircle, CheckCircle2, User } from "lucide-react"
import { CloudinaryUpload } from "@/components/Cloudinary"

const API_URL = "https://redtestlab.com/api/testimonial"

interface Testimonial {
  id: number
  name: string
  specialization: string
  location: string
  note: string
  profileUrl: string
  createdAt: string
  updatedAt: string
}

interface Notification {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" })
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    location: "",
    note: "",
    profileUrl: ""
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch testimonials")
      const data = await response.json()
      setTestimonials(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      specialization: "",
      location: "",
      note: "",
      profileUrl: ""
    })
    setEditingTestimonial(null)
  }

  const handleEditClick = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      specialization: testimonial.specialization,
      location: testimonial.location,
      note: testimonial.note,
      profileUrl: testimonial.profileUrl
    })
    setEditingTestimonial(testimonial)
    setShowForm(true)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification("Name is required", "error")
      return false
    }
    if (!formData.specialization.trim()) {
      showNotification("Specialization is required", "error")
      return false
    }
    if (!formData.location.trim()) {
      showNotification("Location is required", "error")
      return false
    }
    if (!formData.note.trim()) {
      showNotification("Note is required", "error")
      return false
    }
    if (!formData.profileUrl.trim()) {
      showNotification("Profile image URL is required", "error")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      setIsLoading(true)
      const method = editingTestimonial ? "PUT" : "POST"
      const url = editingTestimonial ? `${API_URL}/${editingTestimonial.id}` : API_URL
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Failed to ${editingTestimonial ? "update" : "create"} testimonial`)
      }
      await fetchTestimonials()
      resetForm()
      setShowForm(false)
      showNotification(`Testimonial ${editingTestimonial ? "updated" : "created"} successfully`, "success")
    } catch (err: any) {
      showNotification(err.message || "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete testimonial")
      await fetchTestimonials()
      showNotification("Testimonial deleted successfully", "success")
    } catch (err: any) {
      showNotification(err.message || "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" })
    }, 3000)
  }

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Testimonial Management</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">Create and manage testimonials</p>
            </div>
          </div>
          {/* Action Buttons and Search */}
          <div className="flex items-center justify-end gap-4">
            <div className="w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className="w-[195px] flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Testimonial
            </button>
          </div>
        </div>
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto sm:mx-0 transition-all duration-500 ease-in-out transform ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
              )}
              <p className="text-sm sm:text-base">{notification.message}</p>
            </div>
          </div>
        )}
        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="text-gray-600 hover:text-gray-900 p-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="Specialization"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Testimonial note"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <CloudinaryUpload
                    onUpload={(urls) => {
                      setFormData({ ...formData, profileUrl: urls[0] || "" })
                    }}
                    multiple={false}
                    currentImages={formData.profileUrl ? [formData.profileUrl] : []}
                    maxFiles={1}
                  />
                  <input
                    type="text"
                    value={formData.profileUrl}
                    onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                    placeholder="Paste image URL or upload above"
                    className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingTestimonial ? "Update Testimonial" : "Save Testimonial"}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading && !filteredTestimonials.length ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm sm:text-base">Loading testimonials...</p>
              </div>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <User className="h-8 w-8 text-gray-400" />
                <p className="text-sm sm:text-base">No testimonials found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTestimonials.map((t) => (
                <div key={t.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex gap-4 items-center">
                        <img
                          src={t.profileUrl}
                          alt={t.name}
                          className="w-16 h-16 object-cover rounded-full border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/file.svg"
                          }}
                        />
                        <div>
                          <div className="font-bold text-lg text-gray-900">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.specialization} &bull; {t.location}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-gray-700 text-base">{t.note}</div>
                      <div className="text-xs text-gray-400 mt-2">Created: {new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Edit testimonial"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Delete testimonial"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}