"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const EnhancedCarousel: React.FC = () => {
  // Real health promotional images
  const healthImages = [
    "https://helma.healthians.com/stationery/banners/142_6114.jpg",
    "https://helma.healthians.com/stationery/banners/167_1076.webp",
    "https://helma.healthians.com/stationery/banners/166_6656.webp",
  ]

  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const autoPlayInterval = 4000

  useEffect(() => {
    if (healthImages.length >= 3) {
      setCarouselImages([...healthImages])
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (carouselImages.length === 3) {
      const interval = setInterval(() => {
        nextSlide()
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [carouselImages.length])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCarouselImages((prev) => {
      const newImages = [...prev]
      const firstImage = newImages.shift()
      if (firstImage) newImages.push(firstImage)
      return newImages
    })
    // Match this timeout to the CSS transition duration for smoothness
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCarouselImages((prev) => {
      const newImages = [...prev]
      const lastImage = newImages.pop()
      if (lastImage) newImages.unshift(lastImage)
      return newImages
    })
    // Match this timeout to the CSS transition duration for smoothness
    setTimeout(() => setIsTransitioning(false), 500)
  }

  if (carouselImages.length < 3) {
    return (
      <div className="w-full h-64 flex justify-center items-center bg-gray-100 rounded-2xl">
        <p className="text-gray-500">Loading carousel...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#FDF8F3] py-16">
      <div className="max-w-7xl mx-auto px-4 mt-10">
        {/* Main Carousel Container - Adjusted height for mobile */}
        <div className="relative w-full h-[200px] md:h-64 overflow-visible">
          {/* Navigation Arrows - Hidden on mobile, visible on md and up */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Carousel Images */}
          <div className="absolute w-full top-1/2 -translate-y-1/2 flex justify-center items-center">
            {/* Mobile View: Only show the center image, full width */}
            <div className="md:hidden w-[100%] max-w-md h-[200px] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out">
              <img
                src={carouselImages[1] || "/placeholder.svg"} // Always show the current center image
                alt={`Health promotion`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=300&text=Health+Promotion"
                }}
              />
            </div>

            {/* Desktop View: Show three images */}
            <div className="hidden md:flex absolute w-full top-1/2 -translate-y-1/2 justify-center items-center">
              {carouselImages.map((imageUrl, index) => {
                let className = "absolute transition-all duration-500 ease-in-out rounded-2xl overflow-hidden shadow-xl" // Changed duration to 500ms
                let style: React.CSSProperties = { opacity: 0 }

                if (index === 0) {
                  // Left image - smaller and faded (Desktop only)
                  className += " w-[380px] h-[200px]"
                  style = {
                    transform: "translateX(-120%)",
                    opacity: 0.6,
                    filter: "brightness(0.7)",
                  }
                } else if (index === 1) {
                  // Center image - largest and prominent (Desktop only)
                  className += " w-[660px] h-[240px] z-10"
                  style = {
                    transform: "translateX(0)",
                    opacity: 1,
                    filter: "brightness(1)",
                  }
                } else if (index === 2) {
                  // Right image - smaller and faded (Desktop only)
                  className += " w-[380px] h-[200px]"
                  style = {
                    transform: "translateX(120%)",
                    opacity: 0.6,
                    filter: "brightness(0.7)",
                  }
                }

                return (
                  <div
                    key={`${imageUrl}-${index}`}
                    className={className}
                    style={{
                      ...style,
                      transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)", // Changed duration to 500ms
                    }}
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Health promotion ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=240&width=600&text=Health+Promotion"
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          {/* Slide Indicators - visible on both mobile and desktop */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {healthImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === (healthImages.indexOf(carouselImages[1]) % healthImages.length)
                    ? "bg-gray-800 scale-125"
                    : "bg-gray-400 bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCarousel
