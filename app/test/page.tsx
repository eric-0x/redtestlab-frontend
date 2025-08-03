"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Package, SlidersHorizontal, X } from "lucide-react"
import { useCart } from "../../components/CartContext"
import { AnimatePresence, motion } from "framer-motion"
import { processPayment } from "../../components/payment-service"
import { useRouter } from "next/navigation"
import Head from "next/head"
import Script from "next/script"

// Interface for the meta tags API response
interface MetaTagsResponse {
  id: number
  filename: string
  title: string
  description: string
  keywords: string
  charset: string
  author: string
  canonicallink: string
  favicon: string
  opengraph: string
  twitter: string
  schema: string
  viewport: string
  createdAt: string
  updatedAt: string
}

// Notification component
interface NotificationProps {
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info"
}

const Notification = ({ title, message, isVisible, onClose, type = "success" }: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      case "error":
        return "bg-gradient-to-r from-red-500 to-pink-500"
      case "info":
        return "bg-gradient-to-r from-sky-500 to-indigo-500"
      default:
        return "bg-gradient-to-r from-sky-500 to-indigo-500"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`h-1 ${getBgColor()} w-full`} />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-800">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                ×
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-1">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Parameter interface
interface Parameter {
  id: number
  name: string
  unit: string
  referenceRange: string
  productId: number
}

// Product interface - Updated to match new API response
interface Product {
  id: number
  name: string
  reportTime: string
  testCount?: number
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  description?: string
  category?: Category
  productType: string
  Parameter: Parameter[]
}

// Category interface
interface Category {
  id: number
  name: string
  products?: Product[]
  badge?: string
}

