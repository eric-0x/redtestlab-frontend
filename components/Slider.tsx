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

    setTimeout(() => setIsTransitioning(false), 1000)
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

    setTimeout(() => setIsTransitioning(false), 1000)
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
      <div className="max-w-7xl mx-auto px-4">

        {/* Main Carousel - Three images with left/right visible */}
        <div className="relative w-full h-64 overflow-visible">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Carousel Images - Three visible with center focus */}
          <div className="absolute w-full top-1/2 -translate-y-1/2 flex justify-center items-center">
            {carouselImages.map((imageUrl, index) => {
              let className = "absolute transition-all duration-1000 ease-in-out rounded-2xl overflow-hidden shadow-xl"
              let style: React.CSSProperties = { opacity: 0 }

              if (index === 0) {
                // Left image - smaller and faded
                className += " w-[300px] h-[180px] md:w-[380px] md:h-[200px]"
                style = {
                  transform: "translateX(-120%)",
                  opacity: 0.6,
                  filter: "brightness(0.7)",
                }
              } else if (index === 1) {
                // Center image - largest and prominent
                className += " w-[400px] h-[240px] md:w-[660px] md:h-[240px] z-10"
                style = {
                  transform: "translateX(0)",
                  opacity: 1,
                  filter: "brightness(1)",
                }
              } else if (index === 2) {
                // Right image - smaller and faded
                className += " w-[300px] h-[180px] md:w-[380px] md:h-[200px]"
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
                    transition: "all 1000ms cubic-bezier(0.4, 0, 0.2, 1)",
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

          {/* Slide Indicators */}
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
