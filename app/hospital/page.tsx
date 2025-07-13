"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Building2,
  Users,
  Shield,
  Award,
  ChevronRight,
  Calendar,
  Loader2,
} from "lucide-react"
import { apiService, type Hospital } from "../../components/api"

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

export default function HospitalListing() {
  const router = useRouter()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)

  // Fetch meta tags from API
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/7")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 7,
          filename: "HospitalListing",
          title: "RedTest Lab - Find Top Hospitals & Healthcare Providers",
          description:
            "Discover trusted hospitals with experienced doctors and state-of-the-art facilities for all your healthcare needs",
          keywords: "hospitals, healthcare providers, medical facilities, doctors, specialists, healthcare centers",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: typeof window !== "undefined" ? window.location.href : "",
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Hospitals",
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
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        const data = await apiService.getHospitals()
        setHospitals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch hospitals")
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  const handleHospitalClick = (hospitalId: number) => {
    router.push(`/hospital/${hospitalId}`)
  }

  if (loading) {
    return (
      <>
        {/* Next.js Head for dynamic meta tags */}
        {metaTags && !isLoadingMeta && (
          <Head>
            <title>{metaTags.title}</title>
            <meta name="description" content={metaTags.description} />
            <meta name="keywords" content={metaTags.keywords} />
            <meta name="author" content={metaTags.author} />
            <meta charSet={metaTags.charset} />
            <meta name="viewport" content={metaTags.viewport} />
            {/* Canonical Link */}
            {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}
            {/* Favicon */}
            {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}
            {/* Open Graph Tags */}
            {metaTags.opengraph && (
              <>
                <meta property="og:title" content={metaTags.title} />
                <meta property="og:description" content={metaTags.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
              </>
            )}
            {/* Twitter Card Tags */}
            {metaTags.twitter && (
              <>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTags.title} />
                <meta name="twitter:description" content={metaTags.description} />
              </>
            )}
            {/* Schema.org structured data */}
            {metaTags.schema && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
            )}
          </Head>
        )}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading hospitals...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        {/* Next.js Head for dynamic meta tags */}
        {metaTags && !isLoadingMeta && (
          <Head>
            <title>{metaTags.title}</title>
            <meta name="description" content={metaTags.description} />
            <meta name="keywords" content={metaTags.keywords} />
            <meta name="author" content={metaTags.author} />
            <meta charSet={metaTags.charset} />
            <meta name="viewport" content={metaTags.viewport} />
            {/* Canonical Link */}
            {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}
            {/* Favicon */}
            {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}
            {/* Open Graph Tags */}
            {metaTags.opengraph && (
              <>
                <meta property="og:title" content={metaTags.title} />
                <meta property="og:description" content={metaTags.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
              </>
            )}
            {/* Twitter Card Tags */}
            {metaTags.twitter && (
              <>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTags.title} />
                <meta name="twitter:description" content={metaTags.description} />
              </>
            )}
            {/* Schema.org structured data */}
            {metaTags.schema && (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
            )}
          </Head>
        )}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Hospitals</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Next.js Head for dynamic meta tags */}
      {metaTags && !isLoadingMeta && (
        <Head>
          <title>{metaTags.title}</title>
          <meta name="description" content={metaTags.description} />
          <meta name="keywords" content={metaTags.keywords} />
          <meta name="author" content={metaTags.author} />
          <meta charSet={metaTags.charset} />
          <meta name="viewport" content={metaTags.viewport} />
          {/* Canonical Link */}
          {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}
          {/* Favicon */}
          {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}
          {/* Open Graph Tags */}
          {metaTags.opengraph && (
            <>
              <meta property="og:title" content={metaTags.title} />
              <meta property="og:description" content={metaTags.description} />
              <meta property="og:type" content="website" />
              <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />
            </>
          )}
          {/* Twitter Card Tags */}
          {metaTags.twitter && (
            <>
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content={metaTags.title} />
              <meta name="twitter:description" content={metaTags.description} />
            </>
          )}
          {/* Schema.org structured data */}
          {metaTags.schema && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: metaTags.schema }} />
          )}
        </Head>
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Hero Header */}
        <header className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Find Top Healthcare
                <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Providers
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Discover trusted hospitals with experienced doctors and state-of-the-art facilities. Your health journey
                starts with the right choice.
              </p>
            </div>
          </div>
        </header>

        {/* Enhanced Stats Section */}
        <section className="relative -mt-16 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{hospitals.length}+</div>
                  <div className="text-blue-600 font-medium">Hospitals</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {hospitals.reduce((total, hospital) => total + (hospital.doctors?.length || 0), 0)}+
                  </div>
                  <div className="text-emerald-600 font-medium">Expert Doctors</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                  <div className="text-purple-600 font-medium">Verified</div>
                </div>
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                  <div className="text-orange-600 font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Hospitals Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Healthcare Centers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our network of premium hospitals and medical facilities
              </p>
            </div>

            {hospitals.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Hospitals Found</h3>
                <p className="text-gray-500">Please check back later or contact support.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                    onClick={() => handleHospitalClick(hospital.id)}
                  >
                    {/* Hospital Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={hospital.images?.[0] || "/placeholder.svg?height=300&width=400"}
                        alt={hospital.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-800">4.8</span>
                        </div>
                      </div>
                      {hospital.isScanProvider && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Scan Provider
                        </div>
                      )}
                    </div>

                    {/* Hospital Info */}
                    <div className="p-8">
                      {/* Header */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            {hospital.city}, {hospital.state}
                          </span>
                        </div>
                      </div>

                      {/* Departments */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {hospital.departments.slice(0, 3).map((dept, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100"
                            >
                              {dept}
                            </span>
                          ))}
                          {hospital.departments.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                              +{hospital.departments.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">
                            {hospital.fromTime} - {hospital.toTime}
                          </span>
                        </div>
                        {hospital.contactPhone && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <Phone className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium">{hospital.contactPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">{hospital.availableDays.length} days/week</span>
                        </div>
                      </div>

                      {/* Fee Range & CTA */}
                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-sm text-gray-500 block">Consultation Fee</span>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{hospital.feeRangeMin} - ₹{hospital.feeRangeMax}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                            <span className="text-sm font-semibold">View Details</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
