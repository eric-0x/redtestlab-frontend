"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  Copy,
  Check,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  AlertCircle,
  X,
  FileText,
  Shield,
  CreditCard,
  Building,
  GraduationCap,
  Camera,
  Clock,
  Star,
  DollarSign,
  TrendingUp
} from "lucide-react"

interface BCB {
  id: string
  name: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  aadhaarNumber: string
  aadhaarFrontUrl: string | null
  aadhaarBackUrl: string | null
  panNumber: string
  panCardUrl: string | null
  policeVerificationUrl: string | null
  qualificationCertUrl: string | null
  profileImageUrl: string | null
  bankName: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  status: string
  isActive: boolean
  isAvailable: boolean
  rejectionReason: string | null
  verifiedAt: string | null
  totalCollections: number
  rating: number
  totalEarnings: number
  walletBalance: number
  assignedPincodes: string[]
  assignedCities: string[]
  createdAt: string
  updatedAt: string
  approvedByUser: {
    name: string | null
    email: string
  } | null
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface BCBResponse {
  message: string
  bcbs: BCB[]
  pagination: Pagination
}

export default function AllDeliveryBoyManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [bcbs, setBcbs] = useState<BCB[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBcb, setSelectedBcb] = useState<BCB | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({})
  const [resetModal, setResetModal] = useState<{ isOpen: boolean; bcb: BCB | null }>({ isOpen: false, bcb: null })
  const [resetReason, setResetReason] = useState("")
  const [resetting, setResetting] = useState(false)

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

  // Fetch all BCBs (excluding PENDING)
  const fetchBCBs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      if (!token) {
        return
      }

      const response = await fetch("https://redtestlab.com/api/admin/bcb", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch BCB applications")
      }

