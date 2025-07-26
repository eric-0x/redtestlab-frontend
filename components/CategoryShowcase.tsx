"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Thermometer, Heart, Activity, Sun, Torus, Shield, Microscope, TrendingUp } from "lucide-react"

interface Category {
  id: number
  name: string
  badge?: string | null
  products: Product[]
}

interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
}

interface HealthPackage {
  id: number
  name: string
  icon: React.ReactNode
  gradient: string
  iconColor: string
  shadowColor: string
  badge?: string | null
  description?: string
}

const iconMap = {
  Health: <User strokeWidth={1.5} />,
  Fever: <Thermometer strokeWidth={1.5} />,
  Heart: <Heart strokeWidth={1.5} />,
  Diabetes: <Activity strokeWidth={1.5} />,
  Vitamin: <Sun strokeWidth={1.5} />,
  Thyroid: <Torus strokeWidth={1.5} />,
  Immunity: <Shield strokeWidth={1.5} />,
  "Advanced Lab": <Microscope strokeWidth={1.5} />,
}

const gradientMap = {
  Health: "from-blue-50 via-blue-100 to-blue-50",
  Fever: "from-red-50 via-red-100 to-red-50",
  Heart: "from-pink-50 via-pink-100 to-pink-50",
  Diabetes: "from-purple-50 via-purple-100 to-purple-50",
  Vitamin: "from-amber-50 via-amber-100 to-amber-50",
  Thyroid: "from-teal-50 via-teal-100 to-teal-50",
  Immunity: "from-emerald-50 via-emerald-100 to-emerald-50",
  "Advanced Lab": "from-indigo-50 via-indigo-100 to-indigo-50",
}

const iconColorMap = {
  Health: "text-blue-600",
  Fever: "text-red-500",
  Heart: "text-pink-500",
  Diabetes: "text-purple-600",
  Vitamin: "text-amber-500",
  Thyroid: "text-teal-600",
  Immunity: "text-emerald-600",
  "Advanced Lab": "text-indigo-600",
}

const shadowColorMap = {
  Health: "rgba(59, 130, 246, 0.3)",
  Fever: "rgba(239, 68, 68, 0.3)",
  Heart: "rgba(236, 72, 153, 0.3)",
  Diabetes: "rgba(147, 51, 234, 0.3)",
  Vitamin: "rgba(245, 158, 11, 0.3)",
  Thyroid: "rgba(13, 148, 136, 0.3)",
  Immunity: "rgba(16, 185, 129, 0.3)",
  "Advanced Lab": "rgba(99, 102, 241, 0.3)",
}

const HealthCheckupPackages: React.FC = () => {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const [activePackage, setActivePackage] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState<number | null>(null)
  const [healthPackages, setHealthPackages] = useState<HealthPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://redtestlab.com/api/category")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categories: Category[] = await response.json()

        // Filter categories that have at least one product with productType = "PACKAGE"
        const categoriesWithPackages = categories; //Filter place for either Package or Test

        // Map categories to health packages format
        const packages = categoriesWithPackages.map((category) => {
          const defaultIcon = <User strokeWidth={1.5} />
          const defaultGradient = "from-blue-50 via-blue-100 to-blue-50"
          const defaultIconColor = "text-blue-600"
          const defaultShadowColor = "rgba(59, 130, 246, 0.3)"

          return {
            id: category.id,
            name: category.name,
            icon: iconMap[category.name as keyof typeof iconMap] || defaultIcon,
            gradient: gradientMap[category.name as keyof typeof gradientMap] || defaultGradient,
            iconColor: iconColorMap[category.name as keyof typeof iconColorMap] || defaultIconColor,
            shadowColor: shadowColorMap[category.name as keyof typeof shadowColorMap] || defaultShadowColor,
            badge: category.badge,
            // description: `${category.products.filter((p) => p.productType === "PACKAGE").length} packages available`,
          }
        })

        setHealthPackages(packages)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
      setActivePackage(null)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handlePackageClick = (packageId: number) => {
    // Navigate to all packages page with the selected category
    router.push(`/all?category=${packageId}`)
  }

  if (loading) {
    return (
      <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl">
        <div className="text-center">
          <p className="text-red-500">Error loading categories: {error}</p>
        </div>
      </div>
    )
  }

  if (healthPackages.length === 0) {
    return (
      <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl">
        <div className="text-center">
          <p>No health packages available at this time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-2xl" ref={componentRef}>
      <div className=" max-w-[1360px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent mb-2 md:mb-0">
            Doctors Curated Health Checkup Packages
          </h2>
          <p className="text-gray-500 text-sm md:text-base">Swipe to explore all packages</p>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 md:gap-6 overflow-x-auto pb-8 pt-2 px-1 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseLeave={() => setIsHovering(null)}
          >
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style>{`
              [ref="scrollContainerRef"]::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {healthPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex-shrink-0 snap-start cursor-pointer"
                onClick={() => {
                  setActivePackage(activePackage === pkg.id ? null : pkg.id)
                  handlePackageClick(pkg.id)
                }}
                onMouseEnter={() => setIsHovering(pkg.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl bg-gradient-to-br ${pkg.gradient}
                    pt-7 w-40 sm:w-44 h-36 sm:h-40
                    flex flex-col items-center justify-center
                    transition-all duration-500 ease-out
                  `}
                  style={{
                    boxShadow:
                      activePackage === pkg.id
                        ? `0 10px 25px -5px ${pkg.shadowColor}, 0 8px 10px -6px ${pkg.shadowColor}`
                        : isHovering === pkg.id
                          ? `0 10px 15px -3px ${pkg.shadowColor}, 0 4px 6px -4px ${pkg.shadowColor}`
                          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    transform:
                      activePackage === pkg.id
                        ? "translateY(-8px)"
                        : isHovering === pkg.id
                          ? "translateY(-6px)"
                          : "translateY(0)",
                  }}
                >
                  {/* Badge positioned at top-right corner */}
                  {pkg.badge && (
                    <div className="absolute top-1 right-1 z-20">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 shadow-lg backdrop-blur-sm">
                        <TrendingUp className="w-3 h-3 text-rose-600" strokeWidth={2.5} />
                        <span className="text-[11px] font-semibold text-rose-700 tracking-tight whitespace-nowrap">
                          {pkg.badge}
                        </span>
                      </div>
                      {/* Badge glow effect */}
                      {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-200/40 to-pink-200/40 blur-sm -z-10 scale-110" /> */}
                    </div>
                  )}

                  <div
                    className={`
                      relative z-10 rounded-full p-4 mb-3
                      flex items-center justify-center
                      bg-white/90 backdrop-blur-sm ${pkg.iconColor}
                      transition-all duration-500 ease-out
                    `}
                    style={{
                      boxShadow:
                        activePackage === pkg.id || isHovering === pkg.id
                          ? `0 4px 12px ${pkg.shadowColor}`
                          : "0 2px 5px rgba(0, 0, 0, 0.05)",
                      transform:
                        activePackage === pkg.id
                          ? "scale(1.15)"
                          : isHovering === pkg.id
                            ? "scale(1.1) rotate(5deg)"
                            : "scale(1) rotate(0)",
                    }}
                  >
                    <div className="w-7 h-7">{pkg.icon}</div>
                  </div>

                  <p
                    className={`
                      relative z-10 font-semibold text-center text-gray-800 mb-1
                      transition-all duration-300 ${activePackage === pkg.id ? pkg.iconColor : ""}
                    `}
                    style={{
                      transform: activePackage === pkg.id || isHovering === pkg.id ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {pkg.name}
                  </p>

                  <div
                    className={`
                      text-xs text-center text-gray-600 max-w-[90%]
                      transition-all duration-500 ease-out
                    `}
                    style={{
                      opacity: activePackage === pkg.id || isHovering === pkg.id ? 1 : 0,
                      maxHeight: activePackage === pkg.id || isHovering === pkg.id ? "40px" : "0",
                      overflow: "hidden",
                      transform:
                        activePackage === pkg.id || isHovering === pkg.id ? "translateY(0)" : "translateY(10px)",
                    }}
                  >
                    {pkg.description}
                  </div>

                  {/* Animated glow effect on active */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-700 ease-in-out pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${pkg.shadowColor} 0%, transparent 70%)`,
                      opacity: activePackage === pkg.id ? 0.6 : 0,
                    }}
                  />

                  {/* Animated bottom indicator */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ease-out"
                    style={{
                      background: `linear-gradient(to right, transparent, ${pkg.shadowColor.replace("0.3", "0.7")}, transparent)`,
                      opacity: activePackage === pkg.id ? 1 : 0,
                      transform: activePackage === pkg.id ? "scaleX(0.8)" : "scaleX(0)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="mt-4 flex justify-center gap-1.5">
            {healthPackages.map((pkg, index) => (
              <button
                key={`indicator-${pkg.id}`}
                className="focus:outline-none transition-all duration-300 ease-out"
                onClick={() => {
                  setActivePackage(pkg.id)
                  scrollContainerRef.current?.scrollTo({
                    left: index * 180,
                    behavior: "smooth",
                  })
                }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: activePackage === pkg.id ? "24px" : "8px",
                    background: activePackage === pkg.id ? pkg.shadowColor.replace("0.3", "1") : "rgba(0, 0, 0, 0.1)",
                    transform: activePackage === pkg.id ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthCheckupPackages
