"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft, Package, FileText, User, Heart, Calendar, MapPin } from "lucide-react"

// Define interfaces for different search result types
interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: "PACKAGE" | "TEST"
  category: {
    id: number
    name: string
  }
}

interface Blog {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  author: string
  publishedAt: string
  imageUrl?: string
  tags?: string[]
}

interface Doctor {
  id: number
  name: string
  imageUrl: string
  gender: string
  experienceYears: number
  qualifications: string
  specialization: string
  languagesSpoken: string[]
  consultationFee: number
  affiliatedHospital?: {
    id: number
    name: string
    city: string
    state: string
  }
}

interface Hospital {
  id: number
  name: string
  images: string[]
  address: string
  city: string
  state: string
  departments: string[]
  facilities: string[]
  feeRangeMin: number
  feeRangeMax: number
}

interface SearchResults {
  packages: Product[]
  tests: Product[]
  blogs: Blog[]
  doctors: Doctor[]
  hospitals: Hospital[]
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [results, setResults] = useState<SearchResults>({
    packages: [],
    tests: [],
    blogs: [],
    doctors: [],
    hospitals: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'tests' | 'blogs' | 'doctors' | 'hospitals'>('all')

  useEffect(() => {
    if (query) {
      fetchSearchResults()
    } else {
      setLoading(false)
    }
  }, [query])

  const fetchSearchResults = async () => {
    setLoading(true)
    try {
      // Fetch from multiple APIs in parallel
      const [packagesRes, testsRes, blogsRes, doctorsRes, hospitalsRes] = await Promise.all([
        fetch("https://redtestlab.com/api/product/type/packages").catch(() => null),
        fetch("https://redtestlab.com/api/product/type/tests").catch(() => null),
        fetch("https://redtestlab.com/api/blog").catch(() => null),
        fetch("https://redtestlab.com/api/doctor/doctors").catch(() => null),
        fetch("https://redtestlab.com/api/doctor/hospitals").catch(() => null)
      ])

      const searchResults: SearchResults = {
        packages: [],
        tests: [],
        blogs: [],
        doctors: [],
        hospitals: []
      }

      // Process packages
      if (packagesRes && packagesRes.ok) {
        try {
          const packagesData = await packagesRes.json()
          if (packagesData.success && packagesData.data) {
            searchResults.packages = packagesData.data.filter((item: Product) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.tags?.toLowerCase().includes(query.toLowerCase()) ||
              item.parameters?.toLowerCase().includes(query.toLowerCase()) ||
              item.category?.name?.toLowerCase().includes(query.toLowerCase())
            )
          }
        } catch (error) {
          console.error("Error processing packages:", error)
        }
      }

      // Process tests
      if (testsRes && testsRes.ok) {
        try {
          const testsData = await testsRes.json()
          if (testsData.success && testsData.data) {
            searchResults.tests = testsData.data.filter((item: Product) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.tags?.toLowerCase().includes(query.toLowerCase()) ||
              item.parameters?.toLowerCase().includes(query.toLowerCase()) ||
              item.category?.name?.toLowerCase().includes(query.toLowerCase())
            )
          }
        } catch (error) {
          console.error("Error processing tests:", error)
        }
      }

      // Process blogs
      if (blogsRes && blogsRes.ok) {
        try {
          const blogsData = await blogsRes.json()
          if (blogsData.success && blogsData.data) {
            searchResults.blogs = blogsData.data.filter((item: Blog) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.content?.toLowerCase().includes(query.toLowerCase()) ||
              item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
              item.author?.toLowerCase().includes(query.toLowerCase())
            )
          }
        } catch (error) {
          console.error("Error processing blogs:", error)
        }
      }

      // Process doctors
      if (doctorsRes && doctorsRes.ok) {
        try {
          const doctorsData = await doctorsRes.json()
          if (Array.isArray(doctorsData)) {
            searchResults.doctors = doctorsData.filter((item: Doctor) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.specialization?.toLowerCase().includes(query.toLowerCase()) ||
              item.qualifications?.toLowerCase().includes(query.toLowerCase()) ||
              item.affiliatedHospital?.name?.toLowerCase().includes(query.toLowerCase())
            )
          }
        } catch (error) {
          console.error("Error processing doctors:", error)
        }
      }

      // Process hospitals
      if (hospitalsRes && hospitalsRes.ok) {
        try {
          const hospitalsData = await hospitalsRes.json()
          if (Array.isArray(hospitalsData)) {
            searchResults.hospitals = hospitalsData.filter((item: Hospital) =>
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.city?.toLowerCase().includes(query.toLowerCase()) ||
              item.state?.toLowerCase().includes(query.toLowerCase()) ||
              item.departments?.some(dept => dept.toLowerCase().includes(query.toLowerCase())) ||
              item.facilities?.some(facility => facility.toLowerCase().includes(query.toLowerCase()))
            )
          }
        } catch (error) {
          console.error("Error processing hospitals:", error)
        }
      }

      setResults(searchResults)
    } catch (error) {
      console.error("Error fetching search results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalResults = () => {
    return results.packages.length + results.tests.length + results.blogs.length + 
           results.doctors.length + results.hospitals.length
  }

  const getActiveResults = () => {
    switch (activeTab) {
      case 'packages': return results.packages
      case 'tests': return results.tests
      case 'blogs': return results.blogs
      case 'doctors': return results.doctors
      case 'hospitals': return results.hospitals
      default: return [...results.packages, ...results.tests, ...results.blogs, ...results.doctors, ...results.hospitals]
    }
  }

  const tabs = [
    { key: 'all', label: 'All', count: getTotalResults() },
    { key: 'packages', label: 'Packages', count: results.packages.length },
    { key: 'tests', label: 'Tests', count: results.tests.length },
    { key: 'blogs', label: 'Blogs', count: results.blogs.length },
    { key: 'doctors', label: 'Doctors', count: results.doctors.length },
    { key: 'hospitals', label: 'Hospitals', count: results.hospitals.length },
  ]

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
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
            <Search size={18} className="text-gray-500 mr-2" />
            <p className="text-gray-700">{query}</p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-6 shadow-md flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : getTotalResults() > 0 ? (
          <div className="space-y-6">
            {/* Packages Results */}
            {(activeTab === 'all' || activeTab === 'packages') && results.packages.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Package size={20} className="mr-2 text-blue-600" />
                  Health Packages ({results.packages.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-800 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{pkg.parameters}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-400 line-through mr-2">₹{pkg.actualPrice}</span>
                          <span className="text-blue-700 font-bold">₹{pkg.discountedPrice}</span>
                        </div>
                        <Link href={`/all?highlight=${pkg.id}`}>
                          <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                            Book Now
                          </button>
                        </Link>
                      </div>
                      {pkg.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                          {pkg.category.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tests Results */}
            {(activeTab === 'all' || activeTab === 'tests') && results.tests.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-green-600" />
                  Individual Tests ({results.tests.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.tests.map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-800 mb-2">{test.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{test.parameters}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-400 line-through mr-2">₹{test.actualPrice}</span>
                          <span className="text-green-700 font-bold">₹{test.discountedPrice}</span>
                        </div>
                        <Link href={`/test?highlight=${test.id}`}>
                          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                            Book Now
                          </button>
                        </Link>
                      </div>
                      {test.category && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                          {test.category.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs Results */}
            {(activeTab === 'all' || activeTab === 'blogs') && results.blogs.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText size={20} className="mr-2 text-purple-600" />
                  Health Articles ({results.blogs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.blogs.map((blog) => (
                    <div key={blog.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {blog.imageUrl && (
                        <img src={blog.imageUrl} alt={blog.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <h3 className="font-semibold text-gray-800 mb-2">{blog.title}</h3>
                      {blog.excerpt && <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>}
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>By {blog.author}</span>
                        <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/blog/${blog.slug || blog.id}`}>
                        <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                          Read More
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctors Results */}
            {(activeTab === 'all' || activeTab === 'doctors') && results.doctors.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User size={20} className="mr-2 text-teal-600" />
                  Doctors ({results.doctors.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.doctors.map((doctor) => (
                    <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {doctor.imageUrl && (
                          <img src={doctor.imageUrl} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">Dr. {doctor.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                          <p className="text-sm text-gray-500 mb-2">{doctor.experienceYears} years experience</p>
                          {doctor.affiliatedHospital && (
                            <p className="text-xs text-gray-500 mb-2">
                              {doctor.affiliatedHospital.name}, {doctor.affiliatedHospital.city}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-teal-700 font-bold">₹{doctor.consultationFee}</span>
                            <Link href={`/doctor?doctorId=${doctor.id}`}>
                              <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                Book Consultation
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospitals Results */}
            {(activeTab === 'all' || activeTab === 'hospitals') && results.hospitals.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Heart size={20} className="mr-2 text-red-600" />
                  Hospitals ({results.hospitals.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.hospitals.map((hospital) => (
                    <div key={hospital.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {hospital.images.length > 0 && (
                        <img src={hospital.images[0]} alt={hospital.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <h3 className="font-semibold text-gray-800 mb-2">{hospital.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {hospital.address}, {hospital.city}, {hospital.state}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {hospital.departments.slice(0, 3).map((dept, index) => (
                          <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            {dept}
                          </span>
                        ))}
                        {hospital.departments.length > 3 && (
                          <span className="text-xs text-gray-500">+{hospital.departments.length - 3} more</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">₹{hospital.feeRangeMin} - ₹{hospital.feeRangeMax}</span>
                        <Link href={`/hospital/${hospital.id}`}>
                          <button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="mb-4">
              <Search size={48} className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found for "{query}"</h3>
            <p className="text-gray-600 mb-4">Try different keywords or browse our categories:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/all" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors">
                Health Packages
              </Link>
              <Link href="/test" className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors">
                Lab Tests
              </Link>
              <Link href="/doctor" className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm hover:bg-teal-200 transition-colors">
                Doctors
              </Link>
              <Link href="/blog" className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
                Health Articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
