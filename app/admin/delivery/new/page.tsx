"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Eye, MapPin, Phone, Mail, Calendar, User, AlertCircle, X, FileText, Shield, CreditCard, Building, GraduationCap, Camera, Clock, Star, DollarSign, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BCB {
  id: string
  name: string
  email: string
  phoneNumber: string
  city: string
  state: string
  status: string
  isActive: boolean
  isAvailable: boolean
  totalCollections: number
  rating: number
  totalEarnings: number
  createdAt: string
  verifiedAt: string | null
  approvedByUser: string | null
  // Additional fields that might be present
  address?: string
  pincode?: string
  dateOfBirth?: string
  gender?: string
  aadhaarNumber?: string
  panNumber?: string
  bankName?: string
  accountHolderName?: string
  accountNumber?: string
  ifscCode?: string
  aadhaarFrontUrl?: string
  aadhaarBackUrl?: string
  panCardUrl?: string
  policeVerificationUrl?: string
  qualificationCertUrl?: string
  profileImageUrl?: string
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

export default function BCBManagement() {
  const [bcbs, setBcbs] = useState<BCB[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBcb, setSelectedBcb] = useState<BCB | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [approveData, setApproveData] = useState({
    assignedPincodes: "",
    assignedCities: ""
  })
  const [rejectData, setRejectData] = useState({
    rejectionReason: ""
  })
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBCBs()
  }, [])

  const fetchBCBs = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("adminToken")
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to access this page.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("https://redtestlab.com/api/admin/bcb?status=PENDING", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch BCB applications")
      }

      const data: BCBResponse = await response.json()
      console.log("BCB Data received:", data.bcbs) // Debug log
      setBcbs(data.bcbs)
    } catch (error) {
      console.error("Error fetching BCBs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch BCB applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedBcb) return

    try {
      setProcessing(true)
      const token = localStorage.getItem("adminToken")
      
      const response = await fetch(`https://redtestlab.com/api/admin/bcb/${selectedBcb.id}/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignedPincodes: approveData.assignedPincodes.split(",").map(p => p.trim()),
          assignedCities: approveData.assignedCities.split(",").map(c => c.trim())
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to approve BCB")
      }

      toast({
        title: "Success",
        description: "BCB application approved successfully!",
        variant: "default",
      })

      setShowApproveModal(false)
      setApproveData({ assignedPincodes: "", assignedCities: "" })
      fetchBCBs()
    } catch (error) {
      console.error("Error approving BCB:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve BCB. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedBcb) return

    try {
      setProcessing(true)
        const token = localStorage.getItem("adminToken")
      
      const response = await fetch(`https://redtestlab.com/api/admin/bcb/${selectedBcb.id}/reject`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rejectionReason: rejectData.rejectionReason
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reject BCB")
      }

      toast({
        title: "Success",
        description: "BCB application rejected successfully!",
        variant: "default",
      })

      setShowRejectModal(false)
      setRejectData({ rejectionReason: "" })
      fetchBCBs()
    } catch (error) {
      console.error("Error rejecting BCB:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject BCB. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

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
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: "hsl(222.2 84% 4.9%)", fontSize: "20px" }}>
            <strong>BCB Management</strong>
          </h2>
          <p style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
            Manage Blood Collection Boy applications and approvals
          </p>
        </div>
      </div>



      {/* BCB Applications */}
      <div 
        className="p-6 rounded-lg border" 
        style={{ 
          backgroundColor: "hsl(0 0% 100%)", 
          borderColor: "hsl(214.3 31.8% 91.4%)" 
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium" style={{ color: "hsl(222.2 84% 4.9%)" }}>
            Pending BCB Applications
          </h3>
        </div>

        {bcbs.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Applications</h3>
            <p className="text-gray-500">There are currently no pending BCB applications to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bcbs.map((bcb) => (
            <div key={bcb.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: "hsl(221.2 83.2% 93%)" }}>
                    {bcb.profileImageUrl ? (
                      <img 
                        src={bcb.profileImageUrl} 
                        alt={bcb.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: hsl(221.2 83.2% 93%)"><svg class="w-6 h-6" style="color: hsl(221.2 83.2% 53.3%)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                          }
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6" style={{ color: "hsl(221.2 83.2% 53.3%)" }} />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold" style={{ color: "hsl(222.2 84% 4.9%)" }}>{bcb.name}</h3>
                      <button
                        onClick={() => {
                          setSelectedBcb(bcb)
                          setShowDetailsModal(true)
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>{bcb.email}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bcb.status)}`}>
                  {bcb.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  <Phone className="w-4 h-4 mr-2" />
                  {bcb.phoneNumber}
                </div>
                <div className="flex items-center text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  <MapPin className="w-4 h-4 mr-2" />
                  {bcb.city}, {bcb.state}
                </div>
                <div className="flex items-center text-sm" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Applied: {formatDate(bcb.createdAt)}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedBcb(bcb)
                    setShowApproveModal(true)
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: "hsl(142.1 76.2% 36.3%)",
                    color: "hsl(355.7 100% 97.3%)",
                    gap: "4px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 30%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 36.3%)";
                  }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedBcb(bcb)
                    setShowRejectModal(true)
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: "hsl(0 84.2% 60.2%)",
                    color: "hsl(210 40% 98%)",
                    gap: "4px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(0 84.2% 50%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "hsl(0 84.2% 60.2%)";
                  }}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

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
                    <p className="text-gray-900">{selectedBcb.dateOfBirth || "Not provided"}</p>
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<p class="text-gray-500 text-sm">Image not available</p>';
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verified At</label>
                    <p className="text-gray-900">{selectedBcb.verifiedAt ? formatDate(selectedBcb.verifiedAt) : "Not verified"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved By</label>
                    <p className="text-gray-900">{selectedBcb.approvedByUser || "Not approved"}</p>
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

      {/* Approve Modal */}
      {showApproveModal && selectedBcb && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(222.2 84% 4.9%)" }}>Approve BCB Application</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
              Approving application for <strong>{selectedBcb.name}</strong>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                  Assigned Pincodes (comma-separated)
                </label>
                <input
                  type="text"
                  value={approveData.assignedPincodes}
                  onChange={(e) => setApproveData(prev => ({ ...prev, assignedPincodes: e.target.value }))}
                  placeholder="e.g., 400001, 400002, 400003"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                  Assigned Cities (comma-separated)
                </label>
                <input
                  type="text"
                  value={approveData.assignedCities}
                  onChange={(e) => setApproveData(prev => ({ ...prev, assignedCities: e.target.value }))}
                  placeholder="e.g., Mumbai, Thane, Navi Mumbai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 rounded-md transition-all duration-200"
                style={{
                  backgroundColor: "hsl(214.3 31.8% 91.4%)",
                  color: "hsl(222.2 84% 4.9%)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(214.3 31.8% 85%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(214.3 31.8% 91.4%)";
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={processing || !approveData.assignedPincodes || !approveData.assignedCities}
                className="flex-1 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  backgroundColor: "hsl(142.1 76.2% 36.3%)",
                  color: "hsl(355.7 100% 97.3%)"
                }}
                onMouseEnter={(e) => {
                  if (!processing && approveData.assignedPincodes && approveData.assignedCities) {
                    e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 30%)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processing && approveData.assignedPincodes && approveData.assignedCities) {
                    e.currentTarget.style.backgroundColor = "hsl(142.1 76.2% 36.3%)";
                  }
                }}
              >
                {processing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBcb && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4" style={{ color: "hsl(222.2 84% 4.9%)" }}>Reject BCB Application</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(215.4 16.3% 46.9%)" }}>
              Rejecting application for <strong>{selectedBcb.name}</strong>
            </p>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "hsl(222.2 84% 4.9%)" }}>
                Rejection Reason
              </label>
              <textarea
                value={rejectData.rejectionReason}
                onChange={(e) => setRejectData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 rounded-md transition-all duration-200"
                style={{
                  backgroundColor: "hsl(214.3 31.8% 91.4%)",
                  color: "hsl(222.2 84% 4.9%)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(214.3 31.8% 85%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "hsl(214.3 31.8% 91.4%)";
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectData.rejectionReason.trim()}
                className="flex-1 px-4 py-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  backgroundColor: "hsl(0 84.2% 60.2%)",
                  color: "hsl(210 40% 98%)"
                }}
                onMouseEnter={(e) => {
                  if (!processing && rejectData.rejectionReason.trim()) {
                    e.currentTarget.style.backgroundColor = "hsl(0 84.2% 50%)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!processing && rejectData.rejectionReason.trim()) {
                    e.currentTarget.style.backgroundColor = "hsl(0 84.2% 60.2%)";
                  }
                }}
              >
                {processing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
