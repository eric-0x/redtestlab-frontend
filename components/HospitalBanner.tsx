"use client"

import { Check, Sparkles } from "lucide-react"
import {useRouter} from 'next/navigation'

interface EnhancedBookingCardProps {
  onBookConsultation?: () => void
}



export default function EnhancedBookingCard({

}: EnhancedBookingCardProps) {
  const features = [
    "World-class medical expertise",
    "State-of-the-art facilities",
    "Personalized treatment plans",
    "24/7 premium care support",
  ]
    const navigate = useRouter()


  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden px-3">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 rounded-2xl md:rounded-3xl p-6  md:p-10 shadow-2xl border border-blue-800/30">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full blur-3xl" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-6">
            {/* Premium Label */}
       

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Experience excellence in healthcare
              </h1>
              <p className="text-base md:text-lg text-blue-200 font-medium leading-relaxed">
                Connect with top specialists and receive world-class medical care tailored to your needs.
              </p>
            </div>

            {/* Enhanced CTA Button - Hidden on mobile, will be moved to bottom */}
            <div className="pt-4 hidden md:block">
              <button
                onClick={()=> navigate.push('/hospital')}
                className="group relative inline-flex items-center justify-center w-full md:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-xl md:rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl" />

                {/* Button Content */}
                <span className="relative z-10 tracking-wide">Book Consultation Now</span>

                {/* Shine Effect */}
                <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>

          {/* Right Content - Enhanced Features */}
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-3 md:space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 md:gap-5 group">
                  <div className="flex-shrink-0 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Check className="w-3 md:w-5 h-3 md:h-5 text-white font-bold" />
                  </div>
                  <span className="text-blue-100 text-base md:text-lg font-semibold group-hover:text-white transition-colors duration-200">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Trust Indicators - Hidden on mobile */}
            <div className="pt-4 md:pt-6 border-t border-blue-800/30 hidden md:block">
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                <div className="space-y-1 md:space-y-2">
                  <div className="text-xl md:text-2xl font-black text-white">50K+</div>
                  <div className="text-xs md:text-sm text-blue-300 font-medium">Patients Treated</div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-xl md:text-2xl font-black text-white">98%</div>
                  <div className="text-xs md:text-sm text-blue-300 font-medium">Success Rate</div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <div className="text-xl md:text-2xl font-black text-white">24/7</div>
                  <div className="text-xs md:text-sm text-blue-300 font-medium">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA Button - Positioned at bottom */}
        <div className="pt-6 md:hidden">
          <button
            onClick={()=> navigate.push('/hospital')}
            className="group relative inline-flex items-center justify-center w-full px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />

            {/* Button Content */}
            <span className="relative z-10 tracking-wide">Book Consultation Now</span>

            {/* Shine Effect */}
            <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  )
}