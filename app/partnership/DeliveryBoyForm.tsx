"use client"

import { useState } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Upload, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Clock,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Check
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  name: string
  email: string
  phoneNumber: string
  password: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  pincode: string
  aadhaarNumber: string
  panNumber: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  aadhaarFront: File | null
  aadhaarBack: File | null
  panCard: File | null
  policeVerification: File | null
  qualificationCert: File | null
  profileImage: File | null
}

interface DeliveryBoyFormProps {
  onClose?: () => void
}

const DeliveryBoyForm = ({ onClose }: DeliveryBoyFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhaarNumber: "",
    panNumber: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    policeVerification: null,
    qualificationCert: null,
    profileImage: null
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && currentStep !== totalSteps) {
      e.preventDefault()
      // Don't submit form on Enter key press in input fields unless it's the final step
      return
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    const file = e.target.files?.[0] || null
    
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload only images (JPG, PNG, GIF, WebP) or PDF files.",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive",
        })
        return
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: file
    }))

    // Show success toast for file upload
    toast({
      title: "File Uploaded Successfully!",
      description: `${file?.name || 'File'} has been selected for upload.`,
      variant: "default",
    })
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'E-Rickshaw') // Using the existing upload preset
    
    // Determine the upload endpoint based on file type
    const isImage = file.type.startsWith('image/')
    const endpoint = isImage 
      ? 'https://api.cloudinary.com/v1_1/dm8jxispy/image/upload'
      : 'https://api.cloudinary.com/v1_1/dm8jxispy/raw/upload'
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Failed to upload ${isImage ? 'image' : 'file'}`)
    }
    
    const data = await response.json()
    return data.secure_url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Show loading toast
    toast({
      title: "Processing Application...",
      description: "Please wait while we process your application and upload files.",
      variant: "default",
    })

    try {
      // Upload all files to Cloudinary
      const uploadPromises = []
      const fileFields = ['aadhaarFront', 'aadhaarBack', 'panCard', 'policeVerification', 'qualificationCert', 'profileImage']
      
      for (const field of fileFields) {
        if (formData[field as keyof FormData]) {
          uploadPromises.push(
            uploadToCloudinary(formData[field as keyof FormData] as File).then(url => ({ field, url }))
          )
        }
      }

      if (uploadPromises.length > 0) {
        toast({
          title: "Uploading Files...",
          description: `Uploading ${uploadPromises.length} file(s) to secure storage.`,
          variant: "default",
        })
      }

      const uploadResults = await Promise.all(uploadPromises)
      const urls: Record<string, string> = {}
      uploadResults.forEach(({ field, url }) => {
        urls[`${field}Url`] = url
      })

      if (uploadResults.length > 0) {
        toast({
          title: "Files Uploaded Successfully!",
          description: "All files have been uploaded to secure storage.",
          variant: "default",
        })
      }

      // Prepare the registration data
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        ...urls
      }

      // Show submitting toast
      toast({
        title: "Submitting Application...",
        description: "Sending your application to our servers.",
        variant: "default",
      })

      const response = await fetch("https://redtestlab.com/api/bcb/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to submit application")
      }

      toast({
        title: "🎉 Application Submitted Successfully!",
        description: "Your application is pending admin approval. We'll contact you soon.",
        variant: "default",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        aadhaarNumber: "",
        panNumber: "",
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        policeVerification: null,
        qualificationCert: null,
        profileImage: null
      })

      // Show form reset toast
      toast({
        title: "Form Reset",
        description: "Application form has been cleared for next use.",
        variant: "default",
      })

      // Close modal after 3 seconds
      setTimeout(() => {
        if (onClose) onClose()
      }, 3000)

    } catch (error) {
      console.error("Error submitting form:", error)
      
      let errorTitle = "Error"
      let errorMessage = "Failed to submit application. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to upload")) {
          errorTitle = "File Upload Error"
          errorMessage = "There was an issue uploading your files. Please check your internet connection and try again."
        } else if (error.message.includes("Invalid image file")) {
          errorTitle = "Invalid File Format"
          errorMessage = "One or more files are in an unsupported format. Please use JPG, PNG, or PDF files."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorTitle = "Network Error"
          errorMessage = "Unable to connect to our servers. Please check your internet connection and try again."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                placeholder="Create a password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none text-sm"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                placeholder="Enter pincode"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Identity & Bank Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number *
                </label>
                <input
                  type="text"
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter Aadhaar number"
                />
              </div>
              <div>
                <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number *
                </label>
                <input
                  type="text"
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter PAN number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter account holder name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Front *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.aadhaarFront 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('aadhaarFront')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="aadhaarFront"
                    name="aadhaarFront"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.aadhaarFront ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.aadhaarFront ? formData.aadhaarFront.name : "Upload Aadhaar Front"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Back *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.aadhaarBack 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('aadhaarBack')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="aadhaarBack"
                    name="aadhaarBack"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.aadhaarBack ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.aadhaarBack ? formData.aadhaarBack.name : "Upload Aadhaar Back"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Card *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.panCard 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('panCard')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="panCard"
                    name="panCard"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.panCard ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.panCard ? formData.panCard.name : "Upload PAN Card"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image *
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.profileImage 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('profileImage')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.profileImage ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.profileImage ? formData.profileImage.name : "Upload Profile Image"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Police Verification
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.policeVerification 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('policeVerification')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="policeVerification"
                    name="policeVerification"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.policeVerification ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <Shield className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.policeVerification ? formData.policeVerification.name : "Upload Police Verification"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification Certificate
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                    formData.qualificationCert 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.getElementById('qualificationCert')?.click()
                  }}
                >
                  <input
                    type="file"
                    id="qualificationCert"
                    name="qualificationCert"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    {formData.qualificationCert ? (
                      <Check className="w-6 h-6 text-green-600 mb-2" />
                    ) : (
                      <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    )}
                    <p className="text-xs text-gray-600">
                      {formData.qualificationCert ? formData.qualificationCert.name : "Upload Qualification Cert"}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Truck className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Blood Collection Boy Application
        </h2>
        <p className="text-sm text-gray-600">
          Join our team and help us provide excellent healthcare services
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Previous
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Additional Info */}
      {/* <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">What happens next?</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• We'll review your application within 2-3 business days</li>
          <li>• If selected, we'll contact you for an interview</li>
          <li>• Successful candidates will receive training and onboarding</li>
        </ul>
      </div> */}
    </div>
  )
}

export default DeliveryBoyForm
