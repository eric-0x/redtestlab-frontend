"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Truck, Lock, Phone } from "lucide-react"

export default function DeliveryBoyLogin() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, "")
    
    // Return digits as-is without adding 0 prefix
    // The database stores phone numbers without country code prefix
    return digits
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(formData.phoneNumber)
      
      const response = await fetch("https://redtestlab.com/api/bcb/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token and user data
      localStorage.setItem("deliveryToken", data.token)
      localStorage.setItem("deliveryUser", JSON.stringify(data.bcb))
      
      // Redirect to delivery dashboard
      router.push("/delivery/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-8 pt-12 md:pt-0">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-full h-full rounded-full bg-orange-500/10 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-full h-full rounded-full bg-red-600/10 blur-3xl"></div>
        <div className="absolute top-[40%] left-[15%] w-full h-full rounded-full bg-orange-400/10 blur-3xl"></div>
      </div>

      {/* Login container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Glass effect card header */}
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-2xl font-bold text-white">Delivery Boy Login</h1>
            <p className="text-gray-300 mt-2">Sign in to your delivery account to continue</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {error ? (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            ) : null}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Phone Number field */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-200">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-5 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-200" />
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition duration-200 outline-none placeholder:text-gray-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-5 h-5 w-5 text-gray-400 group-focus-within:text-orange-400 transition-colors duration-200" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition duration-200 outline-none placeholder:text-gray-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-5 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-xl font-medium text-white bg-gradient-to-r from-orange-400 to-red-600 hover:from-orange-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-orange-600/30 transition-all duration-200 mt-6 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} RedTestLab. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
