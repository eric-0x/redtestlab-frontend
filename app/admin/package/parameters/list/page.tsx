"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Edit, Trash2, Search, AlertCircle, CheckCircle2, Package } from "lucide-react"

const API_URL = "http://localhost:5000/api"

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
  actualPrice: number
  productType: string
  Parameter?: Parameter[]
}

interface Notification {
  show: boolean
  message: string
  type: string
}

export default function ParameterList() {
  const [parameters, setParameters] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchParameters()
  }, [])

  const fetchParameters = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/product/type/parameters`)

      if (!response.ok) throw new Error("Failed to fetch parameters")

      const data = await response.json()
      setParameters(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteParameter = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this parameter?")) return

    try {
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete parameter")
      }

      setParameters(parameters.filter((param) => param.id !== id))
      showNotification("Parameter deleted successfully", "success")
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : "Failed to delete parameter", "error")
    }
  }

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const filteredParameters = parameters.filter((param) =>
    param.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
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
    <div className="max-w-7xl mx-auto">
      {/* Notification */}
      {notification.show && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            notification.type === "success"
              ? "bg-green-50 border-green-300 text-green-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parameter Management</h1>
        <p className="text-gray-600">View and manage all parameters in the system</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Parameters Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Parameters
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParameters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No parameters found</p>
                    <p className="text-sm">
                      {searchTerm ? "Try adjusting your search criteria" : "Create your first parameter to get started"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredParameters.map((param) => (
                  <tr key={param.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{param.name}</div>
                          <div className="text-sm text-gray-500">ID: {param.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{param.actualPrice}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {param.Parameter && param.Parameter.length > 0 ? (
                          param.Parameter.map((subParam, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium text-gray-900">{subParam.name}</span>
                              {subParam.unit && (
                                <span className="text-gray-500 ml-2">({subParam.unit})</span>
                              )}
                              {subParam.referenceRange && (
                                <div className="text-xs text-gray-500">
                                  Reference: {subParam.referenceRange}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No sub-parameters</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => window.location.href = `/admin/package/parameter?edit=${param.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteParameter(param.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">
              Total Parameters: {filteredParameters.length}
            </span>
          </div>
          <div className="text-sm text-blue-600">
            Total Value: ₹{filteredParameters.reduce((sum, param) => sum + param.actualPrice, 0)}
          </div>
        </div>
      </div>
    </div>
  )
}