      const data: BCBResponse = await response.json()
      // Filter out PENDING status BCBs
      const filteredBcbs = data.bcbs.filter(bcb => bcb.status !== "PENDING")
      setBcbs(filteredBcbs)
    } catch (error) {
      console.error("Error fetching BCBs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBCBs()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      APPROVED: { backgroundColor: "hsl(142.1 76.2% 93%)", color: "hsl(142.1 76.2% 20%)" },
      REJECTED: { backgroundColor: "hsl(0 84.2% 93%)", color: "hsl(0 84.2% 20%)" }
    }

    return (
      <Badge style={styles[status as keyof typeof styles]}>
        {status === "APPROVED" ? "Approved" : "Rejected"}
      </Badge>
    )
  }

  const filteredBCBs = bcbs.filter(bcb => {
    const matchesSearch = 
      bcb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bcb.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bcb.phoneNumber.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || bcb.status === statusFilter
    const matchesCity = cityFilter === "all" || bcb.city === cityFilter
    
    return matchesSearch && matchesStatus && matchesCity
  })

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(bcbs.map(bcb => bcb.city))).sort()

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCityFilter("all")
  }

  // Reset wallet function
  const resetWallet = async () => {
    if (!resetModal.bcb || !resetReason.trim()) return

    try {
      setResetting(true)
      const token = localStorage.getItem("adminToken")
      if (!token) throw new Error("Admin token not found")

      const response = await fetch(`https://redtestlab.com/api/wallet/admin/reset-wallet/${resetModal.bcb.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminId: 1, // TODO: Get from admin context
          reason: resetReason
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reset wallet")
      }

      // Refresh BCBs data
      await fetchBCBs()
      
      // Close modal and reset form
      setResetModal({ isOpen: false, bcb: null })
      setResetReason("")
      
      alert(`Wallet reset successfully for ${resetModal.bcb.name}`)
    } catch (error: any) {
      console.error("Error resetting wallet:", error)
      alert(`Failed to reset wallet: ${error.message}`)
    } finally {
      setResetting(false)
    }
  }

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0
    if (searchTerm) count++
    if (statusFilter !== "all") count++
    if (cityFilter !== "all") count++
    return count
  }

  const approvedCount = bcbs.filter(b => b.status === "APPROVED").length
  const rejectedCount = bcbs.filter(b => b.status === "REJECTED").length
  const totalCount = bcbs.length

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: "hsl(222.2 84% 4.9%)", fontSize: "20px" }}>
            <strong>All Delivery Boy Management</strong>
          </h2>
          <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
            Manage approved and rejected Blood Collection Boy applications
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Total BCBs</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {totalCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(221.2 83.2% 93%)" }}
            >
              <UserPlus className="h-6 w-6" style={{ color: "hsl(221.2 83.2% 53.3%)" }} />
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Approved BCBs</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {approvedCount}
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
              <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>Rejected BCBs</p>
              <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                {rejectedCount}
              </p>
            </div>
            <div 
              className="p-3 rounded-lg" 
              style={{ backgroundColor: "hsl(0 84.2% 93%)" }}
            >
              <XCircle className="h-6 w-6" style={{ color: "hsl(0 84.2% 60.2%)" }} />
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
                  placeholder="Search BCBs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
                <span style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  {filteredBCBs.length} BCB{filteredBCBs.length !== 1 ? "s" : ""} found
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

      {/* BCBs Table */}
      <Card 
        className="p-6" 
        style={{ 
          backgroundColor: "hsl(0 0% 100%)", 
          borderColor: "hsl(214.3 31.8% 91.4%)" 
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
            BCB Records
          </h3>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">BCB Details</TableHead>
              <TableHead className="w-[15%]">Contact</TableHead>
              <TableHead className="w-[12%]">Location</TableHead>
              <TableHead className="w-[8%]">Status</TableHead>
              <TableHead className="w-[10%] whitespace-nowrap">Wallet Balance</TableHead>
              <TableHead className="w-[12%]">Date Processed</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBCBs.map((bcb) => (
                <TableRow key={bcb.id}>
                  <TableCell className="w-[20%]">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={bcb.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(bcb.name)}&background=e2e8f0&color=64748b&size=40&rounded=true`} 
                          alt={`${bcb.name} profile`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 bg-gray-50"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bcb.name)}&background=e2e8f0&color=64748b&size=40&rounded=true`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {bcb.name}
                        </p>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                          onClick={() => copyToClipboard(bcb.email, `email-${bcb.id}`)}
                          title="Click to copy email"
                        >
                          <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                            {bcb.email}
                          </p>
                          {copiedItems[`email-${bcb.id}`] ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div>
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                        onClick={() => copyToClipboard(bcb.phoneNumber, `phone-${bcb.id}`)}
                        title="Click to copy phone number"
                      >
                        <p className="text-sm" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                          {bcb.phoneNumber}
                        </p>
                        {copiedItems[`phone-${bcb.id}`] ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        DOB: {bcb.dateOfBirth ? new Date(bcb.dateOfBirth).toLocaleDateString() : "N/A"}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        Gender: {bcb.gender || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-[12%]">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                        {bcb.city}, {bcb.state}
                      </p>
                      <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                        {bcb.pincode}
                      </p>
                      {bcb.assignedCities.length > 0 && (
                        <p className="text-xs" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                          Assigned: {bcb.assignedCities.join(", ")}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[8%]">
                    {getStatusBadge(bcb.status)}
                  </TableCell>
                  <TableCell className="w-[10%]">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        ₹{bcb.walletBalance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[12%]">
                    <span style={{ color: "hsl(222.2 84% 4.9%)" }}>
                      {bcb.verifiedAt ? formatDate(bcb.verifiedAt) : formatDate(bcb.updatedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="w-[15%]">
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBcb(bcb)
                          setShowDetailsModal(true)
                        }}
                        className="transition-all duration-200"
                        style={{ gap: "4px" }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      {bcb.status === "APPROVED" && bcb.walletBalance > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResetModal({ isOpen: true, bcb })
                            setResetReason("")
                          }}
                          className="transition-all duration-200 text-red-600 border-red-200 hover:bg-red-50"
                          style={{ gap: "4px" }}
                        >
                          <XCircle className="h-4 w-4" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && filteredBCBs.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="h-12 w-12 mx-auto mb-4" 
              style={{ color: "hsl(215.4 16.3% 46.9%)" }} />
            <h3 className="font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
              No BCBs found
            </h3>
            <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedBcb && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">BCB Application Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900">{selectedBcb.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedBcb.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900">{selectedBcb.phoneNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-900">{selectedBcb.dateOfBirth ? new Date(selectedBcb.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">{selectedBcb.gender || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBcb.status)}`}>
                      {selectedBcb.status}
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
                    <p className="text-gray-900">{selectedBcb.address || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">{selectedBcb.city}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <p className="text-gray-900">{selectedBcb.state}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <p className="text-gray-900">{selectedBcb.pincode || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Information */}
              {selectedBcb.status === "APPROVED" && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Assignment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Cities</label>
                      <p className="text-gray-900">{selectedBcb.assignedCities.length > 0 ? selectedBcb.assignedCities.join(", ") : "Not assigned"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Pincodes</label>
                      <p className="text-gray-900">{selectedBcb.assignedPincodes.length > 0 ? selectedBcb.assignedPincodes.join(", ") : "Not assigned"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Information */}
              {selectedBcb.status === "REJECTED" && selectedBcb.rejectionReason && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <XCircle className="w-5 h-5 mr-2 text-red-600" />
                    Rejection Information
                  </h4>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-red-700 mb-1">Rejection Reason</label>
                    <p className="text-red-900">{selectedBcb.rejectionReason}</p>
                  </div>
                </div>
              )}

              {/* Identity & Bank Information */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Identity & Bank Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                    <p className="text-gray-900">{selectedBcb.aadhaarNumber || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                    <p className="text-gray-900">{selectedBcb.panNumber || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <p className="text-gray-900">{selectedBcb.bankName || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <p className="text-gray-900">{selectedBcb.accountHolderName || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <p className="text-gray-900">{selectedBcb.accountNumber || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <p className="text-gray-900">{selectedBcb.ifscCode || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedBcb.aadhaarFrontUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Front</label>
                      <img 
                        src={selectedBcb.aadhaarFrontUrl} 
                        alt="Aadhaar Front"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {selectedBcb.aadhaarBackUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Back</label>
                      <img 
                        src={selectedBcb.aadhaarBackUrl} 
                        alt="Aadhaar Back"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {selectedBcb.panCardUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
                      <img 
                        src={selectedBcb.panCardUrl} 
                        alt="PAN Card"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {selectedBcb.profileImageUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      <img 
                        src={selectedBcb.profileImageUrl} 
                        alt="Profile Image"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {selectedBcb.policeVerificationUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Police Verification</label>
                      <img 
                        src={selectedBcb.policeVerificationUrl} 
                        alt="Police Verification"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {selectedBcb.qualificationCertUrl && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Certificate</label>
                      <img 
                        src={selectedBcb.qualificationCertUrl} 
                        alt="Qualification Certificate"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = "<p class=\"text-gray-500 text-sm\">Image not available</p>";
                          }
                        }}
                      />
                    </div>
                  )}
                  {/* Show message if no documents are available */}
                  {!selectedBcb.aadhaarFrontUrl && !selectedBcb.aadhaarBackUrl && !selectedBcb.panCardUrl && !selectedBcb.profileImageUrl && !selectedBcb.policeVerificationUrl && !selectedBcb.qualificationCertUrl && (
                    <div className="col-span-full text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Status */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Application Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                    <p className="text-gray-900">{formatDate(selectedBcb.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processed At</label>
                    <p className="text-gray-900">{selectedBcb.verifiedAt ? formatDate(selectedBcb.verifiedAt) : "Not processed"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processed By</label>
                    <p className="text-gray-900">{selectedBcb.approvedByUser ? selectedBcb.approvedByUser.email : "Not processed"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Is Active</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedBcb.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedBcb.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Reset Wallet Modal */}
      {resetModal.isOpen && resetModal.bcb && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reset Wallet</h3>
              <p className="text-sm text-gray-600 mt-1">
                Reset wallet balance for {resetModal.bcb.name}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Warning</span>
                  </div>
                  <p className="text-sm text-red-700">
                    This will reset the wallet balance from ₹{resetModal.bcb.walletBalance?.toFixed(2) || '0.00'} to ₹0.00
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="resetReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for reset *
                </Label>
                <textarea
                  id="resetReason"
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  placeholder="Enter reason for wallet reset..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setResetModal({ isOpen: false, bcb: null })
                  setResetReason("")
                }}
                disabled={resetting}
              >
                Cancel
              </Button>
              <Button
                onClick={resetWallet}
                disabled={resetting || !resetReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {resetting ? "Resetting..." : "Reset Wallet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
