"use client"

import { useState } from 'react'
import { Stethoscope, Upload, X, Clock, DollarSign, Users, Phone, Mail, CheckCircle, GraduationCap, Send, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface DoctorFormProps {
  onClose: () => void
}

const DoctorForm = ({ onClose }: DoctorFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    experienceYears: '',
    specialization: '',
    affiliatedHospitalId: '',
    availableDays: [] as string[],
    commission: '',
    consultationFee: '',
    contactEmail: '',
    contactPhone: '',
    fromTime: '',
    gender: '',
    languagesSpoken: [] as string[],
    qualifications: '',
    toTime: '',
    treatmentTags: [] as string[]
  })

  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newLanguage, setNewLanguage] = useState('')
  const [newTreatmentTag, setNewTreatmentTag] = useState('')

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const genders = ['Male', 'Female', 'Other']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'E-Rickshaw')
      
      const response = await fetch('https://api.cloudinary.com/v1_1/dm8jxispy/image/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        imageUrl: data.secure_url
      }))
      
      toast({
        title: "Image Uploaded Successfully!",
        description: "Profile image has been uploaded.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Image upload failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languagesSpoken: [...prev.languagesSpoken, newLanguage.trim()]
      }))
      setNewLanguage('')
    }
  }

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter((_, i) => i !== index)
    }))
  }

  const addTreatmentTag = () => {
    if (newTreatmentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        treatmentTags: [...prev.treatmentTags, newTreatmentTag.trim()]
      }))
      setNewTreatmentTag('')
    }
  }

  const removeTreatmentTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      treatmentTags: prev.treatmentTags.filter((_, i) => i !== index)
    }))
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    toast({
      title: "Processing Registration...",
      description: "Please wait while we process your doctor registration.",
      variant: "default",
    })

    try {
      const response = await fetch('https://redtestlab.com/api/enquiries/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          experienceYears: parseInt(formData.experienceYears) || 0,
          affiliatedHospitalId: parseInt(formData.affiliatedHospitalId) || 0,
          commission: parseFloat(formData.commission) || 0,
          consultationFee: parseFloat(formData.consultationFee) || 0
        })
      })

      if (response.ok) {
        toast({
          title: "🎉 Registration Submitted Successfully!",
          description: "Your doctor registration is pending admin approval. We'll contact you soon.",
          variant: "default",
        })
        setTimeout(() => onClose(), 2000)
      } else {
        const error = await response.json()
        toast({
          title: "Registration Failed",
          description: error.message || 'Registration failed. Please try again.',
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Stethoscope className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Doctor Registration Form
        </h2>
        <p className="text-sm text-gray-600">
          Join our network of healthcare professionals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Profile Image
          </h3>
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer ${
                uploadingImage 
                  ? 'border-blue-400 bg-blue-50' 
                  : formData.imageUrl
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById('doctorImage')?.click()
              }}
            >
              <input
                type="file"
                id="doctorImage"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <div className="flex flex-col items-center">
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                ) : formData.imageUrl ? (
                  <Check className="w-8 h-8 text-green-600 mb-3" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mb-3" />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  {uploadingImage ? 'Uploading image...' : formData.imageUrl ? 'Profile image uploaded' : 'Click to upload profile image'}
                </p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>
            {formData.imageUrl && (
              <div className="relative w-32 h-32 mx-auto group">
                <img src={formData.imageUrl} alt="Doctor" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Qualifications
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications *</label>
            <textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              required
              rows={3}
              placeholder="e.g., MBBS, MD Cardiology"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Languages Spoken
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add language"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addLanguage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.languagesSpoken.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.languagesSpoken.map((language, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hospital Affiliation */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Affiliation</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affiliated Hospital ID *</label>
            <input
              type="number"
              name="affiliatedHospitalId"
              value={formData.affiliatedHospitalId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Operating Hours
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Days *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {days.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="mr-2"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Time *</label>
                <input
                  type="time"
                  name="fromTime"
                  value={formData.fromTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Time *</label>
                <input
                  type="time"
                  name="toTime"
                  value={formData.toTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) *</label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%) *</label>
              <input
                type="number"
                step="0.1"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Treatment Tags */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Tags</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTreatmentTag}
                onChange={(e) => setNewTreatmentTag(e.target.value)}
                placeholder="Add treatment tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addTreatmentTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.treatmentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.treatmentTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTreatmentTag(index)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DoctorForm

