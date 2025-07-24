"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
import {
  X,
  LogOut,
  User,
  Settings,
  CreditCard,
  Heart,
  Clock,
  FileText,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface UserData {
  id: number
  email: string
  name: string
  role: string
}

const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const [successMessage, setSuccessMessage] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("userToken")
      const userData = localStorage.getItem("userData")
      const userId = localStorage.getItem("userId")
      if (token && userData && userId) {
        setIsLoggedIn(true)
        setUserData(JSON.parse(userData))
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    }

    checkAuthState()

    const handleAuthStateChange = () => {
      window.dispatchEvent(new CustomEvent("authStateChanged"))
    }
    window.addEventListener("authStateChanged", handleAuthStateChange)
    return () => {
      window.removeEventListener("authStateChanged", handleAuthStateChange)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        onClose()
        setLoginSuccess(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [loginSuccess, onClose])

  const dispatchAuthStateChange = () => {
    window.dispatchEvent(new CustomEvent("authStateChanged"))
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")
    try {
      const response = await fetch("https://redtestlab.com/api/auth/login", {
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
      localStorage.setItem("userToken", data.token)
      localStorage.setItem("userData", JSON.stringify(data.user))
      localStorage.setItem("userId", data.user.id.toString())
      setIsLoggedIn(true)
      setUserData(data.user)
      setEmail("")
      setPassword("")
      setSuccessMessage(`Welcome back, ${data.user.name}!`)
      setLoginSuccess(true)
      dispatchAuthStateChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")
    try {
      const response = await fetch("https://redtestlab.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
      setShowSignup(false)
      setSuccessMessage("Account created successfully! You can now log in.")
      setName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setIsLoading(true)
      setError("")
      setSuccessMessage("")
      fetch("https://redtestlab.com/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Google login failed")
          }
          return response.json()
        })
        .then((data) => {
          localStorage.setItem("userToken", data.token)
          localStorage.setItem("userData", JSON.stringify(data.user))
          localStorage.setItem("userId", data.user.id.toString())
          setIsLoggedIn(true)
          setUserData(data.user)
          setSuccessMessage(`Welcome, ${data.user.name || data.user.email}!`)
          setLoginSuccess(true)
          dispatchAuthStateChange()
        })
        .catch((err) => {
          console.error("Google login error:", err)
          setError("Google login failed. Please try again.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("userId")
    setIsLoggedIn(false)
    setUserData(null)
    dispatchAuthStateChange()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            {showSignup && !isLoggedIn ? (
              <div className="flex items-center">
                <button onClick={() => setShowSignup(false)} className="mr-2 p-1 rounded-full hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoggedIn ? (
              <>
                {/* Login Success Toast */}
                {loginSuccess && (
                  <div className="m-5 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center animate-fade-in">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {successMessage}
                  </div>
                )}
                {/* User info */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg text-gray-800">{userData?.name || "User"}</h3>
                      <p className="text-gray-600 text-sm">{userData?.email || "user@example.com"}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                          {userData?.role || "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    <Link href="/profile/edit" className="flex-1 mr-2">
                      <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                        Edit Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-2 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
                {/* Quick actions */}
                <div className="p-5 border-b border-gray-100">
                  <h4 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Link
                      href="/profile/appointments"
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Clock className="h-6 w-6 text-blue-600 mb-1" />
                      <span className="text-xs text-center font-medium">Appointments</span>
                    </Link>
                    <Link
                      href="/booking-reports"
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <FileText className="h-6 w-6 text-green-600 mb-1" />
                      <span className="text-xs text-center font-medium">Reports</span>
                    </Link>
                    <Link
                      href="/profile/favorites"
                      className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Heart className="h-6 w-6 text-red-600 mb-1" />
                      <span className="text-xs text-center font-medium">Favorites</span>
                    </Link>
                  </div>
                </div>
                {/* Menu items */}
                <div className="p-5">
                  <h4 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Account Settings</h4>
                  <nav className="space-y-1">
                    <Link
                      href="/profile/personal-info"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-800">Personal Information</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/profile/payment-methods"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-800">Payment Methods</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/profile/settings"
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Settings className="h-5 w-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-800">Account Settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Link>
                  </nav>
                </div>
                {/* Health stats */}
                <div className="border-t border-gray-100 p-5">
                  <h4 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Health Stats</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Last Checkup</span>
                      <span className="text-sm text-blue-600 font-medium">15 days ago</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Upcoming Tests</span>
                      <span className="text-sm text-blue-600 font-medium">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Health Score</span>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium mr-1">85/100</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Login or Signup form when not logged in
              <div className="p-5">
                {showSignup ? (
                  // Signup Form
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your Account</h3>
                      <p className="text-gray-600">Join our RedTest Labs today</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                    <form className="space-y-4" onSubmit={handleSignup}>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="signup-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="signup-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Create a password"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:bg-blue-400"
                      >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                      </button>
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Already have an account?</span>
                        <button
                          type="button"
                          onClick={() => setShowSignup(false)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 ml-1"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  // Login Form
                  <div>
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome Back</h3>
                      <p className="text-gray-600">Sign in to access your health profile</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
                    {successMessage && (
                      <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {successMessage}
                      </div>
                    )}
                    <form className="space-y-4" onSubmit={handleLogin}>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                          </label>
                        </div>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Forgot password?
                        </a>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:bg-blue-400"
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </button>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-center items-center w-full">
                          <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => {
                              setError("Google login failed. Please try again.")
                            }}
                            useOneTap
                            theme="outline"
                            shape="rectangular"
                            text="signin_with"
                            size="large"
                            logo_alignment="left"
                            width="100%"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-sm text-gray-600">Don't have an account?</span>
                        <button
                          type="button"
                          onClick={() => setShowSignup(true)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500 ml-1"
                        >
                          Sign up
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="border-t border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <p>© 2025 RedTest Labs</p>
                <p className="mt-1">Version 1.0.2</p>
              </div>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Privacy Policy</span>
                  <Info className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Terms of Service</span>
                  <FileText className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSidebar
