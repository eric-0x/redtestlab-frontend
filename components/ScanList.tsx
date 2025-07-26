"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Changed from react-router-dom
import {
  Shield,
  Clock,
  MapPin,
  Bone,
  ScanIcon,
  Brain,
  Waves,
  Target,
  Heart,
  Activity,
  Stethoscope,
  Microscope,
  Camera,
  Zap,
  Award,
  type LucideIcon,
} from "lucide-react"

// Suppress Google Sign-In console warnings
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
if (typeof window !== "undefined") {
  console.error = (...args) => {
    if (args[0]?.includes?.("GSI_LOGGER") || args[0]?.includes?.("FedCM")) {
      return
    }
    originalConsoleError.apply(console, args)
  }
  console.warn = (...args) => {
    if (args[0]?.includes?.("GSI_LOGGER") || args[0]?.includes?.("FedCM")) {
      return
    }
    originalConsoleWarn.apply(console, args)
  }
}

interface ScanModel {
  id: number
  name: string
  description: string
  features: string[]
  startingPrice: number
  scans: Scan[]
  createdAt: string
  updatedAt: string
}

interface ScanCenter {
  id: number
  name: string
  type: "LAB" | "CLINIC" | "HOSPITAL"
  address: string
  city: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
}

interface Scan {
  id: number
  title: string
  description: string
  price: number
  discountedPrice: number | null
  waitTime: string
  reportTimeEstimate: string
  isVerified: boolean
  tags: string[]
  scanModelId: number
  scanCenterId: number
  scanModel: ScanModel
  scanCenter: ScanCenter
  createdAt: string
  updatedAt: string
}

