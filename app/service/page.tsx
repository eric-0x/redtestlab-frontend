"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function ServiceLoginForm() {
  const navigate = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch("https://redtestlab.com/api/auth/service/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("serviceToken", data.token)
      localStorage.setItem("serviceId", data.serviceProvider.id)
      setSuccess(true)
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate.push("/service/dashboard")
      }, 1000)
      
    } catch (err:any) {
      setError(err.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 md:p-8 pt-12 md:pt-0">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-full h-full rounded-full bg-gray-500/10 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-full h-full rounded-full bg-gray-600/10 blur-3xl"></div>
        <div className="absolute top-[40%] left-[15%] w-full h-full rounded-full bg-gray-400/10 blur-3xl"></div>
      </div>

      {/* Login container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Glass effect card header */}
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-2xl font-bold text-white">Service Provider Login</h1>
            <p className="text-gray-300 mt-2">Sign in to your service provider account to continue</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {success ? (
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-5">
                Login successful! Redirecting to dashboard...
              </div>
            ) : null}
            
            {error ? (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            ) : null}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-5 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/30 focus:border-white/50 transition duration-200 outline-none placeholder:text-gray-500"
                    placeholder="Enter your email"
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
                  <Lock className="absolute left-3 top-5 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/30 focus:border-white/50 transition duration-200 outline-none placeholder:text-gray-500"
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
                disabled={isLoading}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-xl font-medium text-white bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg shadow-black/50 transition-all duration-200 mt-6 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
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
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Health Consultation Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}