"use client"

import { useState, useEffect } from "react"
import { useCart } from "../../components/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { processPayment } from "../../components/payment-service"
import { ArrowLeft, Search, Package, SlidersHorizontal, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Script from "next/script"

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
      case "error":
        return "bg-red-100 border-red-400 text-red-700"
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700"
      default:
        return "bg-green-100 border-green-400 text-green-700"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`${getBgColor()} px-4 py-3 rounded border max-w-sm shadow-lg`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{title}</div>
                <div className="text-sm">{message}</div>
              </div>
              <button onClick={onClose} className="ml-2">
                <X size={16} />
              </button>
            </div>
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
  testId: number
}

// Test Product interface
interface TestProduct {
  id: number
  name: string
  reportTime: number
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
  category: Category
  Parameter: Parameter[]
}

// Package Link interface
interface ProductPackageLink {
  id: number
  packageId: number
  testId: number
  Product_ProductPackageLink_testIdToProduct: TestProduct
}

// Product interface
interface Product {
  id: number
  name: string
  reportTime: string
  parameters?: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  description?: string
  category?: Category
  productType: string
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: ProductPackageLink[]
}

// Category interface
interface Category {
  id: number
  name: string
  products?: Product[]
}

const AllClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [packages, setPackages] = useState<Product[]>([])
  const [allPackages, setAllPackages] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Get category from URL if present
        const categoryParam = searchParams.get("category")
        if (categoryParam) {
          setSelectedCategory(Number(categoryParam))
        }

        // Fetch all products
        const productsResponse = await fetch("https://redtestlab.com/api/product/type/packages")
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products")
        }
        const productsData = await productsResponse.json()

        // All data is already filtered for packages from the API
        setAllPackages(productsData)
        setPackages(productsData)

        // Fetch categories
        const categoriesResponse = await fetch("https://redtestlab.com/api/category")
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams])

  // Filter products when search term or category changes
  useEffect(() => {
    let filtered = [...allPackages]

    // Apply category filter
    if (selectedCategory !== null) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((product) => {
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.tags.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        )
      })
    }

    setPackages(filtered)
  }, [searchTerm, selectedCategory, allPackages])

  const handleAddToCart = async (productId: number) => {
    try {
      router.push("/cart")
      setAddingProductId(productId)
      await addToCart(productId, 1)
      setNotification({
        show: true,
        title: "Added to Cart",
        message: "Package has been added to your cart.",
        type: "success",
      })
    } catch (err) {
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to add package to cart.",
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

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 rounded-xl shadow-sm">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
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

      <div className="w-full max-w-full mx-auto px-3 md:px-[74px] py-8 bg-gray-50 rounded-xl shadow-sm">
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
            <h2 className="text-2xl font-bold text-blue-700">Health Packages</h2>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages by name, tags, or description..."
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
                    <h3 className="font-semibold text-gray-800">Filter Packages</h3>
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
              Showing <span className="font-semibold">{packages.length}</span> packages
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

        {/* Package Cards Grid - Responsive Layout */}
        <div className="relative">
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {packages.map((product) => {
                const tags = parseTags(product.tags)
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
                          <span className="bg-blue-50 px-2 py-1 rounded-full text-xs text-blue-700">
                            {getCategoryName(product.categoryId)}
                          </span>
                        </div>
                        <div className="mt-3 flex text-sm text-gray-600 space-x-4">
                          <div>
                            Reports in <span className="font-semibold text-blue-700">{product.reportTime} hours</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 flex-1 overflow-y-auto">
                        {/* Display Tests in Package */}
                        {product.ProductPackageLink_ProductPackageLink_packageIdToProduct && 
                         product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tests Included:</h4>
                            <div className="space-y-2">
                              {product.ProductPackageLink_ProductPackageLink_packageIdToProduct.map((link) => (
                                <div key={link.id} className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                  <div className="font-medium text-blue-800 text-sm">
                                    {link.Product_ProductPackageLink_testIdToProduct.name}
                                  </div>
                                  {link.Product_ProductPackageLink_testIdToProduct.Parameter && 
                                   link.Product_ProductPackageLink_testIdToProduct.Parameter.length > 0 && (
                                    <div className="mt-1">
                                      <div className="text-xs text-gray-600 mb-1">Parameters:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {link.Product_ProductPackageLink_testIdToProduct.Parameter.map((param) => (
                                          <span key={param.id} className="bg-white px-2 py-0.5 rounded text-xs text-gray-700 border">
                                            {param.name}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
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
                      </div>
                      <div className="p-4 mt-auto border-t border-blue-50 flex flex-row items-center justify-between gap-[68px] md:gap-3">
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-blue-800">₹{product.discountedPrice}</span>
                            <span className="ml-2 text-sm line-through text-gray-500">₹{product.actualPrice}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-green-600 font-semibold">{discountPercentage}% off</span> Hurry!
                            
                          </div>
                        </div>
                        <div className="flex space-x-2 w-full sm:w-auto">
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
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col items-center justify-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No packages found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchTerm || selectedCategory !== null
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "There are no health packages available at the moment."}
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

export default AllClient
