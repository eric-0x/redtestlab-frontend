"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Stethoscope, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Calendar, 
  Search, 
  GraduationCap, 
  MapPin,
  Eye,
  X,
  UserPlus,
  Copy,
  Check,
  AlertCircle,
  Building2,
  Languages,
  Star,
  Filter,
  User
} from 'lucide-react'

interface Doctor {
  id: number
  name: string
  imageUrl: string
  experienceYears: number
  specialization: string
  affiliatedHospitalId: number
  availableDays: string[]
  commission: number
  consultationFee: number
  contactEmail: string
  contactPhone: string
  fromTime: string
  gender: string
  languagesSpoken: string[]
  qualifications: string
  toTime: string
  treatmentTags: string[]
  enquiryType: string
  createdAt: string
  updatedAt: string
  affiliatedHospital: {
    id: number
    name: string
    city: string
    state: string
  }
}

interface DoctorEnquiriesResponse {
  message: string
  doctors: Doctor[]
  count: number
}

const DoctorEnquiries = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
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

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("adminToken")
      if (!token) {
        setError("Authentication token not found. Please login.")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://redtestlab.com'}/api/enquiries/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch doctor enquiries")
      }

      const result: DoctorEnquiriesResponse = await response.json()
      setDoctors(result.doctors)
    } catch (err: any) {
      setError(err.message || "Failed to load doctor enquiries.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const specializations = Array.from(new Set(doctors.map(doctor => doctor.specialization)))

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.affiliatedHospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterSpecialization === 'all' || doctor.specialization === filterSpecialization
    
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

  const getSpecializationBadge = (specialization: string) => {
    const colors = {
      'Cardiology': { backgroundColor: "hsl(142.1 76.2% 93%)", color: "hsl(142.1 76.2% 20%)" },
      'Neurology': { backgroundColor: "hsl(221.2 83.2% 93%)", color: "hsl(221.2 83.2% 20%)" },
      'Orthopedics': { backgroundColor: "hsl(0 84.2% 93%)", color: "hsl(0 84.2% 20%)" },
      'Dermatology': { backgroundColor: "hsl(45.4 93.4% 93%)", color: "hsl(45.4 93.4% 20%)" },
      'default': { backgroundColor: "hsl(214.3 31.8% 91.4%)", color: "hsl(214.3 31.8% 46.9%)" }
    }

    const colorScheme = colors[specialization as keyof typeof colors] || colors.default

    return (
      <Badge style={colorScheme}>
        {specialization}
      </Badge>
    )
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setFilterSpecialization("all")
  }

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0
    if (searchQuery) count++
    if (filterSpecialization !== "all") count++
    return count
  }

  const totalCount = doctors.length
  const maleCount = doctors.filter(d => d.gender === 'Male').length
  const femaleCount = doctors.filter(d => d.gender === 'Female').length

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
            <strong>Doctor Enquiries</strong>
          </h2>
          <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
            Manage doctor registration enquiries
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Total Doctors</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {totalCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(221.2 83.2% 93%)" }}
            >
              <Stethoscope className="h-6 w-6" style={{ color: "hsl(221.2 83.2% 53.3%)" }} />
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Male Doctors</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {maleCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(221.2 83.2% 93%)" }}
            >
              <User className="h-6 w-6" style={{ color: "hsl(221.2 83.2% 53.3%)" }} />
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Female Doctors</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {femaleCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(0 84.2% 93%)" }}
            >
              <User className="h-6 w-6" style={{ color: "hsl(0 84.2% 60.2%)" }} />
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
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
                <span style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? "s" : ""} found
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

      {/* Doctors Table */}
      <Card 
        className="p-6" 
        style={{ 
          backgroundColor: "hsl(0 0% 100%)", 
          borderColor: "hsl(214.3 31.8% 91.4%)" 
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
            Doctor Records
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">Doctor Details</TableHead>
              <TableHead className="w-[20%]">Contact</TableHead>
              <TableHead className="w-[15%]">Hospital</TableHead>
              <TableHead className="w-[10%]">Specialization</TableHead>
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
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="w-[25%]">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {doctor.imageUrl ? (
                          <img 
                            src={doctor.imageUrl} 
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 bg-gray-50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=e2e8f0&color=64748b&size=40&rounded=true`;
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {doctor.name}
                        </p>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                          onClick={() => copyToClipboard(doctor.contactEmail, `email-${doctor.id}`)}
                          title="Click to copy email"
                        >
                          <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                            {doctor.contactEmail}
                          </p>
                          {copiedItems[`email-${doctor.id}`] ? (
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
                        onClick={() => copyToClipboard(doctor.contactPhone, `phone-${doctor.id}`)}
                        title="Click to copy phone number"
                      >
                        <p className="text-sm" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {doctor.contactPhone}
                        </p>
                        {copiedItems[`phone-${doctor.id}`] ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        {doctor.fromTime} - {doctor.toTime}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        ₹{doctor.consultationFee} ({doctor.commission}%)
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                        {doctor.affiliatedHospital.name}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        {doctor.affiliatedHospital.city}, {doctor.affiliatedHospital.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%]">
                    {getSpecializationBadge(doctor.specialization)}
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <span style={{ color: "hsl(222.2 84% 4.9%)" }}>
                      {formatDate(doctor.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor)
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

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 mx-auto mb-4" 
              style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
            <h3 className="font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
              No doctor enquiries found
            </h3>
            <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Doctor Enquiry Details</h3>
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
                  <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <p className="text-gray-900">{selectedDoctor.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <p className="text-gray-900">{selectedDoctor.contactEmail}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <p className="text-gray-900">{selectedDoctor.contactPhone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">{selectedDoctor.gender}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900">{selectedDoctor.experienceYears} years</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedDoctor.specialization}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hospital Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Hospital Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliated Hospital</label>
                    <p className="text-gray-900">{selectedDoctor.affiliatedHospital.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedDoctor.affiliatedHospital.city}, {selectedDoctor.affiliatedHospital.state}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                    <p className="text-gray-900">{selectedDoctor.qualifications}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                    <p className="text-gray-900">₹{selectedDoctor.consultationFee}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission</label>
                    <p className="text-gray-900">{selectedDoctor.commission}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Hours</label>
                    <p className="text-gray-900">{selectedDoctor.fromTime} - {selectedDoctor.toTime}</p>
                  </div>
                </div>
              </div>

              {/* Languages */}
              {selectedDoctor.languagesSpoken.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Languages className="w-5 h-5 mr-2 text-blue-600" />
                    Languages Spoken
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.languagesSpoken.map((language, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment Tags */}
              {selectedDoctor.treatmentTags.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Treatment Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.treatmentTags.map((tag, index) => (
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
                  {selectedDoctor.availableDays.map((day, index) => (
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
                    <p className="text-gray-900">{formatDate(selectedDoctor.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{formatDate(selectedDoctor.updatedAt)}</p>
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

export default DoctorEnquiries
