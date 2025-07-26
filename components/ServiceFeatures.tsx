"use client"

import type React from "react"

import Image from "next/image"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

export default function Home() {
  return (
      <section id="statistics" className="bg-gradient-to-br from-blue-50 via-white to-blue-50 pb-20 pt-12">
        <div className="container mx-auto text-center">
          <AnimatedHeading />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 md:px-8 lg:px-10 mt-12">
            <Statistic
              imgSrc="https://assets.pharmeasy.in/apothecary/images/family.svg"
              alt="1 Million+"
              value={1}
              suffix="M+"
              description="Registered users as of May 31, 2025"
            />
            <Statistic
              imgSrc="https://assets.pharmeasy.in/apothecary/images/deliveryBoy.svg"
              alt="12 Million+"
              value={12}
              suffix="M+"
              description="Orders on Redtest Lab till date"
            />
            <Statistic
              imgSrc="https://assets.pharmeasy.in/apothecary/images/pincodeServed.svg"
              alt="60000+"
              value={1000}
              suffix="+"
              description="Unique tests sold last 6 months"
            />
            <Statistic
              imgSrc="https://assets.pharmeasy.in/apothecary/images/locationMarker.svg"
              alt="19000+"
              value={100}
              suffix="+"
              description="Pin codes serviced last 3 months"
            />
          </div>
        </div>
      </section>
  )
}

const AnimatedHeading = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      setIsVisible(true)
    }
  }, [inView])

  return (
    <div ref={ref} className="mb-8">
      <h2
        className={`text-4xl md:text-4xl font-bold transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
          Why Choose
        </span>{" "}
        <span className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 bg-clip-text text-transparent">
          Us?
        </span>
      </h2>
      <div
        className={`h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-4 rounded-full transition-all duration-1000 delay-300 ${
          isVisible ? "w-24" : "w-0"
        }`}
      />
    </div>
  )
}

interface StatisticProps {
  imgSrc: string
  alt: string
  value: number
  suffix: string
  description: string
}

const Statistic: React.FC<StatisticProps> = ({ imgSrc, alt, value, suffix, description }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-200"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon with blue accent */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-100 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <Image
            src={imgSrc || "/placeholder.svg"}
            alt={alt}
            width={84}
            height={84}
            priority
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Animated counter */}
        <div className="text-3xl md:text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {inView ? <CountUp end={value} duration={2.5} separator="," suffix={suffix} /> : `0${suffix}`}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-center text-sm md:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Decorative elements */}
      {/* <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      {/* <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" /> */}
    </div>
  )
}
