"use client"

import { useEffect, useState } from "react"

interface Booking {
  id: number
  userId: number
  status: string
  amount: number
  createdAt: string
  user: {
    id: number
    name: string
    email: string
  }
}

interface User {
  id: number
  email: string
  role: string
  createdAt: string
}

interface ServiceProvider {
  id: string
  email: string
  labName: string
  ownerName: string
  contactNumber: string
  city: string
  state: string
  homeCollection: boolean
  appointmentBooking: boolean
  emergencyTestFacility: boolean
  servicesOffered: string[]
  testsAvailable: string[]
  labImagesUrls: string[]
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch bookings
        const bookingsResponse = await fetch("https://redtestlab.com/api/bookings")
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings")
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData)

        // Fetch users with token from localStorage
        const token = localStorage.getItem("adminToken")
        if (token) {
          const usersResponse = await fetch("https://redtestlab.com/api/admin/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            // Fixed: Ensure we're correctly accessing the users array
            if (usersData && usersData.users && Array.isArray(usersData.users)) {
              setUsers(usersData.users)
            } else {
              console.error("Invalid users data structure:", usersData)
              setError("Invalid users data structure")
            }
          } else {
            console.error("Failed to fetch users:", usersResponse.statusText)
            setError("Failed to fetch users. Please Login Again.")
          }
        } else {
          console.warn("No token found in localStorage")
          setError("Authentication token not found. Some data may not be available.")
        }

        // Fetch service providers
        const providersResponse = await fetch("https://redtestlab.com/api/auth/service/all")
        if (!providersResponse.ok) throw new Error("Failed to fetch service providers")
        const providersData = await providersResponse.json()
        setServiceProviders(providersData.serviceProviders || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate metrics
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const todayBookings = bookings.filter((booking) => new Date(booking.createdAt) >= today).length

  const monthBookings = bookings.filter((booking) => new Date(booking.createdAt) >= firstDayOfMonth).length

  const totalProfit = bookings.reduce((sum, booking) => sum + booking.amount, 0)

  const monthProfit = bookings
    .filter((booking) => new Date(booking.createdAt) >= firstDayOfMonth)
    .reduce((sum, booking) => sum + booking.amount, 0)

  const totalUsers = users.length
  const totalServiceProviders = serviceProviders.length

  // Calculate growth percentages (mock data for demonstration)
  const userGrowth = 12.8
  const bookingGrowth = 23.5
  const profitGrowth = 18.2

  // Calculate monthly data for charts (mock data for demonstration)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = today.getMonth()
  
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12
    return monthNames[monthIndex]
  }).reverse()

  // Mock data for charts
  const bookingTrends = [42, 58, 65, 53, 72, monthBookings]
  const profitTrends = [15000, 22000, 18500, 25000, 28000, monthProfit]
  const userTrends = [120, 145, 162, 178, 195, totalUsers]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-10 rounded-b-3xl shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">Health Dashboard</h1>
              <p className="text-blue-100 text-sm md:text-base">
                Welcome back, Admin • {new Date().toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              {/* <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                Export Data
              </button> */}
              <button className="bg-white text-blue-800 hover:bg-blue-50 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium">
                Refresh Data
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-md animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Bookings */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  15.3%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">Today's Bookings</h3>
              {loading ? (
                <div className="h-9 w-24 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{todayBookings}</span>
                  <span className="ml-2 text-sm text-gray-500">bookings</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>

          {/* This Month's Bookings */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  {bookingGrowth}%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">This Month's Bookings</h3>
              {loading ? (
                <div className="h-9 w-24 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{monthBookings}</span>
                  <span className="ml-2 text-sm text-gray-500">bookings</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>

          {/* Total Profit */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  {profitGrowth}%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">Total Profit</h3>
              {loading ? (
                <div className="h-9 w-32 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{totalProfit.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>

          {/* This Month's Profit */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  22.8%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">This Month's Profit</h3>
              {loading ? (
                <div className="h-9 w-32 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">₹{monthProfit.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  {userGrowth}%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">Total Users</h3>
              {loading ? (
                <div className="h-9 w-20 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{totalUsers}</span>
                  <span className="ml-2 text-sm text-gray-500">users</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>

          {/* Total Service Providers */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                  </svg>
                  8.4%
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-1">Total Service Providers</h3>
              {loading ? (
                <div className="h-9 w-20 bg-blue-100 animate-pulse rounded-lg"></div>
              ) : (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{totalServiceProviders}</span>
                  <span className="ml-2 text-sm text-gray-500">providers</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Trends Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Booking Trends</h3>
                <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  Last 6 Months
                </div>
              </div>
              
              {loading ? (
                <div className="h-64 w-full bg-blue-50 animate-pulse rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              ) : (
                <div className="h-64 relative">
                  {/* Chart Visualization */}
                  <div className="absolute inset-0">
                    <div className="flex items-end justify-between h-full px-2">
                      {bookingTrends.map((value, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                            style={{ 
                              height: `${(value / Math.max(...bookingTrends)) * 80}%`,
                              animation: `grow 1s ease-out ${index * 0.1}s` 
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2">{last6Months[index]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-4">
                    <div>100</div>
                    <div>75</div>
                    <div>50</div>
                    <div>25</div>
                    <div>0</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
                <div className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-md">
                  Last 6 Months
                </div>
              </div>
              
              {loading ? (
                <div className="h-64 w-full bg-blue-50 animate-pulse rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              ) : (
                <div className="h-64 relative">
                  {/* Line Chart Visualization */}
                  <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    <line x1="0" y1="40" x2="300" y2="40" stroke="#EEF2FF" strokeWidth="1" />
                    <line x1="0" y1="80" x2="300" y2="80" stroke="#EEF2FF" strokeWidth="1" />
                    <line x1="0" y1="120" x2="300" y2="120" stroke="#EEF2FF" strokeWidth="1" />
                    <line x1="0" y1="160" x2="300" y2="160" stroke="#EEF2FF" strokeWidth="1" />
                    
                    {/* Line Chart */}
                    <path 
                      d={`M ${0} ${200 - (profitTrends[0] / 30000 * 160)} 
                          L ${60} ${200 - (profitTrends[1] / 30000 * 160)} 
                          L ${120} ${200 - (profitTrends[2] / 30000 * 160)} 
                          L ${180} ${200 - (profitTrends[3] / 30000 * 160)} 
                          L ${240} ${200 - (profitTrends[4] / 30000 * 160)} 
                          L ${300} ${200 - (profitTrends[5] / 30000 * 160)}`}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Area under the line */}
                    <path 
                      d={`M ${0} ${200 - (profitTrends[0] / 30000 * 160)} 
                          L ${60} ${200 - (profitTrends[1] / 30000 * 160)} 
                          L ${120} ${200 - (profitTrends[2] / 30000 * 160)} 
                          L ${180} ${200 - (profitTrends[3] / 30000 * 160)} 
                          L ${240} ${200 - (profitTrends[4] / 30000 * 160)} 
                          L ${300} ${200 - (profitTrends[5] / 30000 * 160)}
                          L ${300} ${200}
                          L ${0} ${200}
                          Z`}
                      fill="url(#blue-gradient)"
                      fillOpacity="0.2"
                    />
                    
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Data Points */}
                    {profitTrends.map((value, index) => (
                      <circle 
                        key={index}
                        cx={index * 60} 
                        cy={200 - (value / 30000 * 160)} 
                        r="4" 
                        fill="#FFFFFF"
                        stroke="#3B82F6"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500 px-2">
                    {last6Months.map((month, index) => (
                      <div key={index}>{month}</div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-4">
                    <div>₹30K</div>
                    <div>₹20K</div>
                    <div>₹10K</div>
                    <div>₹0</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 mb-8">
          <div className="p-6 border-b border-blue-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
              <p className="text-sm text-gray-500">Latest transactions in your system</p>
            </div>
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          {/* Table for larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-8 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-32 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-24 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-16 bg-blue-100 animate-pulse rounded"></div>
                        </td>
                      </tr>
                    ))
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{booking.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {booking.user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{booking.user.email}</p>
                            <p className="text-xs text-gray-500">User ID: {booking.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">₹{booking.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="md:hidden">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 border-b border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-16 bg-blue-100 animate-pulse rounded"></div>
                      <div className="h-4 w-24 bg-blue-100 animate-pulse rounded"></div>
                    </div>
                    <div className="h-4 w-32 bg-blue-100 animate-pulse rounded mb-2"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-blue-100 animate-pulse rounded"></div>
                      <div className="h-6 w-16 bg-blue-100 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))
            ) : bookings.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No bookings found</div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="p-4 border-b border-blue-100 hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                        {booking.user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">#{booking.id}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString("en-US", {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{booking.user.email}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">₹{booking.amount.toLocaleString()}</span>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                          booking.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User & Provider Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-800">User Distribution</h2>
              <p className="text-sm text-gray-500">Breakdown of user types</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col space-y-4">
                  <div className="h-6 w-32 bg-blue-100 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-blue-100 animate-pulse rounded"></div>
                  <div className="h-6 w-32 bg-blue-100 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-blue-100 animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Regular Users</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {users.filter((u) => u.role === "USER").length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${
                            users.length ? (users.filter((u) => u.role === "USER").length / users.length) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.round(users.length ? (users.filter((u) => u.role === "USER").length / users.length) * 100 : 0)}% of total users
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                        <span className="text-sm font-medium text-gray-700">Administrators</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {users.filter((u) => u.role === "ADMIN").length}
                      </span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-3">
                      <div
                        className="bg-indigo-500 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${
                            users.length ? (users.filter((u) => u.role === "ADMIN").length / users.length) * 100 : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.round(users.length ? (users.filter((u) => u.role === "ADMIN").length / users.length) * 100 : 0)}% of total users
                    </div>
                  </div>
                  
                  {/* User Growth Chart */}
                  <div className="mt-6 pt-6 border-t border-blue-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">User Growth</h3>
                    <div className="h-32 relative">
                      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="25" x2="300" y2="25" stroke="#EEF2FF" strokeWidth="1" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#EEF2FF" strokeWidth="1" />
                        <line x1="0" y1="75" x2="300" y2="75" stroke="#EEF2FF" strokeWidth="1" />
                        
                        {/* Line Chart */}
                        <path 
                          d={`M ${0} ${100 - (userTrends[0] / 200 * 100)} 
                              L ${60} ${100 - (userTrends[1] / 200 * 100)} 
                              L ${120} ${100 - (userTrends[2] / 200 * 100)} 
                              L ${180} ${100 - (userTrends[3] / 200 * 100)} 
                              L ${240} ${100 - (userTrends[4] / 200 * 100)} 
                              L ${300} ${100 - (userTrends[5] / 200 * 100)}`}
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Area under the line */}
                        <path 
                          d={`M ${0} ${100 - (userTrends[0] / 200 * 100)} 
                              L ${60} ${100 - (userTrends[1] / 200 * 100)} 
                              L ${120} ${100 - (userTrends[2] / 200 * 100)} 
                              L ${180} ${100 - (userTrends[3] / 200 * 100)} 
                              L ${240} ${100 - (userTrends[4] / 200 * 100)} 
                              L ${300} ${100 - (userTrends[5] / 200 * 100)}
                              L ${300} ${100}
                              L ${0} ${100}
                              Z`}
                          fill="url(#indigo-gradient)"
                          fillOpacity="0.2"
                        />
                        
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="indigo-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* X-axis labels */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-gray-500">
                        {last6Months.map((month, index) => (
                          <div key={index}>{month}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Service Provider Stats */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-6 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-800">Service Provider Stats</h2>
              <p className="text-sm text-gray-500">Overview of service capabilities</p>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-6 w-full bg-blue-100 animate-pulse rounded"></div>
                  <div className="h-6 w-full bg-blue-100 animate-pulse rounded"></div>
                  <div className="h-6 w-full bg-blue-100 animate-pulse rounded"></div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {serviceProviders.filter((sp) => sp.homeCollection).length}
                      </h3>
                      <p className="text-sm text-gray-500">Home Collection</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {serviceProviders.filter((sp) => sp.appointmentBooking).length}
                      </h3>
                      <p className="text-sm text-gray-500">Appointment Booking</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {serviceProviders.filter((sp) => sp.emergencyTestFacility).length}
                      </h3>
                      <p className="text-sm text-gray-500">Emergency Test</p>
                    </div>
                  </div>
                  
                  </div>)}
                  </div>
                  </div>
                  </div>

                  </div>
                  </div>
  );
}