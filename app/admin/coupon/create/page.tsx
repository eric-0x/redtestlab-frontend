"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  Trash2,
  Edit,
  Plus,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Calendar,
  Tag,
  Percent,
  Hash,
  Users,
} from "lucide-react"

interface Coupon {
  id?: number
  code: string
  discountType: "percentage"
  discountValue: number
  usageLimit: number
  expiresAt: string
}

const Coupon = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<Coupon>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    usageLimit: 0,
    expiresAt: "",
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const adminToken = localStorage.getItem("adminToken")
  // Replace the single apiBase with specific endpoints
  const apiBaseGet = "https://redtestlab.com/api/coupons"
  const apiBaseCreate = "https://redtestlab.com/api/coupons/create"
  const apiBaseUpdate = "https://redtestlab.com/api/coupons" // Will append ID for updates

  // Fetch coupons on mount
  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    if (!adminToken) {
      setError("Admin token not found")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(apiBaseGet, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      if (!res.ok) {
        throw new Error("Failed to fetch coupons")
      }
      const data = await res.json()
      setCoupons(data)
    } catch (err: any) {
      setError(err.message || "Error fetching coupons")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "discountValue" || name === "usageLimit" ? Number(value) : value,
    }))
  }

  // Add this function to help with debugging
  const formatDateForAPI = (dateString: string) => {
    // Ensure the date is in ISO format with time component
    const date = new Date(dateString)
    return date.toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminToken) {
      setError("Admin token not found")
      return
    }
    setIsSubmitting(true)
    setError(null)

    // Create a copy of the form data with properly formatted date
    const formData = {
      ...form,
      expiresAt: formatDateForAPI(form.expiresAt),
    }

    try {
      // Use different endpoints for create vs update
      const url = editingId ? `${apiBaseUpdate}/${editingId}` : apiBaseCreate

      const method = editingId ? "PUT" : "POST"

      console.log(`Submitting to: ${url} with method: ${method}`)
      console.log("Payload:", JSON.stringify(form))

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        console.error("API Error:", errorData)
        throw new Error(`Failed to ${editingId ? "update" : "create"} coupon. ${errorData?.message || res.statusText}`)
      }

      await fetchCoupons()
      setSuccess(`Coupon successfully ${editingId ? "updated" : "created"}`)
      setTimeout(() => setSuccess(null), 3000)
      resetForm()
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error submitting coupon")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      usageLimit: coupon.usageLimit,
      expiresAt: coupon.expiresAt.slice(0, 10), // format for input type date
    })
    setEditingId(coupon.id || null)
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!adminToken) {
      setError("Admin token not found")
      return
    }
    if (!window.confirm("Are you sure you want to delete this coupon?")) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBaseUpdate}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      if (!res.ok) {
        throw new Error("Failed to delete coupon")
      }
      await fetchCoupons()
      setSuccess("Coupon successfully deleted")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || "Error deleting coupon")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      usageLimit: 0,
      expiresAt: "",
    })
    setEditingId(null)
  }

  // Calculate stats
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter((c) => new Date(c.expiresAt) > new Date()).length
  const expiredCoupons = totalCoupons - activeCoupons
  const percentageCoupons = coupons.filter((c) => c.discountType === "percentage").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">Coupon Management</h1>
          <p className="text-blue-600 max-w-2xl mx-auto">
            Create, manage, and track promotional coupons for your customers
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Tag className="size-6" />
              </div>
              <div>
                <p className="text-sm text-blue-500 font-medium">Total Coupons</p>
                <h3 className="text-2xl font-bold text-blue-900">{totalCoupons}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm text-blue-500 font-medium">Active Coupons</p>
                <h3 className="text-2xl font-bold text-blue-900">{activeCoupons}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <Calendar className="size-6" />
              </div>
              <div>
                <p className="text-sm text-blue-500 font-medium">Expired Coupons</p>
                <h3 className="text-2xl font-bold text-blue-900">{expiredCoupons}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Percent className="size-6" />
              </div>
              <div>
                <p className="text-sm text-blue-500 font-medium">Percentage Discounts</p>
                <h3 className="text-2xl font-bold text-blue-900">{percentageCoupons}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 size-5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
              <X className="size-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start">
            <CheckCircle className="text-green-500 mr-3 mt-0.5 size-5 flex-shrink-0" />
            <div>
              <h3 className="text-green-800 font-medium">Success</h3>
              <p className="text-green-700">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
              <X className="size-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  {editingId ? (
                    <>
                      <Edit className="mr-2 size-5" />
                      Edit Coupon
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 size-5" />
                      Create Coupon
                    </>
                  )}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5" htmlFor="code">
                    <div className="flex items-center">
                      <Hash className="size-4 mr-1.5 text-blue-500" />
                      Coupon Code
                    </div>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={form.code}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. SUMMER2023"
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-blue-900 placeholder-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5" htmlFor="discountType">
                    <div className="flex items-center">
                      <Tag className="size-4 mr-1.5 text-blue-500" />
                      Discount Type
                    </div>
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={form.discountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-blue-900 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    {/* <option value="fixed">Fixed Amount ($)</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5" htmlFor="discountValue">
                    <div className="flex items-center">
                      <Percent className="size-4 mr-1.5 text-blue-500" />
                      Discount Value
                    </div>
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleInputChange}
                    min={0}
                    required
                    placeholder={form.discountType === "percentage" ? "e.g. 15" : "e.g. 10"}
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-blue-900 placeholder-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5" htmlFor="usageLimit">
                    <div className="flex items-center">
                      <Users className="size-4 mr-1.5 text-blue-500" />
                      Usage Limit
                    </div>
                  </label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleInputChange}
                    min={0}
                    required
                    placeholder="e.g. 100"
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-blue-900 placeholder-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5" htmlFor="expiresAt">
                    <div className="flex items-center">
                      <Calendar className="size-4 mr-1.5 text-blue-500" />
                      Expiration Date
                    </div>
                  </label>
                  <input
                    type="date"
                    id="expiresAt"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-blue-900"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="animate-spin mr-2 size-4" />
                        {editingId ? "Updating..." : "Creating..."}
                      </span>
                    ) : (
                      <>{editingId ? "Update Coupon" : "Create Coupon"}</>
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg font-medium border border-blue-300 text-blue-700 hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-4 px-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Existing Coupons</h2>
                <button
                  onClick={fetchCoupons}
                  disabled={loading}
                  className="p-2 rounded-full bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-50 transition-all"
                  title="Refresh coupons"
                >
                  <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading && !isSubmitting && (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="animate-spin text-blue-600 size-8" />
                    <span className="ml-2 text-blue-600 font-medium">Loading coupons...</span>
                  </div>
                )}

                {!loading && coupons.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
                      <Tag className="size-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-medium text-blue-900 mb-1">No coupons found</h3>
                    <p className="text-blue-500 max-w-md mx-auto">
                      Create your first coupon to start offering discounts to your customers.
                    </p>
                  </div>
                )}

                {!loading && coupons.length > 0 && (
                  <table className="w-full min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Limit
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-blue-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      {coupons.map((coupon) => {
                        const isExpired = new Date(coupon.expiresAt) < new Date()

                        return (
                          <tr key={coupon.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-blue-900">{coupon.code}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  coupon.discountType === "percentage"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {coupon.discountType === "percentage" ? "Percentage" : "Fixed"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-blue-900">
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}%`
                                  : `$${coupon.discountValue.toFixed(2)}`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-blue-900">{coupon.usageLimit}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-blue-900">
                                {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {isExpired ? "Expired" : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(coupon)}
                                  disabled={loading}
                                  className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition-colors"
                                  title="Edit coupon"
                                >
                                  <Edit className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(coupon.id)}
                                  disabled={loading}
                                  className="p-1.5 rounded-md text-red-600 hover:bg-red-100 transition-colors"
                                  title="Delete coupon"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Coupon