const ScanCategories: React.FC = () => {
  const [scanModels, setScanModels] = useState<ScanModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const router = useRouter() // Changed from useNavigate()

  // Backend URL
  const BACKEND_URL = "https://redtestlab.com"

  // Random icons array
  const icons: LucideIcon[] = [
    Bone,
    ScanIcon,
    Brain,
    Waves,
    Target,
    Heart,
    Activity,
    Stethoscope,
    Microscope,
    Camera,
    Zap,
    Award,
  ]

  // Random gradient combinations
  const gradients = [
    {
      gradient: "from-blue-50 via-blue-100 to-blue-50",
      iconColor: "text-blue-600",
      shadowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      gradient: "from-purple-50 via-purple-100 to-purple-50",
      iconColor: "text-purple-600",
      shadowColor: "rgba(147, 51, 234, 0.3)",
    },
    {
      gradient: "from-emerald-50 via-emerald-100 to-emerald-50",
      iconColor: "text-emerald-600",
      shadowColor: "rgba(16, 185, 129, 0.3)",
    },
    {
      gradient: "from-orange-50 via-orange-100 to-orange-50",
      iconColor: "text-orange-600",
      shadowColor: "rgba(249, 115, 22, 0.3)",
    },
    {
      gradient: "from-red-50 via-red-100 to-red-50",
      iconColor: "text-red-600",
      shadowColor: "rgba(239, 68, 68, 0.3)",
    },
    {
      gradient: "from-pink-50 via-pink-100 to-pink-50",
      iconColor: "text-pink-600",
      shadowColor: "rgba(236, 72, 153, 0.3)",
    },
    {
      gradient: "from-indigo-50 via-indigo-100 to-indigo-50",
      iconColor: "text-indigo-600",
      shadowColor: "rgba(99, 102, 241, 0.3)",
    },
    {
      gradient: "from-teal-50 via-teal-100 to-teal-50",
      iconColor: "text-teal-600",
      shadowColor: "rgba(13, 148, 136, 0.3)",
    },
    {
      gradient: "from-amber-50 via-amber-100 to-amber-50",
      iconColor: "text-amber-600",
      shadowColor: "rgba(245, 158, 11, 0.3)",
    },
    {
      gradient: "from-cyan-50 via-cyan-100 to-cyan-50",
      iconColor: "text-cyan-600",
      shadowColor: "rgba(6, 182, 212, 0.3)",
    },
    {
      gradient: "from-lime-50 via-lime-100 to-lime-50",
      iconColor: "text-lime-600",
      shadowColor: "rgba(132, 204, 22, 0.3)",
    },
    {
      gradient: "from-rose-50 via-rose-100 to-rose-50",
      iconColor: "text-rose-600",
      shadowColor: "rgba(244, 63, 94, 0.3)",
    },
  ]

  useEffect(() => {
    fetchScanModels()
  }, [])

  const fetchScanModels = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching scan models from:", `${BACKEND_URL}/api/scan/scan-models`)
      const response = await fetch(`${BACKEND_URL}/api/scan/scan-models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }
      const data = await response.json()
      console.log("Scan models data:", data)
      setScanModels(data)
    } catch (err) {
      console.error("Error fetching scan models:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch scan categories")
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: number) => {
    router.push(`/scans/${categoryId}`) // Changed from navigate()
  }

  const getRandomIcon = (index: number) => {
    const IconComponent = icons[index % icons.length]
    return <IconComponent strokeWidth={1.5} />
  }

  const getRandomGradient = (index: number) => {
    return gradients[index % gradients.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading scan categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchScanModels}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="px-4 md:px-[74px] mx-auto py-12">
        {/* Hero Section */}
        <div className="text-center mb-0">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" /> Trusted by 50,000+ patients
          </div>

        </div>

        {/* Main Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent mb-4">
              Medical Imaging & Diagnostic Tests
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Book scans and diagnostic tests through RedTest Lab online booking and get results from trusted labs.
            </p>
          </div>
          {/* Scan Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            {scanModels.map((scanModel, index) => {
              const styling = getRandomGradient(index)
              const IconComponent = icons[index % icons.length] // Get the component directly
              return (
                <div
                  key={scanModel.id}
                  className="cursor-pointer"
                  onClick={() => handleCategorySelect(scanModel.id)}
                  onMouseEnter={() => setIsHovering(scanModel.id)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <div
                    className={`
                      relative overflow-hidden rounded-2xl bg-gradient-to-br ${styling.gradient}
                       p-6 h-48
                      flex flex-col items-center justify-center
                       transition-all duration-500 ease-out
                    `}
                    style={{
                      boxShadow:
                        isHovering === scanModel.id
                          ? `0 20px 25px -5px ${styling.shadowColor}, 0 8px 10px -6px ${styling.shadowColor}`
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transform: isHovering === scanModel.id ? "translateY(-8px)" : "translateY(0)",
                    }}
                  >
                    <div
                      className={`
                        relative z-10 rounded-full p-4 mb-3
                        flex items-center justify-center
                         bg-white/90 backdrop-blur-sm ${styling.iconColor}
                        transition-all duration-500 ease-out
                      `}
                      style={{
                        boxShadow:
                          isHovering === scanModel.id
                            ? `0 8px 25px ${styling.shadowColor}`
                            : "0 4px 6px rgba(0, 0, 0, 0.07)",
                        transform: isHovering === scanModel.id ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0)",
                      }}
                    >
                      <div className="w-7 h-7">
                        <IconComponent className={`w-7 h-7 ${styling.iconColor}`} />
                      </div>
                    </div>
                    <h3
                      className={`
                        relative z-10 font-bold text-center text-gray-800 mb-2 text-base
                        transition-all duration-300 ${isHovering === scanModel.id ? styling.iconColor : ""}
                      `}
                      style={{ transform: isHovering === scanModel.id ? "scale(1.05)" : "scale(1)" }}
                    >
                      {scanModel.name}
                    </h3>
                    <p className="text-xs text-center text-gray-600 mb-2 px-2">
                      {scanModel.description || `${scanModel.scans?.length || 0} tests available`}
                    </p>
                    <div
                      className={`
                        text-xs font-semibold text-center transition-all duration-500 ease-out ${
                          isHovering === scanModel.id ? styling.iconColor : "text-gray-700"
                        }
                      `}
                      style={{
                        opacity: isHovering === scanModel.id ? 1 : 0.8,
                        transform: isHovering === scanModel.id ? "translateY(0)" : "translateY(5px)",
                      }}
                    >
                      Starting ₹{scanModel.startingPrice}
                    </div>
                    {/* Animated glow effect on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl transition-opacity duration-700 ease-in-out pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${styling.shadowColor} 0%, transparent 70%)`,
                        opacity: isHovering === scanModel.id ? 0.4 : 0,
                      }}
                    />
                    {/* Animated bottom indicator */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ease-out"
                      style={{
                        background: `linear-gradient(to right, transparent, ${styling.shadowColor.replace("0.3", "0.8")}, transparent)`,
                        opacity: isHovering === scanModel.id ? 1 : 0,
                        transform: isHovering === scanModel.id ? "scaleX(0.8)" : "scaleX(0)",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanCategories
