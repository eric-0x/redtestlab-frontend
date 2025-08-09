"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useCart } from "@/components/CartContext" // Updated import path
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"

// Parameter interface
interface Parameter {
  id: number
  name: string
  unit: string
  referenceRange: string
  productId: number
}

// Test Product interface (for tests within packages)
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
  type: string
  products?: Product[]
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
  const womenCategoryIds = [1] // Category IDs for women-related categories

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all packages with their category from the correct endpoint
        const response = await fetch("https://redtestlab.com/api/product/type/packages")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        // Filter products whose category.type === 'WOMEN'
        const womenProducts: Product[] = data.filter((product: Product) => product.category && product.category.type === "WOMEN")
        // Group by category
        const categoryMap: { [key: number]: Category } = {}
        womenProducts.forEach((product) => {
          if (product.category) {
            if (!categoryMap[product.category.id]) {
              categoryMap[product.category.id] = {
                id: product.category.id,
                name: product.category.name,
                type: product.category.type,
                products: [],
              }
            }
            categoryMap[product.category.id].products!.push(product)
          }
        })
        setCategories(Object.values(categoryMap))
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
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
  const parseParameters = (parametersString?: string): any => {
    try {
      return parametersString ? JSON.parse(parametersString) : {}
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
    ...categories.map((category) => category.name),
  ]

  // Get all products from women's health categories
  const womenProducts = categories.flatMap((category) => category.products || [])

  // Filter products based on search term and selected category
  const filteredProducts = womenProducts.filter((product) => {
    if (!product) return false
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
      <div className="w-full max-w-full mx-auto px-3 md:px-12 py-8 bg-gray-50 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full mx-auto px-3 md:px-[74px] py-8 bg-gray-50">
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
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">Women's Health & Wellness</h1>
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
          const discountPercentage = Math.round(
            ((product.actualPrice - product.discountedPrice) / product.actualPrice) * 100,
          )
          const categoryName = categories.find((cat) => cat.id === product.categoryId)?.name || ""
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
                      {categoryName}
                    </span>
                  </div>
                  <div className="mt-3 flex text-sm text-gray-600 space-x-4">
                    <div>
                      Reports in <span className="font-semibold text-blue-700">{product.reportTime} hours</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex-1 overflow-y-auto">
                  {/* Display included tests */}
                  {product.ProductPackageLink_ProductPackageLink_packageIdToProduct &&
                    product.ProductPackageLink_ProductPackageLink_packageIdToProduct.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tests Included:</h4>
                        <div className="space-y-2">
                          {product.ProductPackageLink_ProductPackageLink_packageIdToProduct.map((link) => {
                            const test = link.Product_ProductPackageLink_testIdToProduct
                            return (
                              <div key={link.id} className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                <div className="font-medium text-blue-800 text-sm">
                                  {test?.name}
                                </div>
                                {test?.Parameter && test.Parameter.length > 0 && (
                                  <div className="mt-1">
                                    <div className="text-xs text-gray-600 mb-1">Parameters:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {test.Parameter.map((param) => (
                                        <span
                                          key={param.id}
                                          className="bg-white px-2 py-0.5 rounded text-xs text-gray-700 border"
                                        >
                                          {param.name}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  {/* Display tags */}
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
