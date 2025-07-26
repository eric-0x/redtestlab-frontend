"use client"

import { ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const PackageCustomiseCard = () => {
  const navigate = useRouter()

  return (
    <div className="max-w-6xl mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-0 mt-10 mb-10">
      {/* Main Card Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
        {/* Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-6 sm:p-12 lg:p-10 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left w-full">
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-8 leading-tight">
              Break free from
              <br />
              <span className="text-blue-400">expensive healthcare packages.</span>
            </h1>

            {/* CTA Buttons - Hidden on mobile, shown on lg+ */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
              <button
                onClick={() => navigate.push("/custom")}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group w-full sm:w-auto"
              >
                <span>Create Custom Package</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="flex-1 max-w-lg w-full">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4 text-white">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  Flexible test selection and customization
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 text-white">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  Personalized healthcare recommendations
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 text-white">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  Instant 10% discount on custom packages
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 text-white">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg leading-relaxed">
                  Premium support and consultation included
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 text-white">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg leading-relaxed">Fast and accurate test results</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA Button - Shown only on mobile/tablet, hidden on lg+ */}
        <div className="lg:hidden px-6 sm:px-12 pb-6 sm:pb-12">
          <button
            onClick={() => navigate.push("/custom")}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group w-full "
          >
            <span>Create Custom Package</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PackageCustomiseCard