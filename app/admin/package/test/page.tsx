"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X, Save, Package, Search, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react"

const API_URL = "https://redtestlab.com/api"

// Define types for our data
interface Parameter {
  id?: number
  name: string
  unit: string
  referenceRange: string
  productId?: number
}

interface Product {
  id: number
  name: string
  reportTime: number
  parameters?: Parameter[]
  Parameter?: Parameter[]
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  description?: string
  category?: Category
  productType: string
  childLinks?: {
    childTest: Product
  }[]
}

interface ParameterProduct {
  id: number
  name: string
  actualPrice: number
  productType: string
  Parameter?: Parameter[]
}

interface Category {
  id: number
  name: string
}

interface FormData {
  name: string
  reportTime: number
  tags: string
  actualPrice: string
  discountedPrice: string
  categoryId: number | string
  description?: string
  productType: string
  parameterIds: number[]
}

interface Notification {
  show: boolean
  message: string
  type: string
}

export default function TestManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [availableParameters, setAvailableParameters] = useState<ParameterProduct[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<number | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    reportTime: 0,
    tags: "",
    actualPrice: "",
    discountedPrice: "",
    categoryId: "",
    description: "",
    productType: "TEST",
    parameterIds: [],
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchParameters()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/product/type/tests`)

      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
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

  const fetchParameters = async () => {
    try {
      const response = await fetch(`${API_URL}/product/type/parameters`)
      if (!response.ok) throw new Error("Failed to fetch parameters")
      const data = await response.json()
      setAvailableParameters(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "categoryId" ? Number.parseInt(value) || "" : value })
  }

  const handleParameterSelection = (parameterId: number, isSelected: boolean) => {
    let updatedParameterIds: number[]
    
    if (isSelected) {
      updatedParameterIds = [...formData.parameterIds, parameterId]
    } else {
      updatedParameterIds = formData.parameterIds.filter(id => id !== parameterId)
    }
    
    setFormData({
      ...formData,
      parameterIds: updatedParameterIds,
      actualPrice: calculateTotalPrice(updatedParameterIds).toString()
    })
  }

  const calculateTotalPrice = (parameterIds: number[]): number => {
    return parameterIds.reduce((total, id) => {
      const parameter = availableParameters.find(p => p.id === id)
      return total + (parameter?.actualPrice || 0)
    }, 0)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      reportTime: 0,
      tags: "",
      actualPrice: "",
      discountedPrice: "",
      categoryId: "",
      description: "",
      productType: "TEST",
      parameterIds: [],
    })
    setEditingProduct(null)
  }

  const handleEditClick = (product: Product) => {
    // Extract parameter IDs from the test's linked parameters
    const parameterIds = product.childLinks?.map(link => link.childTest.id) || []
    
    setFormData({
      name: product.name,
      reportTime: product.reportTime,
      tags: product.tags,
      actualPrice: product.actualPrice.toString(),
      discountedPrice: product.discountedPrice.toString(),
      categoryId: product.categoryId,
      description: product.description || "",
      productType: "TEST",
      parameterIds: parameterIds,
    })
    setEditingProduct(product.id)
    setShowForm(true)
  }

  const validateForm = () => {
    if (!formData.name || !formData.categoryId) {
      showNotification("Test Name and Category are required", "error")
      return false
    }

    if (formData.parameterIds.length === 0) {
      showNotification("At least one parameter must be selected", "error")
      return false
    }

    if (!formData.discountedPrice || parseFloat(formData.discountedPrice) <= 0) {
      showNotification("Discounted Price is required and must be greater than 0", "error")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsLoading(true)

      const productData = {
        name: formData.name,
        categoryId: formData.categoryId,
        actualPrice: formData.actualPrice,
        discountedPrice: formData.discountedPrice,
        reportTime: formData.reportTime.toString(),
        tags: formData.tags,
        productType: "TEST",
        parameterIds: formData.parameterIds,
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
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || `Failed to ${editingProduct ? "update" : "create"} test (${response.status})`,
        )
      }

      await fetchProducts()
      resetForm()
      setShowForm(false)
      showNotification(`Test ${editingProduct ? "updated" : "created"} successfully`, "success")
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete test")
      }

      await fetchProducts()
      showNotification("Test deleted successfully", "success")
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

  const formatParameters = (childLinks: { childTest: Product }[] | undefined) => {
    if (!childLinks || childLinks.length === 0) {
      return <span className="text-gray-500">No parameters</span>
    }

    return childLinks.map((link, index) => (
      <div key={index} className="text-sm">
        <span className="font-medium text-gray-700">{link.childTest.name}</span>
        <span className="text-gray-500 ml-2">₹{link.childTest.actualPrice}</span>
      </div>
    ))
  }

  const filteredProducts = products.filter((product) => {
    const parametersText = (product.childLinks || [])
      .map(link => link.childTest.name)
      .join(" ")
    
    const searchFields = [product.name, product.tags, product.category?.name || "", parametersText]
    return searchFields.some((field) => field && field.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    )
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
              <h1 className="text-4xl font-bold text-gray-900">Test Management</h1>
              <p className="mt-1 text-gray-500">Create and manage your medical tests</p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-[50%]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
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
              Add Test
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
                  <h2 className="text-2xl font-bold text-gray-800">{editingProduct ? "Edit Test" : "Add Test"}</h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Diabetes Panel"
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
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Report Time (hours)</label>
                      <input
                        type="number"
                        name="reportTime"
                        value={formData.reportTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        placeholder="e.g., 24"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price*</label>
                      <input
                        type="number"
                        name="discountedPrice"
                        value={formData.discountedPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 599"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., diabetes, blood sugar, health checkup"
                    />
                  </div>

                  {/* Parameter Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Parameters*</label>
                    <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
                      {availableParameters.length === 0 ? (
                        <div className="text-gray-400 text-sm">No parameters available. Please create parameters first.</div>
                      ) : (
                        availableParameters.map((parameter) => (
                          <div key={parameter.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`param-${parameter.id}`}
                                checked={formData.parameterIds.includes(parameter.id)}
                                onChange={(e) => handleParameterSelection(parameter.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`param-${parameter.id}`} className="ml-3 text-sm font-medium text-gray-700">
                                {parameter.Parameter && parameter.Parameter.length > 0
                                  ? parameter.Parameter.map(p => p.name).join(", ")
                                  : parameter.name}
                              </label>
                            </div>
                            <span className="text-sm text-gray-500">₹{parameter.actualPrice}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {formData.parameterIds.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-blue-800">
                            Selected Parameters: {formData.parameterIds.length}
                          </span>
                          <span className="text-sm font-bold text-blue-800">
                            Actual Price: ₹{calculateTotalPrice(formData.parameterIds)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="hidden">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price (Auto-calculated)</label>
                    <input
                      type="text"
                      name="actualPrice"
                      value={formData.actualPrice}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {editingProduct ? "Update Test" : "Create Test"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tests Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No tests found</p>
                      <p className="text-sm">
                        {searchTerm ? "Try adjusting your search criteria" : "Create your first test to get started"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                          {product.tags && (
                            <div className="text-xs text-blue-600 mt-1">
                              {product.tags.split(',').map((tag, index) => (
                                <span key={index} className="inline-block bg-blue-100 px-2 py-1 rounded mr-1">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.category?.name || "No Category"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-500 line-through">₹{product.actualPrice}</div>
                          <div className="font-medium text-green-600">₹{product.discountedPrice}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {formatParameters(product.childLinks)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.reportTime} hours</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-blue-50 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                          
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                         
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Total Tests: {filteredProducts.length}</span>
            </div>
            <div className="text-sm text-blue-600">
              Showing {filteredProducts.length} of {products.length} tests
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
