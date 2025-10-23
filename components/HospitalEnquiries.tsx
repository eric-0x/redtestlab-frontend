"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Calendar, 
  Search, 
  Filter,
  Eye,
  X,
  UserPlus,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react'

interface Hospital {
  id: number
  name: string
  address: string
  city: string
  state: string
  pincode: string
  contactEmail: string
  contactPhone: string
  departments: string[]
  facilities: string[]
  availableDays: string[]
  fromTime: string
  toTime: string
  feeRangeMin: number
  feeRangeMax: number
  commission: number
  isScanProvider: boolean
  treatmentTags: string[]
  enquiryType: string
  createdAt: string
  updatedAt: string
}

interface HospitalEnquiriesResponse {
  message: string
  hospitals: Hospital[]
  count: number
}

const HospitalEnquiries = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({})

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, itemKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => ({ ...prev, [itemKey]: true }))
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, [itemKey]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const fetchHospitals = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("adminToken")
      if (!token) {
        setError("Authentication token not found. Please login.")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'}/api/enquiries/hospital`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch hospital enquiries")
      }

      const result: HospitalEnquiriesResponse = await response.json()
      setHospitals(result.hospitals)
    } catch (err: any) {
      setError(err.message || "Failed to load hospital enquiries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHospitals()
  }, [])

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'scan' && hospital.isScanProvider) ||
                         (filterStatus === 'non-scan' && !hospital.isScanProvider)
    
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

  const getStatusBadge = (isScanProvider: boolean) => {
    const styles = {
      true: { backgroundColor: "hsl(142.1 76.2% 93%)", color: "hsl(142.1 76.2% 20%)" },
      false: { backgroundColor: "hsl(0 84.2% 93%)", color: "hsl(0 84.2% 20%)" }
    }

    return (
      <Badge style={styles[isScanProvider.toString() as keyof typeof styles]}>
        {isScanProvider ? "Scan Provider" : "Non-Scan Provider"}
      </Badge>
    )
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
  }

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0
    if (searchQuery) count++
    if (filterStatus !== "all") count++
    return count
  }

  const scanProviderCount = hospitals.filter(h => h.isScanProvider).length
  const nonScanProviderCount = hospitals.filter(h => !h.isScanProvider).length
  const totalCount = hospitals.length

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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: "hsl(222.2 84% 4.9%)", fontSize: "20px" }}>
            <strong>Hospital Enquiries</strong>
          </h2>
          <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
            Manage hospital registration enquiries
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="p-6" 
          style={{ 
            backgroundColor: "hsl(0 0% 100%)", 
            borderColor: "hsl(214.3 31.8% 91.4%)" 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Total Hospitals</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {totalCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(221.2 83.2% 93%)" }}
            >
              <Building2 className="h-6 w-6" style={{ color: "hsl(221.2 83.2% 53.3%)" }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6" 
          style={{ 
            backgroundColor: "hsl(0 0% 100%)", 
            borderColor: "hsl(214.3 31.8% 91.4%)" 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Scan Providers</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {scanProviderCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(142.1 76.2% 93%)" }}
            >
              <CheckCircle className="h-6 w-6" style={{ color: "hsl(142.1 76.2% 36.3%)" }} />
            </div>
          </div>
        </Card>

        <Card 
          className="p-6" 
          style={{ 
            backgroundColor: "hsl(0 0% 100%)", 
            borderColor: "hsl(214.3 31.8% 91.4%)" 
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Non-Scan Providers</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {nonScanProviderCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(0 84.2% 93%)" }}
            >
              <AlertCircle className="h-6 w-6" style={{ color: "hsl(0 84.2% 60.2%)" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card 
        className="p-6" 
        style={{ 
          backgroundColor: "hsl(0 0% 100%)", 
          borderColor: "hsl(214.3 31.8% 91.4%)" 
        }}
      >
        <div className="space-y-4">
          {/* Search and Primary Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                  style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
                <Input
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  <SelectItem value="scan">Scan Providers</SelectItem>
                  <SelectItem value="non-scan">Non-Scan Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
                <span style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? "s" : ""} found
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="transition-all duration-200"
                style={{ gap: "4px" }}
                disabled={getActiveFilterCount() === 0}
              >
                Clear Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full" style={{ backgroundColor: "hsl(221.2 83.2% 53.3%)", color: "white" }}>
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Hospitals Table */}
      <Card 
        className="p-6" 
        style={{ 
          backgroundColor: "hsl(0 0% 100%)", 
          borderColor: "hsl(214.3 31.8% 91.4%)" 
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
            Hospital Records
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Hospital Details</TableHead>
              <TableHead className="w-[20%]">Contact</TableHead>
              <TableHead className="w-[15%]">Location</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[15%]">Registration Date</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredHospitals.map((hospital) => (
                <TableRow key={hospital.id}>
                  <TableCell className="w-[25%]">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {hospital.name}
                        </p>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                          onClick={() => copyToClipboard(hospital.contactEmail, `email-${hospital.id}`)}
                          title="Click to copy email"
                        >
                          <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                            {hospital.contactEmail}
                          </p>
                          {copiedItems[`email-${hospital.id}`] ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[20%]">
                    <div>
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                        onClick={() => copyToClipboard(hospital.contactPhone, `phone-${hospital.id}`)}
                        title="Click to copy phone number"
                      >
                        <p className="text-sm" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {hospital.contactPhone}
                        </p>
                        {copiedItems[`phone-${hospital.id}`] ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        {hospital.fromTime} - {hospital.toTime}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        ₹{hospital.feeRangeMin} - ₹{hospital.feeRangeMax}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                        {hospital.city}, {hospital.state}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        {hospital.pincode}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%]">
                    {getStatusBadge(hospital.isScanProvider)}
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <span style={{ color: "hsl(222.2 84% 4.9%)" }}>
                      {formatDate(hospital.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedHospital(hospital)
                          setShowDetailsModal(true)
                        }}
                        className="transition-all duration-200"
                        style={{ gap: "4px" }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto mb-4" 
              style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
            <h3 className="font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
              No hospital enquiries found
            </h3>
            <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Hospital Enquiry Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                    <p className="text-gray-900">{selectedHospital.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <p className="text-gray-900">{selectedHospital.contactEmail}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <p className="text-gray-900">{selectedHospital.contactPhone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedHospital.isScanProvider ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedHospital.isScanProvider ? "Scan Provider" : "Non-Scan Provider"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900">{selectedHospital.address}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">{selectedHospital.city}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <p className="text-gray-900">{selectedHospital.state}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <p className="text-gray-900">{selectedHospital.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Operating Hours & Fees */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Operating Hours & Fees
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                    <p className="text-gray-900">{selectedHospital.fromTime} - {selectedHospital.toTime}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Range</label>
                    <p className="text-gray-900">₹{selectedHospital.feeRangeMin} - ₹{selectedHospital.feeRangeMax}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission</label>
                    <p className="text-gray-900">{selectedHospital.commission}%</p>
                  </div>
                </div>
              </div>

              {/* Departments */}
              {selectedHospital.departments.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Departments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.departments.map((dept, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {selectedHospital.facilities.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.facilities.map((facility, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment Tags */}
              {selectedHospital.treatmentTags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Treatment Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHospital.treatmentTags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Days */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Days</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.availableDays.map((day, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Registration Date */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Registration Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                    <p className="text-gray-900">{formatDate(selectedHospital.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedHospital.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalEnquiries
