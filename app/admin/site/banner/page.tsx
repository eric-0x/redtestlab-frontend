"use client"

import React, { useState, useEffect } from "react"
import { CloudinaryUpload } from "@/components/Cloudinary"
import { Edit, Trash2, Plus, X, Save, FolderOpen, Search, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react"

const API_URL = "https://redtestlab.com/api/banner"

interface Banner {
  id: number
  imageUrl: string[]
  createdAt: string
}

interface Notification {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" })
  const [searchTerm, setSearchTerm] = useState("")
  const [formImages, setFormImages] = useState<string[]>([])

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch banners")
      const data = await response.json()
      setBanners(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormImages([])
    setEditingBanner(null)
  }

  const handleEditClick = (banner: Banner) => {
    setFormImages(banner.imageUrl)
    setEditingBanner(banner)
    setShowForm(true)
  }

  const validateForm = () => {
    if (formImages.length === 0) {
      showNotification("At least one image is required", "error")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      setIsLoading(true)
      const method = editingBanner ? "PUT" : "POST"
      const url = editingBanner ? `${API_URL}/${editingBanner.id}` : API_URL
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: formImages }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Failed to ${editingBanner ? "update" : "create"} banner`)
      }
      await fetchBanners()
      resetForm()
      setShowForm(false)
      showNotification(`Banner ${editingBanner ? "updated" : "created"} successfully`, "success")
    } catch (err: any) {
      showNotification(err.message || "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete banner")
      await fetchBanners()
      showNotification("Banner deleted successfully", "success")
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

  const filteredBanners = banners
    .filter((banner) => banner.id === 1)
    .filter((banner) =>
      banner.imageUrl.some((url) => url.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Banner Management</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">Create and manage homepage banners</p>
            </div>
          </div>
          {/* Action Buttons and Search */}
          <div className="flex items-center justify-end gap-4">
            <div className="w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search banners by image URL..."
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
              className="w-[180px] flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Banner
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
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editingBanner ? "Edit Banner" : "Add Banner"}</h2>
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
                  <CloudinaryUpload
                    onUpload={setFormImages}
                    multiple
                    currentImages={formImages}
                    maxFiles={5}
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
                      <span>{editingBanner ? "Update Banner" : "Save Banner"}</span>
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
          {isLoading && !filteredBanners.length ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm sm:text-base">Loading banners...</p>
              </div>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm sm:text-base">No banners found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBanners.map((banner) => (
                <div key={banner.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex gap-2 flex-wrap">
                        {banner.imageUrl.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Banner ${banner.id} - ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/file.svg"; // or another valid image in your public/ directory
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">Banner ID: {banner.id}</div>
                      <div className="text-xs text-gray-400">Created: {new Date(banner.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(banner)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Edit banner"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Delete banner"
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