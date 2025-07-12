"use client"

import { useEffect } from "react"
import {
  Calendar,
  Clock,
  Home,
  ThumbsUp,
  Award,
  FileText,
  Phone,
  FlaskConical,
  Zap,
  type LucideIcon,
} from "lucide-react"

interface ServiceFeatureProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
  iconColor?: string
  iconBg?: string
  index: number
}

const ServiceFeature = ({
  icon: Icon,
  title,
  description,
  gradient = "from-blue-50 to-indigo-50",
  iconColor = "text-blue-500",
  iconBg = "bg-blue-50",
  index,
}: ServiceFeatureProps) => {
  return (
    <div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 group"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "fadeInUp 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`}></div>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center mb-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBg} transition-all duration-500 group-hover:scale-110 shadow-sm`}
          >
            <Icon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300">{title}</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 mt-1.5"></div>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed flex-grow">{description}</p>
      </div>
    </div>
  )
}

interface StatItemProps {
  value: string
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  delay: number
}

const StatItem = ({ value, label, icon: Icon, color, bgColor, delay }: StatItemProps) => (
  <div
    className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group"
    style={{
      animation: "fadeInScale 0.6s ease-out forwards",
      animationDelay: `${delay * 0.1}s`,
      opacity: 0,
    }}
  >
    <div
      className={`w-20 h-20 rounded-2xl ${bgColor} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}
    >
      <Icon className={`w-10 h-10 ${color}`} />
    </div>
    <div className="text-center">
      <div
        className="text-3xl font-bold"
        style={{
          background: "linear-gradient(to right, #1e40af, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </div>
      <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
    </div>
  </div>
)

interface FeatureType {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
  iconColor: string
  iconBg: string
}

interface StatType {
  value: string
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  delay: number
}

const ServiceFeaturesSection = () => {
  useEffect(() => {
    // Add keyframe animations to the document
    const style = document.createElement("style")
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes gradientFlow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        }
      }
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const features: FeatureType[] = [
    {
      icon: Award,
      title: "Fast online test booking",
      description: "Follow Stringent Quality Control Practices with ISO Certified Laboratories",
      gradient: "from-amber-400 to-amber-600",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      icon: Clock,
      title: "Online report access within 24–48 hours",
      description: "Sample Collection & Detailed Reports Delivered Within Promised Timeframes",
      gradient: "from-blue-400 to-blue-600",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      icon: ThumbsUp,
      title: "Verified labs near you",
      description: "At-Home & In-Lab Services Tailored to Your Schedule and Preferences",
      gradient: "from-green-400 to-green-600",
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      icon: Calendar,
      title: "Fast online test booking",
      description: "365 Days a Year Access to Testing Services with No Holiday Closures",
      gradient: "from-purple-400 to-purple-600",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      icon: FileText,
      title: "Expert Assistance",
      description: "On-Demand Report Consultation with Qualified Healthcare Professionals",
      gradient: "from-rose-400 to-rose-600",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
    },
  ]

  const stats: StatType[] = [
    {
      value: "98%",
      label: "Customer Satisfaction",
      icon: ThumbsUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      delay: 0,
    },
    {
      value: "24/7",
      label: "Customer Support",
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      delay: 1,
    },
    {
      value: "100K+",
      label: "Tests Conducted",
      icon: FlaskConical,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      delay: 2,
    },
    {
      value: "50+",
      label: "Lab Locations",
      icon: Home,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      delay: 3,
    },
  ]

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-10 -mt-10 sm:-mt-20 -mr-10 sm:-mr-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply opacity-10 -mb-10 sm:-mb-20 -ml-10 sm:-ml-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-200 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Header */}
        <div className="text-center mb-12 sm:mb-16" style={{ animation: "fadeInUp 0.6s ease-out forwards" }}>
          <div className="inline-block mb-3">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Trusted by thousands</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative px-4"
            style={{
              background: "linear-gradient(to right, #1e3a8a, #3b82f6, #6366f1)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientFlow 3s ease infinite",
            }}
          >
            Why Book Tests With Us?
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg px-4">
            <span className="font-bold text-blue-700"> RedTest Lab </span> delivers up to 8x more cost-effective
            testing, as highlighted in the 78th UN General Assembly.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-16 sm:mb-20">
          <div
            className="text-center mb-10 sm:mb-12"
            style={{
              animation: "slideInLeft 0.6s ease-out forwards",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3 px-4"
              style={{
                background: "linear-gradient(to right, #1e3a8a, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Premium Features
            </h3>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Discover what makes our diagnostic services stand out from the rest
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <ServiceFeature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                iconColor={feature.iconColor}
                iconBg={feature.iconBg}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100">
          <div className="text-center mb-8 sm:mb-10">
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3 px-4"
              style={{
                background: "linear-gradient(to right, #1e3a8a, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Impact in Numbers
            </h3>
            <p className="text-gray-600 text-base sm:text-lg px-4">
              Delivering quality healthcare diagnostics across the nation
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 sm:mb-12">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
                delay={stat.delay}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 rounded-xl border border-blue-100">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">Ready to book your test?</h4>
                <p className="text-gray-600 text-sm sm:text-base">Experience our premium diagnostic services today</p>
              </div>
              <button
                className="w-full lg:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform flex items-center justify-center whitespace-nowrap"
                style={{ animation: "pulse 2s infinite" }}
              >
                <Zap className="w-5 h-5 mr-2 flex-shrink-0" /> Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceFeaturesSection
