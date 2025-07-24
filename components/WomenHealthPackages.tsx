"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useCart } from "@/components/CartContext" // Updated import path
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"

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
                &times;
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-1">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Product interface
interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
}

// Category interface
interface Category {
  id: number
  name: string
  products: Product[]
}

const WomensHealthPackagesGrid = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [addingProductId, setAddingProductId] = useState<number | null>(null)
  const [buyingProductId, setBuyingProductId] = useState<number | null>(null)
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info",
  })
  const packagesPerPage = 8
  const { addToCart, loading: cartLoading } = useCart()

  // Women-related category IDs
  const womenCategoryIds = [27,28 , 33, 32, 31, 29, 30] // Category IDs for women-related categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://redtestlab.com/api/category")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Reset to first page when search or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Function to parse parameters string to object
  const parseParameters = (parametersString: string): any => {
    try {
      return JSON.parse(parametersString)
    } catch (e) {
      return {}
    }
  }

  // Function to parse tags into an array
  const parseTags = (tags: string): string[] => {
    return tags ? tags.split(",") : []
  }

  // Get all women's health categories
  const womenCategories = [
    "All",
    ...categories.filter((category) => womenCategoryIds.includes(category.id)).map((category) => category.name),
  ]

  // Get all products from women's health categories
  const womenProducts = categories
    .filter((category) => womenCategoryIds.includes(category.id))
    .flatMap((category) => category.products)

  // Filter products based on search term and selected category
  const filteredProducts = womenProducts.filter((product) => {
    const productName = product.name.toLowerCase()
    const searchTermLower = searchTerm.toLowerCase()
    const tags = parseTags(product.tags)
    const matchesSearch =
      productName.includes(searchTermLower) || tags.some((tag) => tag.toLowerCase().includes(searchTermLower))
    const matchesCategory =
      selectedCategory === "All" || categories.find((cat) => cat.id === product.categoryId)?.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate pagination
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = filteredProducts.slice(indexOfFirstPackage, indexOfLastPackage)
  const totalPages = Math.ceil(filteredProducts.length / packagesPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleAddToCart = async (productId: number) => {
    try {
      router.push("/cart")
      setAddingProductId(productId)
      await addToCart(productId, 1)
      setNotification({
        show: true,
        title: "Added to Cart",
        message: "Product has been added to your cart.",
        type: "success",
      })
    } catch (err) {
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to add product to cart.",
        type: "error",
      })
    } finally {
      setAddingProductId(null)
    }
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <Notification
        title={notification.title}
        message={notification.message}
        isVisible={notification.show}
        onClose={closeNotification}
        type={notification.type}
      />
      {/* Header section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Women's Health & Wellness</h1>
            <p className="text-gray-600">
              Get specialized health packages for women. Book online and enjoy hassle-free home sample collection with
              RedTest Lab.
            </p>
          </div>
        </div>
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mt-4">
          {womenCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-700 border border-blue-100 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-blue-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          placeholder="Search health packages by name or parameters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid of packages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {currentPackages.map((product) => {
          const tags = parseTags(product.tags)
          const parameters = parseParameters(product.parameters)
          const discountPercentage = Math.round(
            ((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100,
          )
          const categoryName = categories.find((cat) => cat.id === product.categoryId)?.name || ""
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border border-blue-100 flex flex-col transition-transform duration-300 hover:shadow-lg transform hover:-translate-y-1 h-[360px]"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-blue-700 pr-8">{product.name}</h3>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex text-sm text-gray-600 space-x-4">
                    <div>
                      Reports in <span className="font-semibold text-blue-700">{product.reportTime} hours</span>
                    </div>
                    <div className="border-l border-blue-200 pl-4">
                      Parameters <span className="font-semibold text-blue-700">{parameters.Parameters || "0"}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex-1">
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700 border border-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="bg-pink-50 px-3 py-1 rounded-full text-sm text-pink-700 border border-pink-100">
                        {categoryName}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Complete health package with comprehensive testing
                    </div>
                  )}
                </div>
                <div className="p-4 mt-auto border-t border-blue-100 bg-gradient-to-r from-white to-blue-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-blue-800">₹{product.discountedPrice}</span>
                      <span className="ml-2 text-sm line-through text-gray-500">₹{product.actualPrice}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="text-green-600 font-semibold">{discountPercentage}% off</span> for a limited
                      period
                    </div>
                  </div>
                  <div className="flex space-x-2">
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

      {/* No results message */}
      {currentPackages.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-blue-100">
          <p className="text-lg text-gray-600">No health packages found matching your search.</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("All")
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium border border-blue-200 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > packagesPerPage && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-blue-100">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              Previous
            </button>
            <div className="flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`mx-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                    currentPage === number ? "bg-blue-600 text-white shadow-sm" : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-700 hover:bg-blue-50"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default WomensHealthPackagesGrid
