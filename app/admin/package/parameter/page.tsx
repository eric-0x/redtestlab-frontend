"use client"

import React from "react"
import type { ChangeEvent } from "react"
import { useState, useEffect } from "react"
import { Plus, X, Save, AlertCircle, CheckCircle2, Package, Edit, Trash2, Search, Bold, Italic, List, ListOrdered } from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"

const API_URL = "https://redtestlab.com/api"

// Define types for our data
interface Parameter {
  name: string
  unit: string
  referenceRange: string
}

interface FAQ {
  question: string
  answer: string
}

interface Product {
  id: number
  actualPrice: number
  productType: string
  overview?: string
  faq?: FAQ[]
  Parameter?: Parameter[]
}

interface FormData {
  actualPrice: number
  parameters: Parameter[]
  overview: string
  faq: FAQ[]
}

interface Notification {
  show: boolean
  message: string
  type: string
}

export default function ParameterManagement() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "" })
  const [parameters, setParameters] = useState<Parameter[]>([{ name: "", unit: "", referenceRange: "" }])
  const [existingParameters, setExistingParameters] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingParameter, setEditingParameter] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    actualPrice: 0,
    parameters: [],
    overview: "",
    faq: [],
  })

  const [mounted, setMounted] = useState(false)

  // TipTap Editor for overview
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg mx-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
    ],
    content: formData.overview,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        overview: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none max-w-none min-h-[120px] p-3 border rounded-lg",
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update editor content when form data changes
  useEffect(() => {
    if (editor && mounted && editor.getHTML() !== formData.overview) {
      editor.commands.setContent(formData.overview)
    }
  }, [formData.overview, editor, mounted])

  useEffect(() => {
    fetchExistingParameters()
  }, [])

  const fetchExistingParameters = async () => {
    try {
      const response = await fetch(`${API_URL}/product/type/parameters`)
      if (!response.ok) throw new Error("Failed to fetch parameters")
      const data = await response.json()
      setExistingParameters(data)
    } catch (err: unknown) {
      console.error("Error fetching parameters:", err)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === "actualPrice" ? parseFloat(value) || 0 : value })
  }

  // FAQ management functions
  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }))
  }

  const updateFAQ = (index: number, field: "question" | "answer", value: string) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }))
  }

  const handleParameterChange = (index: number, field: "name" | "unit" | "referenceRange", value: string) => {
    const updatedParameters = [...parameters]
    updatedParameters[index][field] = value
    setParameters(updatedParameters)

    // Update the formData.parameters with the new parameters
    setFormData({
      ...formData,
      parameters: updatedParameters,
    })
  }

  const addParameter = () => {
    setParameters([...parameters, { name: "", unit: "", referenceRange: "" }])
  }

  const removeParameter = (index: number) => {
    if (parameters.length === 1) {
      showNotification("At least one parameter is required", "error")
      return
    }
    
    const updatedParameters = [...parameters]
    updatedParameters.splice(index, 1)
    setParameters(updatedParameters)

    // Update formData.parameters after removing a parameter
    setFormData({
      ...formData,
      parameters: updatedParameters,
    })
  }

  const resetForm = () => {
    setFormData({
      actualPrice: 0,
      parameters: [],
      overview: "",
      faq: [],
    })
    setParameters([{ name: "", unit: "", referenceRange: "" }])
    setEditingParameter(null)
    if (editor) {
      editor.commands.setContent("")
    }
  }

  const validateForm = () => {
    if (formData.actualPrice <= 0) {
      showNotification("Price is required and must be greater than 0", "error")
      return false
    }

    const validParameters = parameters.filter(param => param.name.trim() !== "")
    if (validParameters.length === 0) {
      showNotification("At least one parameter with name is required", "error")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      
      const validParameters = parameters.filter(param => param.name.trim() !== "")
      
      const requestBody = {
        productType: "PARAMETER",
        actualPrice: formData.actualPrice,
        parameters: validParameters
      }

      let url = `${API_URL}/product`
      let method = "POST"

      if (editingParameter) {
        url = `${API_URL}/product/${editingParameter}`
        method = "PUT"
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${editingParameter ? "update" : "create"} parameter`)
      }

      showNotification(`Parameter ${editingParameter ? "updated" : "created"} successfully`, "success")
      resetForm()
      fetchExistingParameters()
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : `Failed to ${editingParameter ? "update" : "create"} parameter`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (parameter: Product) => {
    setFormData({
      actualPrice: parameter.actualPrice,
      parameters: parameter.Parameter || [],
      overview: parameter.overview || "",
      faq: parameter.faq || [],
    })
    setParameters(parameter.Parameter || [{ name: "", unit: "", referenceRange: "" }])
    setEditingParameter(parameter.id)
    if (editor) {
      editor.commands.setContent(parameter.overview || "")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this parameter?")) return

    try {
      const response = await fetch(`${API_URL}/product/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete parameter")
      }

      setExistingParameters(existingParameters.filter((param) => param.id !== id))
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

  const filteredParameters = existingParameters.filter((param) => {
    const parameterNames = param.Parameter?.map(p => p.name).join(" ") || ""
    return parameterNames.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {notification.show && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-500 ease-in-out transform ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          <div className="flex items-start gap-3">
            {notification.message}
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-[1400px]">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Parameter Management</h1>
              <p className="mt-1 text-gray-500">Create and manage your lab parameters</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Create/Edit Parameter Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {editingParameter ? "Edit Parameter" : "Add Parameter"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Price */}
              <div>
                <label htmlFor="actualPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="actualPrice"
                  name="actualPrice"
                  value={formData.actualPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {/* Parameters Section */}
              <div>
                {/* <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sub-Parameters</h3>
                  <button
                    type="button"
                    onClick={addParameter}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div> */}
                <div className="space-y-4">
                  {parameters.map((parameter, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-medium text-gray-700">Sub-Parameter {index + 1}</h4>
                        {parameters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeParameter(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={parameter.name}
                            onChange={(e) => handleParameterChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Glucose"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={parameter.unit}
                            onChange={(e) => handleParameterChange(index, "unit", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., mg/dL"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reference Range
                          </label>
                          <input
                            type="text"
                            value={parameter.referenceRange}
                            onChange={(e) => handleParameterChange(index, "referenceRange", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 70-140"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overview Section with TipTap Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <div className="border rounded-lg">
                  {/* Editor Toolbar */}
                  {mounted && editor && (
                    <div className="border-b p-2 flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          editor.isActive("bold") ? "bg-gray-200" : ""
                        }`}
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          editor.isActive("italic") ? "bg-gray-200" : ""
                        }`}
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          editor.isActive("bulletList") ? "bg-gray-200" : ""
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          editor.isActive("orderedList") ? "bg-gray-200" : ""
                        }`}
                      >
                        <ListOrdered className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {/* Editor Content */}
                  <div className="min-h-[120px]">
                    {mounted && editor ? (
                      <EditorContent editor={editor} />
                    ) : (
                      <div className="p-3 text-gray-500">Loading editor...</div>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">FAQ</label>
                  <button
                    type="button"
                    onClick={addFAQ}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add FAQ
                  </button>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {formData.faq.map((faqItem, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                          <input
                            type="text"
                            value={faqItem.question}
                            onChange={(e) => updateFAQ(index, "question", e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter question"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                          <textarea
                            value={faqItem.answer}
                            onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter answer"
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeFAQ(index)}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                          >
                            <X className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.faq.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No FAQ added yet. Click "Add FAQ" to get started.
                    </div>
                  )}
                </div>
              </div>
              {/* Submit Buttons */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6 space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingParameter ? "Cancel" : "Reset"}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingParameter ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingParameter ? "Update Parameter" : "Create Parameter"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          {/* Parameter List */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">All Parameters</h2>
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
              {/* Parameters List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
                {filteredParameters.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No parameters found</p>
                    <p className="text-sm">
                      {searchTerm ? "Try adjusting your search criteria" : "Create your first parameter to get started"}
                    </p>
                  </div>
                ) : (
                  filteredParameters.map((param) => (
                    <div key={param.id} className="flex items-start justify-between p-4 hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-600">ID: {param.id}</span>
                          <span className="text-sm font-medium text-gray-900">₹{param.actualPrice}</span>
                        </div>
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
                            <span className="text-sm text-gray-400">No parameters</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(param)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-blue-50 hover:bg-gray-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(param.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Summary Stats */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
