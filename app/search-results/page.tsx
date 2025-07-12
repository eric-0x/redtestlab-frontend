"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"

interface TestResult {
  id: number
  name: string
  description: string
  price: number
  discountPrice: number
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching search results
    const fetchResults = async () => {
      setLoading(true)
      // This would be replaced with your actual API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock results based on the query
      const mockResults = [
        {
          id: 1,
          name: `Complete Blood Count Test`,
          description: "Measures red and white blood cells, platelets, and hemoglobin",
          price: 599,
          discountPrice: 399,
        },
        {
          id: 2,
          name: `Thyroid Profile Test`,
          description: "Measures thyroid hormones to check thyroid function",
          price: 899,
          discountPrice: 599,
        },
        {
          id: 3,
          name: `Vitamin D Test`,
          description: "Measures vitamin D levels in the blood",
          price: 1299,
          discountPrice: 799,
        },
        {
          id: 4,
          name: `Diabetes Screening`,
          description: "Checks blood glucose levels and HbA1c",
          price: 999,
          discountPrice: 699,
        },
      ].filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      )

      setResults(mockResults)
      setLoading(false)
    }

    if (query) {
      fetchResults()
    } else {
      setLoading(false)
    }
  }, [query])

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-700 hover:text-blue-800 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to search</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Results</h1>
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-500 mr-2" />
            <p className="text-gray-700">{query}</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-6 shadow-md flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{result.name}</h2>
                <p className="text-gray-600 mb-4">{result.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-400 line-through mr-2">₹{result.price}</span>
                    <span className="text-blue-700 font-bold">₹{result.discountPrice}</span>
                  </div>
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-gray-700 mb-2">No results found for "{query}"</p>
            <p className="text-gray-500">Try different keywords or browse our health packages</p>
          </div>
        )}
      </div>
    </div>
  )
}
