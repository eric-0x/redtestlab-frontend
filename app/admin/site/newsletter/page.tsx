
"use client"

import React, { useState, useEffect } from "react"
import { Search, Mail, AlertCircle, CheckCircle2 } from "lucide-react"

const API_URL = "https://redtestlab.com/api/newsletter"

interface Newsletter {
  id: string
  email: string
  createdAt: string
}

interface Notification {
  show: boolean
  message: string
  type: "success" | "error"
}

export default function NewsletterShowcase() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState<Notification>({ show: false, message: "", type: "success" })

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const fetchNewsletters = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error("Failed to fetch newsletters")
      const data = await response.json()
      setNewsletters(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
      showNotification(err.message || "An unknown error occurred", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" })
    }, 3000)
  }

  const filteredNewsletters = newsletters.filter((n) =>
    n.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Newsletter Subscribers</h1>
              <p className="mt-1 text-sm sm:text-base text-gray-500">Showcase of all newsletter signups</p>
            </div>
          </div>
          {/* Search */}
          <div className="flex items-center justify-end gap-4">
            <div className="w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 p-4 rounded-lg shadow-lg max-w-md mx-auto sm:mx-0 transition-all duration-500 ease-in-out transform ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
              )}
              <p className="text-sm sm:text-base">{notification.message}</p>
            </div>
          </div>
        )}
        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading && !filteredNewsletters.length ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm sm:text-base">Loading newsletter subscribers...</p>
              </div>
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <Mail className="h-8 w-8 text-gray-400" />
                <p className="text-sm sm:text-base">No newsletter subscribers found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNewsletters.map((n) => (
                <div key={n.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex gap-2 items-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="font-mono text-base text-gray-900">{n.email}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">Subscribed: {new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}