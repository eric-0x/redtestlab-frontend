"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Type definitions
interface PrescriptionResponse {
  id: number
  userId: number
  fileUrl: string
  status: string
  assignedToId: number | null
  resultFileUrl: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
}

interface CloudinaryResponse {
  secure_url: string
  [key: string]: any
}

type UploadStatusType = 'success' | 'error' | null

const PrescriptionUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useRouter()

  // Fetch user ID from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10))
    } else {
      // Handle the case when userId is not in localStorage
      setUploadStatus('error')
      setStatusMessage('User not logged in. Please log in to upload prescriptions.')
      // You might want to redirect to login page
      // navigate('/login')
    }
  }, [navigate])

  // Cloudinary configurations
  const CLOUDINARY_UPLOAD_PRESET = 'E-Rickshaw' // You should create this in your Cloudinary dashboard
  const CLOUDINARY_CLOUD_NAME = 'dm8jxispy' // Replace with your actual cloud name
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleBrowseClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Prevent the click from propagating to the parent div
    e.stopPropagation()
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = (file: File): void => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setUploadStatus('error')
      setStatusMessage('Please select an image file')
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error')
      setStatusMessage('File size should be less than 5MB')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    setUploadStatus(null)
    setStatusMessage('')
  }

  const uploadToCloudinary = async (): Promise<void> => {
    if (!selectedFile) return
    
    // Check if userId exists
    if (!userId) {
      setUploadStatus('error')
      setStatusMessage('User not logged in. Please log in to upload prescriptions.')
      return
    }

    setIsUploading(true)
    setUploadStatus(null)
    setStatusMessage('Uploading your prescription...')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      })

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload to Cloudinary')
      }

      const cloudinaryData: CloudinaryResponse = await cloudinaryResponse.json()
      const fileUrl = cloudinaryData.secure_url

      // Upload to your backend API with the userId from localStorage
      const backendResponse = await fetch('https://redtestlab.com/api/prescriptions/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Using the userId from localStorage
          fileUrl: fileUrl
        })
      })

      if (!backendResponse.ok) {
        throw new Error('Failed to save prescription data')
      }

      const prescriptionData: PrescriptionResponse = await backendResponse.json()
      console.log('Prescription uploaded:', prescriptionData)
      
      setUploadStatus('success')
      setStatusMessage('Your prescription has been uploaded successfully!')
      
      // You might want to navigate to a confirmation page or show the prescription details
      // setTimeout(() => navigate(`/prescriptions/${prescriptionData.id}`), 2000)
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setStatusMessage('Failed to upload prescription. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = (): void => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadStatus(null)
    setStatusMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6 mt-8">
        <button 
          className="mr-2 p-1" 
          onClick={() => navigate.push('/')}
          type="button"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">
          Upload Prescription
        </h1>
      </div>

      {!previewUrl ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 min-h-80 cursor-pointer ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Background text starting from top */}
          <div className="absolute inset-0 overflow-hidden p-6">
            <div className="text-xs text-gray-400 leading-relaxed opacity-70">
              <p>
                This study was conducted in the Western Development Region of
                Nepal. The aim of the study was to evaluate the prescription
                patterns and rational prescribing in the private community
                pharmacies of Kavre and Eastern Nepal, using some of the WHO core
                drug use indicators.
              </p>
              <p className="mt-2">
                <strong>Material and Methods</strong>
                <br />
                Five private community pharmacies were selected using stratified
                random sampling. Five hundred patient prescriptions from these
                pharmacies were assessed prospectively for two months from
                September 2017 to February 2018. Information was collected from
                each patient encounter and were recorded directly into a
                prescription indicator form.
              </p>
              <p className="mt-2">
                <strong>Results</strong>
                <br />
                Average number of drugs prescribed per prescription was 2.14
                (n=1830). Percentage of drugs prescribed by generic name and from
                essential drug list was 45.19% (n=827) and 78.14% (n=1430)
                respectively. Percentage of encounters in which antibiotics and
                injections was prescribed were 40.64% (n=366) and 3.44% (n=31)
                respectively.
              </p>
              <p className="mt-2">
                <strong>Conclusion</strong>
              </p>
            </div>
          </div>

          {/* Centered upload UI */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-gray-400 mb-3">
              <Upload size={48} strokeWidth={2.5} />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Drag and Drop here
              </h3>
              <p className="text-gray-500 font-medium mb-2">or</p>
              <button
                className="text-lg text-blue-500 font-bold"
                onClick={handleBrowseClick}
                type="button"
              >
                Browse Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 min-h-80">
          <div className="flex flex-col items-center">
            {/* Image preview */}
            <div className="mb-4 max-w-full max-h-64 overflow-hidden rounded-lg">
              <img 
                src={previewUrl} 
                alt="Prescription preview" 
                className="max-w-full max-h-64 object-contain"
              />
            </div>
            
            {/* File name */}
            <p className="text-gray-700 mb-4">
              {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(2)} KB)
            </p>
            
            {/* Status message */}
            {statusMessage && (
              <div className={`flex items-center mb-4 ${
                uploadStatus === 'error' ? 'text-red-500' : 
                uploadStatus === 'success' ? 'text-green-500' : 'text-blue-500'
              }`}>
                {uploadStatus === 'error' ? <AlertCircle className="mr-2" size={20} /> :
                 uploadStatus === 'success' ? <CheckCircle className="mr-2" size={20} /> :
                 null}
                <span>{statusMessage}</span>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-4">
              {!isUploading && uploadStatus !== 'success' && (
                <>
                  <button
                    onClick={uploadToCloudinary}
                    className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none"
                    disabled={isUploading || !userId}
                    type="button"
                  >
                    Upload Prescription
                  </button>
                  <button
                    onClick={resetUpload}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {isUploading && (
                <div className="flex items-center px-6 py-2 bg-blue-100 text-blue-500 font-medium rounded-md">
                  <Loader className="animate-spin mr-2" size={20} />
                  <span>Uploading...</span>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <>
                  <button
                    onClick={() => navigate.push('/')}
                    className="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none"
                    type="button"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={resetUpload}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none"
                    type="button"
                  >
                    Upload Another
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrescriptionUpload