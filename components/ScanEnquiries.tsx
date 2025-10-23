"use client"

import { useState, useEffect } from 'react'
import { Scan, MapPin, Calendar, Search, Building2 } from 'lucide-react'

interface ScanCenter {
  id: number
  name: string
  type: string
  address: string
  city: string
  state: string
  pincode: string
  latitude: number
  longitude: number
  createdAt: string
  scans: any[]
}

interface ScanEnquiriesResponse {
  message: string
  scanCenters: ScanCenter[]
  count: number
}

const ScanEnquiries = () => {
  const [scanCenters, setScanCenters] = useState<ScanCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const fetchScanCenters = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("adminToken")
      if (!token) {
        setError("Authentication token not found. Please login.")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://redtestlab.com'}/api/enquiries/scan-center`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch scan center enquiries")
      }

      const result: ScanEnquiriesResponse = await response.json()
      setScanCenters(result.scanCenters)
    } catch (err: any) {
      setError(err.message || "Failed to load scan center enquiries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScanCenters()
  }, [])

  const types = Array.from(new Set(scanCenters.map(center => center.type)))

  const filteredScanCenters = scanCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' || center.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan Center Enquiries</h1>
          <p className="text-gray-600">Manage scan center registration enquiries</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">Total: {scanCenters.length} enquiries</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search scan centers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scan Centers List */}
      <div className="grid gap-6">
        {filteredScanCenters.length === 0 ? (
          <div className="text-center py-12">
            <Scan className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scan center enquiries found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'No scan center enquiries have been submitted yet.'}
            </p>
          </div>
        ) : (
          filteredScanCenters.map((center) => (
            <div key={center.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {center.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{center.address}, {center.city}, {center.state} - {center.pincode}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(center.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Coordinates:</span> {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Scans Available:</span> {center.scans.length} scan(s)
                        </div>
                      </div>
                    </div>

                    {/* Location Map Link */}
                    <div className="mt-4">
                      <a
                        href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ScanEnquiries
