"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X, Save, FolderOpen, Search, AlertCircle, CheckCircle2, Badge } from "lucide-react"

const API_URL = "https://redtestlab.com/api"

// Define types for our data
interface Category {
  id: number
  name: string
  badge: string | null
  type?: string
}

interface FormData {
  name: string
  badge: string
  type: string
}

interface Notification {
  show: boolean
  message: string
  type: string
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" })
  const [searchTerm, setSearchTerm] = useState("")

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    badge: "",
    type: "ALL",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/category`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      badge: "",
      type: "ALL",
    })
    setEditingCategory(null)
  }

  const handleEditClick = (category: Category) => {
    setFormData({
      name: category.name,
      badge: category.badge || "",
      type: category.type || "ALL",
    })
    setEditingCategory(category.id)
    setShowForm(true)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification("Category Name is required", "error")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const token = localStorage.getItem("adminToken")
    if (!token) {
      showNotification("Authentication required", "error")
      return
    }

    try {
      setIsLoading(true)
      const categoryData = {
        name: formData.name.trim(),
        badge: formData.badge.trim() || null,
        type: formData.type,
      }

      let url = `${API_URL}/category`
      let method = "POST"

      if (editingCategory) {
        url = `${API_URL}/category/${editingCategory}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Failed to ${editingCategory ? "update" : "create"} category (${response.status})`,
        )
      }

      await fetchCategories()
      resetForm()
      setShowForm(false)
      showNotification(`Category ${editingCategory ? "updated" : "created"} successfully`, "success")
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return

    const token = localStorage.getItem("adminToken")
    if (!token) {
      showNotification("Authentication required", "error")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete category")
      }

      await fetchCategories()
      showNotification("Category deleted successfully", "success")
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const filteredCategories = categories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.badge && category.badge.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Category Management</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">Create and manage product categories</p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex items-center justify-end gap-4">
            <div className="w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories or badges..."
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
              Add Category
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
                  <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h2>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="e.g., Blood Tests"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                    <input
                      type="text"
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                      placeholder="e.g., Rising Cases, New, Popular"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional badge to highlight this category</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type*</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    >
                      <option value="ALL">ALL</option>
                      <option value="WOMEN">WOMEN</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select the type of category</p>
                  </div>
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
                      <span>{editingCategory ? "Update Category" : "Save Category"}</span>
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
          {isLoading && !filteredCategories.length ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm sm:text-base">Loading categories...</p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <FolderOpen className="h-8 w-8 text-gray-400" />
                <p className="text-sm sm:text-base">No categories found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <div key={category.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{category.name}</h3>
                        {category.badge && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            <Badge className="h-3 w-3" />
                            {category.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Category ID: {category.id}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Edit category"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Delete category"
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