const HealthTestPackagesCarousel = () => {
  const router = useRouter()
  const [testProducts, setTestProducts] = useState<Product[]>([])
  const [allTestProducts, setAllTestProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info",
  })
  const [addingProductId, setAddingProductId] = useState<number | null>(null)
  const [buyingProductId, setBuyingProductId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const { addToCart, loading: cartLoading } = useCart()

  // Fetch meta tags from API
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/5")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 5,
          filename: "MedicalTests",
          title: "RedTest Lab - Medical Tests",
          description: "Browse and book individual medical tests and lab diagnostics at RedTest Lab",
          keywords: "medical tests, lab tests, blood tests, diagnostic tests, health screening",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: typeof window !== "undefined" ? window.location.href : "",
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Medical Tests",
          twitter: "RedTest Lab",
          schema: "",
          viewport: "width=device-width, initial-scale=1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } finally {
        setIsLoadingMeta(false)
      }
    }
    fetchMetaTags()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch all products from new API endpoint
        const productsResponse = await fetch("http://localhost:5000/api/product/type/tests")
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products")
        }
        const productsData = await productsResponse.json()

        // All products are already filtered as tests from the new endpoint
        setAllTestProducts(productsData)
        setTestProducts(productsData)

        // Fetch categories
        const categoriesResponse = await fetch("https://redtestlab.com/api/category")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter products when search term or category changes
  useEffect(() => {
    let filtered = [...allTestProducts]

    // Apply category filter
    if (selectedCategory !== null) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((product) => {
        const parameterNames = getParameterNames(product.Parameter || []).join(" ").toLowerCase()
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.tags.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          parameterNames.includes(searchLower)
        )
      })
    }

    setTestProducts(filtered)
  }, [searchTerm, selectedCategory, allTestProducts])

  const handleAddToCart = async (productId: number) => {
    try {
      router.push("/cart")
      setAddingProductId(productId)
      await addToCart(productId, 1)
      setNotification({
        show: true,
        title: "Added to Cart",
        message: "Test has been added to your cart.",
        type: "success",
      })
    } catch (err) {
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to add test to cart.",
        type: "error",
      })
    } finally {
      setAddingProductId(null)
    }
  }

  const handleBuyNow = async (productId: number, productName: string) => {
    if (!razorpayLoaded) {
      setNotification({
        show: true,
        title: "Error",
        message: "Payment system is loading. Please try again.",
        type: "error",
      })
      return
    }

    try {
      setBuyingProductId(productId)
      // Get user ID from localStorage or use a default value
      const userId = typeof window !== "undefined" ? Number.parseInt(localStorage.getItem("userId") || "3") : 3

      // Process the direct payment
      await processPayment(
        userId,
        "direct",
        productId,
        1,
        // Success callback
        () => {
          setNotification({
            show: true,
            title: "Payment Successful",
            message: `Your booking for ${productName} has been confirmed!`,
            type: "success",
          })
          setBuyingProductId(null)
        },
        // Error callback
        (error) => {
          setNotification({
            show: true,
            title: "Payment Failed",
            message: error.message || "Failed to process payment",
            type: "error",
          })
          setBuyingProductId(null)
        },
        // Cancel callback
        () => {
          setNotification({
            show: true,
            title: "Payment Cancelled",
            message: "You cancelled the payment process",
            type: "info",
          })
          setBuyingProductId(null)
        },
      )
    } catch (err) {
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to initiate payment.",
        type: "error",
      })
      setBuyingProductId(null)
    }
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const handleBackClick = () => {
    router.push("/")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory(null)
  }

  // Function to parse tags into an array
  const parseTags = (tags: string): string[] => {
    return tags ? tags.split(",").map((tag) => tag.trim()) : []
  }

  // Function to get parameter names as array
  const getParameterNames = (parameters: Parameter[]): string[] => {
    return parameters ? parameters.map((param) => param.name) : []
  }

  // Get category name by ID
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  if (loading) {
    return (
      <div className="w-full max-w-full mx-auto px-3 md:px-12 py-8 bg-gray-50 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {/* Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          console.error("Failed to load Razorpay script")
          setRazorpayLoaded(false)
        }}
      />

      {/* ...existing code... */}

      <div className="w-full max-w-full mx-auto px-3 md:px-12 py-8 bg-gray-50 rounded-xl shadow-sm">
        <Notification
          title={notification.title}
          message={notification.message}
          isVisible={notification.show}
          onClose={closeNotification}
          type={notification.type}
        />

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackClick}
            className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-blue-700"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-700">All Tests</h2>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests by name, tags, parameters, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors duration-300 ${
                showFilters ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-2 border-gray-200"
              }`}
            >
              <SlidersHorizontal size={20} />
              <span>Filter By Category</span>
              {selectedCategory !== null && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Filter Tests</h3>
                    {selectedCategory !== null && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-200 ${
                              selectedCategory === category.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{testProducts.length}</span> tests
              {selectedCategory !== null && (
                <>
                  {" "}
                  in <span className="font-semibold">{getCategoryName(selectedCategory)}</span>
                </>
              )}
              {searchTerm && (
                <>
                  {" "}
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </>
              )}
            </div>
          </div>
        </div>

        {/* Test Cards Grid - Responsive Layout */}
        <div className="relative">
          {testProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {testProducts.map((product) => {
                const tags = parseTags(product.tags)
                const parameterNames = getParameterNames(product.Parameter || [])
                const discountPercentage = Math.round(
                  ((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100,
                )

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md border border-blue-100 flex flex-col transition-transform duration-300 hover:shadow-lg transform hover:-translate-y-1 h-full"
                  >
                    <div className="h-full flex flex-col">
                      <div className="p-4 border-b border-blue-50">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-blue-800 pr-8">{product.name}</h3>
                          <span className="bg-blue-50 px-2 py-1 rounded-full text-xs font-medium text-blue-700">
                            {product.category?.name || getCategoryName(product.categoryId)}
                          </span>
                        </div>
                        <div className="mt-3 flex text-sm text-gray-600 space-x-4">
                          <div>
                            Reports in <span className="font-semibold text-blue-700">{product.reportTime} hours</span>
                          </div>
                          {product.testCount && product.testCount > 0 && (
                            <div className="border-l border-blue-100 pl-4">
                              Tests <span className="font-semibold text-blue-700">{product.testCount}</span>
                            </div>
                          )}
                   
                        </div>
                      </div>
                      <div className="px-4 py-3 flex-1 overflow-y-auto">
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="bg-blue-50 px-3 py-1 rounded-full text-xs text-blue-700">
                                {tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="bg-gray-50 px-3 py-1 rounded-full text-xs text-gray-600">
                                +{tags.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : null}
                        {product.description && (
                          <div className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</div>
                        )}
                        {/* Display parameters if available */}
                        {parameterNames.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="font-medium mb-1 text-xs text-gray-500">PARAMETERS:</div>
                            <div className="flex flex-wrap gap-2">
                              {parameterNames.slice(0, 4).map((paramName, index) => (
                                <span key={index} className="bg-green-50 px-2 py-1 rounded-full text-xs text-green-700">
                                  {paramName}
                                </span>
                              ))}
                              {parameterNames.length > 4 && (
                                <span className="bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-600">
                                  +{parameterNames.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 mt-auto border-t border-blue-50 flex flex-row flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-blue-800">₹{product.discountedPrice}</span>
                            <span className="ml-2 text-sm line-through text-gray-500">₹{product.actualPrice}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-green-600 font-semibold">{discountPercentage}% Off</span> Hurry!
                            
                          </div>
                        </div>
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium flex items-center justify-center"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={addingProductId === product.id || cartLoading}
                          >
                            {addingProductId === product.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              "Book Now"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col items-center justify-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No tests found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm || selectedCategory !== null
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "There are no test packages available at the moment."}
                </p>
                {(searchTerm || selectedCategory !== null) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HealthTestPackagesCarousel
