
"use client"

import React, { useState, useEffect } from "react"
import { Edit, Trash2, Plus, X, Save, Tag, AlertCircle, CheckCircle2, Percent } from "lucide-react"

const API_URL = "https://redtestlab.com/api/stickdiscountbar"
const COUPON_API_URL = "https://redtestlab.com/api/coupons"

interface DiscountBar {
  id: string
  title: string
  discountCode: string
  createdAt: string
}

interface Coupon {
  id: number
  code: string
  discountType: string
  discountValue: number
  expiresAt: string
  usageLimit: number
}

interface Notification {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function StickDiscountBarManagement() {
  const [bars, setBars] = useState<DiscountBar[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingBar, setEditingBar] = useState<DiscountBar | null>(null)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" })
  const [form, setForm] = useState({ title: "", discountCode: "" })
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [adminToken, setAdminToken] = useState<string | null>(null)

  useEffect(() => {
    setAdminToken(localStorage.getItem("adminToken"))
  }, [])

  useEffect(() => {
    fetchBars()
    fetchCoupons()
  }, [adminToken])

  const fetchBars = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch discount bars")
      const data = await response.json()
      setBars(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCoupons = async () => {
    if (!adminToken) return
    try {
      const response = await fetch(COUPON_API_URL, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      if (!response.ok) throw new Error("Failed to fetch coupons")
      const data = await response.json()
      setCoupons(data)
    } catch (err: any) {
      // Don't show error for coupons, just leave empty
    }
  }

  const resetForm = () => {
    setForm({ title: "", discountCode: "" })
    setEditingBar(null)
  }

  const handleEditClick = (bar: DiscountBar) => {
    setForm({ title: bar.title, discountCode: bar.discountCode })
    setEditingBar(bar)
    setShowForm(true)
  }

  const validateForm = () => {
    if (!form.title.trim()) {
      showNotification("Title is required", "error")
      return false
    }
    if (!form.discountCode.trim()) {
      showNotification("Discount code is required", "error")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    try {
      setIsLoading(true)
      const method = editingBar ? "PUT" : "POST"
      const url = editingBar ? `${API_URL}/${editingBar.id}` : API_URL
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Failed to ${editingBar ? "update" : "create"} discount bar`)
      }
      await fetchBars()
      resetForm()
      setShowForm(false)
      showNotification(`Discount bar ${editingBar ? "updated" : "created"} successfully`, "success")
    } catch (err: any) {
      showNotification(err.message || "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this discount bar?")) return
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete discount bar")
      await fetchBars()
      showNotification("Discount bar deleted successfully", "success")
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Sticky Discount Bar</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">Create and manage sticky discount bars for your site</p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className="w-[220px] flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Discount Bar
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
                  <Percent className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{editingBar ? "Edit Discount Bar" : "Add Discount Bar"}</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Discount bar title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                  <select
                    value={form.discountCode}
                    onChange={(e) => setForm({ ...form, discountCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="">Select a coupon code</option>
                    {coupons.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} ({c.discountValue}
                        {c.discountType === "percentage" ? "%" : "₹"})
                      </option>
                    ))}
                  </select>
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
                      <span>{editingBar ? "Update Discount Bar" : "Save Discount Bar"}</span>
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
          {isLoading && !bars.length ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm sm:text-base">Loading discount bars...</p>
              </div>
            </div>
          ) : bars.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <Percent className="h-8 w-8 text-gray-400" />
                <p className="text-sm sm:text-base">No discount bars found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bars.map((bar) => (
                <div key={bar.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex gap-2 items-center">
                        <Percent className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-lg text-gray-900">{bar.title}</span>
                        <span className="ml-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-sm font-mono">
                          {bar.discountCode}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">Created: {new Date(bar.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(bar)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Edit discount bar"
                      >
                        <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(bar.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 sm:p-2.5 rounded-lg transition-colors"
                        aria-label="Delete discount bar"
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