"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X, Save, Package, Search, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react"

const API_URL = "http://localhost:5000/api"

// Define types for our data
interface Product {
  id: number
  name: string
  reportTime: number | string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  category?: Category
  productType?: string
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: Array<{
    id: number
    packageId: number
    testId: number
    Product_ProductPackageLink_testIdToProduct?: Product
  }>
}

interface Category {
  id: number
  name: string
}

interface FormData {
  name: string
  reportTime: number
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number | string
  testIds: number[]
}

interface Parameter {
  key: string
  value: string
}

interface Notification {
  show: boolean
  message: string
  type: string
}

export default function PackageManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)
// parameters state removed

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    reportTime: 0,
    tags: "",
    actualPrice: 0,
    discountedPrice: 0,
    categoryId: "",
    testIds: [],
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchTests()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/product/type/packages`)
      if (!response.ok) throw new Error("Failed to fetch packages")
      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  // Fetch all tests for selection in the form
  const [allTests, setAllTests] = useState<Product[]>([])
  const [testSearch, setTestSearch] = useState("")
  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_URL}/product?type=TEST`)
      if (!response.ok) throw new Error("Failed to fetch tests")
      const data = await response.json()
      setAllTests(data)
    } catch (err: unknown) {
      // ignore for now
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/category`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "categoryId" ? Number.parseInt(value) || "" : value })
  }

  // Handle test selection (checkboxes)
  const handleTestSelect = (testId: number) => {
    setFormData((prev) => {
      const exists = prev.testIds.includes(testId)
      return {
        ...prev,
        testIds: exists ? prev.testIds.filter((id) => id !== testId) : [...prev.testIds, testId],
      }
    })
  }

// Removed handleParameterChange

// Removed addParameter

// Removed removeParameter

  const resetForm = () => {
    setFormData({
      name: "",
      reportTime: 0,
      tags: "",
      actualPrice: 0,
      discountedPrice: 0,
      categoryId: "",
      testIds: [],
    })
    setEditingProduct(null)
  }

  const handleEditClick = (product: any) => {
    // Get testIds from ProductPackageLink_ProductPackageLink_packageIdToProduct
    const testIds = (product.ProductPackageLink_ProductPackageLink_packageIdToProduct || []).map((link: any) => link.testId)
    setFormData({
      name: product.name,
      reportTime: Number(product.reportTime),
      tags: product.tags,
      actualPrice: product.actualPrice,
      discountedPrice: product.discountedPrice,
      categoryId: product.categoryId,
      testIds,
    })
    setEditingProduct(product.id)
    setShowForm(true)
  }

  const validateForm = () => {
    if (!formData.name || !formData.categoryId) {
      showNotification("Name and Category are required", "error")
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

      const productData = {
        ...formData,
        reportTime: Number.parseInt(formData.reportTime.toString()),
        actualPrice: Number.parseFloat(formData.actualPrice.toString()),
        discountedPrice: Number.parseFloat(formData.discountedPrice.toString()),
        productType: "PACKAGE",
      }

      let url = `${API_URL}/product`
      let method = "POST"

      if (editingProduct) {
        url = `${API_URL}/product/${editingProduct}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Failed to ${editingProduct ? "update" : "create"} product (${response.status})`,
        )
      }

      await fetchProducts()
      resetForm()
      setShowForm(false)
      showNotification(`Package ${editingProduct ? "updated" : "created"} successfully`, "success")
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return

    const token = localStorage.getItem("adminToken")
    if (!token) {
      showNotification("Authentication required", "error")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete package")
      }

      await fetchProducts()
      showNotification("Package deleted successfully", "success")
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

// formatParameters removed

  const filteredProducts = products.filter((product) => {
    const searchFields = [product.name, product.tags, product.category?.name || ""]
    return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Package Management</h1>
              <p className="mt-1 text-gray-500">Create and manage your service packages</p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-[50%]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages..."
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
              className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-500 ease-in-out transform ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProduct ? "Edit Package" : "Add Package"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Package name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Time (minutes)</label>
                      <input
                        type="number"
                        name="reportTime"
                        value={formData.reportTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price</label>
                      <input
                        type="number"
                        name="actualPrice"
                        value={formData.actualPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
                      <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Test selection with search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Tests</label>
                    <input
                      type="text"
                      value={testSearch}
                      onChange={e => setTestSearch(e.target.value)}
                      placeholder="Search tests..."
                      className="mb-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                      {allTests
                        .filter(test => test.productType === "TEST" && test.name.toLowerCase().includes(testSearch.toLowerCase()))
                        .map((test) => (
                          <label key={test.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.testIds.includes(test.id)}
                              onChange={() => handleTestSelect(test.id)}
                            />
                            <span className="text-gray-700">{test.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingProduct ? "Update Package" : "Save Package"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading && !filteredProducts.length ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p>Loading packages...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Package className="h-8 w-8 text-gray-400" />
                <p>No packages found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="text-gray-500">Category: {product.category?.name || "N/A"}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-gray-900">₹{product.discountedPrice}</div>
                      {product.discountedPrice < product.actualPrice && (
                        <div className="text-sm line-through text-gray-500">₹{product.actualPrice}</div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-blue-50 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(product.id)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform ${expandedId === product.id ? "rotate-180" : ""}`}
                    />
                    {expandedId === product.id ? "Show Less" : "View Details"}
                  </button>

                  {expandedId === product.id && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Report Time</h4>
                          <p className="text-gray-600">{product.reportTime} minutes</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Tests</h4>
                          <div className="mt-2 space-y-1">
                            {(product.ProductPackageLink_ProductPackageLink_packageIdToProduct ?? []).length === 0 ? (
                              <span className="text-gray-500">No tests linked</span>
                            ) : (
                              (product.ProductPackageLink_ProductPackageLink_packageIdToProduct ?? []).map((link) => (
                                <div key={link.testId} className="text-sm">
                                  <span className="font-medium text-gray-700">{link.Product_ProductPackageLink_testIdToProduct?.name || "Test"}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
