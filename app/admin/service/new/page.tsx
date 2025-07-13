"use client"

import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Upload, AlertCircle, X } from 'lucide-react';

// Type definitions for the component
type ServiceProvider = {
  email: string;
  password: string;
  labName: string;
  registrationNumber: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  servicesOffered: string[];
  testsAvailable: string[];
  homeCollection: boolean;
  appointmentBooking: boolean;
  emergencyTestFacility: boolean;
  reportDeliveryMethods: string[];
  homeCollectionCharges: number;
  minimumOrderValue: number;
  reportGenerationTime: string;
  paymentModesAccepted: string[];
  commissionPercentage: number;
  gstNumber: string;
  licenseUrl: string;
  ownerIdProofUrl: string;
  labImagesUrls: string[];
};

// Initial form state
const initialFormData: ServiceProvider = {
  email: '',
  password: '',
  labName: '',
  registrationNumber: '',
  ownerName: '',
  contactNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  latitude: 0,
  longitude: 0,
  openingTime: '',
  closingTime: '',
  operatingDays: [],
  servicesOffered: [],
  testsAvailable: [],
  homeCollection: false,
  appointmentBooking: false,
  emergencyTestFacility: false,
  reportDeliveryMethods: [],
  homeCollectionCharges: 0,
  minimumOrderValue: 0,
  reportGenerationTime: '',
  paymentModesAccepted: [],
  commissionPercentage: 0,
  gstNumber: '',
  licenseUrl: '',
  ownerIdProofUrl: '',
  labImagesUrls: [],
};

// Form steps
const formSteps = [
  { title: 'Basic Info', description: 'Account and general information' },
  { title: 'Location', description: 'Address and geographical details' },
  { title: 'Operating Hours', description: 'Working hours and days' },
  { title: 'Services', description: 'Services and tests offered' },
  { title: 'Policies', description: 'Collection and payment policies' },
  { title: 'Documents', description: 'Upload required documents' },
];

const CLOUDINARY_UPLOAD_PRESET = 'E-Rickshaw';
const CLOUDINARY_CLOUD_NAME = 'dm8jxispy';

const ServiceProviderManagement: React.FC = () => {
  const [formData, setFormData] = useState<ServiceProvider>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload file');
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: keyof ServiceProvider) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  // Handle multi-select change
  const handleMultiSelectChange = (field: keyof ServiceProvider, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value],
        };
      }
    });
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ServiceProvider) => {
    const file = e.target.files?.[0];
    
    if (file) {
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        
        if (field === 'labImagesUrls') {
          setFormData((prev) => ({
            ...prev,
            labImagesUrls: [...prev.labImagesUrls, uploadedUrl],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [field]: uploadedUrl,
          }));
        }
      } catch (error) {
        setNotification({
          show: true,
          message: 'Failed to upload file. Please try again.',
          type: 'error',
        });
      }
    }
  };

  // Remove lab image
  const removeLabImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      labImagesUrls: prev.labImagesUrls.filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
      
      if (!formData.labName) newErrors.labName = 'Lab name is required';
      if (!formData.registrationNumber) newErrors.registrationNumber = 'Registration number is required';
      if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
      if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    }
    
    if (step === 1) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    }
    
    if (step === 2) {
      if (!formData.openingTime) newErrors.openingTime = 'Opening time is required';
      if (!formData.closingTime) newErrors.closingTime = 'Closing time is required';
      if (formData.operatingDays.length === 0) newErrors.operatingDays = 'At least one operating day is required';
    }
    
    if (step === 3) {
      if (formData.servicesOffered.length === 0) newErrors.servicesOffered = 'At least one service is required';
      if (formData.testsAvailable.length === 0) newErrors.testsAvailable = 'At least one test is required';
    }
    
    if (step === 4) {
      if (formData.reportDeliveryMethods.length === 0) newErrors.reportDeliveryMethods = 'At least one delivery method is required';
      if (formData.paymentModesAccepted.length === 0) newErrors.paymentModesAccepted = 'At least one payment mode is required';
      if (!formData.reportGenerationTime) newErrors.reportGenerationTime = 'Report generation time is required';
    }
    
    if (step === 5) {
      if (!formData.licenseUrl) newErrors.licenseUrl = 'License document is required';
      if (!formData.ownerIdProofUrl) newErrors.ownerIdProofUrl = 'Owner ID proof is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = true;
    for (let i = 0; i < formSteps.length; i++) {
      if (!validateStep(i)) {
        isValid = false;
        setCurrentStep(i);
        break;
      }
    }
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('https://redtestlab.com/api/auth/service/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus('success');
        setNotification({
          show: true,
          message: 'Service provider registered successfully!',
          type: 'success',
        });
        
        setTimeout(() => {
          setFormData(initialFormData);
          setCurrentStep(0);
        }, 3000);
      } else {
        setSubmitStatus('error');
        setNotification({
          show: true,
          message: data.message || 'Registration failed. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      setSubmitStatus('error');
      setNotification({
        show: true,
        message: 'Network error. Please check your connection and try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  // Close notification
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  // Render form based on current step
  const renderForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="labName" className="block text-sm font-medium text-gray-700">
                Lab/Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="labName"
                name="labName"
                value={formData.labName}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.labName ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                required
              />
              {errors.labName && <p className="mt-1 text-sm text-red-500">{errors.labName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.registrationNumber ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.registrationNumber && <p className="mt-1 text-sm text-red-500">{errors.registrationNumber}</p>}
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.ownerName ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                required
              />
              {errors.contactNumber && <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>}
            </div>

            <div>
              <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                GST Number
              </label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`mt-1 block w-full rounded-md border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                required
              />
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude || ''}
                  onChange={handleInputChange}
                  step="0.0001"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude || ''}
                  onChange={handleInputChange}
                  step="0.0001"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700">
                  Opening Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="openingTime"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 08:00 AM"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.openingTime ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.openingTime && <p className="mt-1 text-sm text-red-500">{errors.openingTime}</p>}
              </div>

              <div>
                <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700">
                  Closing Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="closingTime"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 08:00 PM"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.closingTime ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                  required
                />
                {errors.closingTime && <p className="mt-1 text-sm text-red-500">{errors.closingTime}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operating Days <span className="text-red-500">*</span>
              </label>
              {errors.operatingDays && <p className="mt-1 text-sm text-red-500">{errors.operatingDays}</p>}
              
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <label key={day} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.operatingDays.includes(day)}
                      onChange={() => handleMultiSelectChange('operatingDays', day)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Services Offered <span className="text-red-500">*</span>
              </label>
              {errors.servicesOffered && <p className="mt-1 text-sm text-red-500">{errors.servicesOffered}</p>}
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {['Blood Test', 'X-Ray', 'ECG', 'MRI', 'CT Scan', 'Ultrasound', 'Other'].map((service) => (
                  <label key={service} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.servicesOffered.includes(service)}
                      onChange={() => handleMultiSelectChange('servicesOffered', service)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tests Available <span className="text-red-500">*</span>
              </label>
              {errors.testsAvailable && <p className="mt-1 text-sm text-red-500">{errors.testsAvailable}</p>}
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {['CBC', 'Lipid Profile', 'Thyroid Panel', 'Liver Function', 'Kidney Function', 'Diabetes', 'Other'].map((test) => (
                  <label key={test} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.testsAvailable.includes(test)}
                      onChange={() => handleMultiSelectChange('testsAvailable', test)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-700">{test}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.homeCollection}
                  onChange={() => handleCheckboxChange('homeCollection')}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-2 text-gray-700">Home Collection</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.appointmentBooking}
                  onChange={() => handleCheckboxChange('appointmentBooking')}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-2 text-gray-700">Appointment Booking</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.emergencyTestFacility}
                  onChange={() => handleCheckboxChange('emergencyTestFacility')}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-2 text-gray-700">Emergency Test Facility</span>
              </label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Delivery Methods <span className="text-red-500">*</span>
              </label>
              {errors.reportDeliveryMethods && <p className="mt-1 text-sm text-red-500">{errors.reportDeliveryMethods}</p>}
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {['Email', 'Physical Copy', 'Online Portal', 'WhatsApp', 'SMS'].map((method) => (
                  <label key={method} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.reportDeliveryMethods.includes(method)}
                      onChange={() => handleMultiSelectChange('reportDeliveryMethods', method)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Modes Accepted <span className="text-red-500">*</span>
              </label>
              {errors.paymentModesAccepted && <p className="mt-1 text-sm text-red-500">{errors.paymentModesAccepted}</p>}
              
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {['Cash', 'Card', 'UPI', 'Net Banking', 'Wallet'].map((mode) => (
                  <label key={mode} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.paymentModesAccepted.includes(mode)}
                      onChange={() => handleMultiSelectChange('paymentModesAccepted', mode)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                    />
                    <span className="ml-2 text-sm text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="homeCollectionCharges" className="block text-sm font-medium text-gray-700">
                  Home Collection Charges
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="homeCollectionCharges"
                    name="homeCollectionCharges"
                    value={formData.homeCollectionCharges || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="minimumOrderValue" className="block text-sm font-medium text-gray-700">
                  Minimum Order Value
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="minimumOrderValue"
                    name="minimumOrderValue"
                    value={formData.minimumOrderValue || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="commissionPercentage" className="block text-sm font-medium text-gray-700">
                  Commission Percentage
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="commissionPercentage"
                    name="commissionPercentage"
                    value={formData.commissionPercentage || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    className="mt-1 block w-full rounded-md border border-gray-300 pr-7 px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="reportGenerationTime" className="block text-sm font-medium text-gray-700">
                Report Generation Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="reportGenerationTime"
                name="reportGenerationTime"
                value={formData.reportGenerationTime}
                onChange={handleInputChange}
                placeholder="e.g., 24 Hours"
                className={`mt-1 block w-full rounded-md border ${
                  errors.reportGenerationTime ? 'border-red-500' : 'border-gray-300'
                } px-3 py-2 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors duration-200`}
                required
              />
              {errors.reportGenerationTime && <p className="mt-1 text-sm text-red-500">{errors.reportGenerationTime}</p>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="licenseUrl" className="block text-sm font-medium text-gray-700">
                Upload License Document <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <label className="flex-1">
                  <div className="relative cursor-pointer bg-white rounded-md border border-gray-300 px-3 py-2 shadow-sm hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <span className="flex items-center justify-center text-sm text-gray-500">
                      <Upload className="h-5 w-5 mr-2 text-blue-600" />
                      {formData.licenseUrl ? 'Replace document' : 'Upload document'}
                    </span>
                    <input
                      id="licenseUrl"
                      name="licenseUrl"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, 'licenseUrl')}
                      required={!formData.licenseUrl}
                    />
                  </div>
                </label>
                {formData.licenseUrl && (
                  <a
                    href={formData.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    View uploaded file
                  </a>
                )}
              </div>
              {errors.licenseUrl && <p className="mt-1 text-sm text-red-500">{errors.licenseUrl}</p>}
            </div>

            <div>
              <label htmlFor="ownerIdProofUrl" className="block text-sm font-medium text-gray-700">
                Upload Owner ID Proof <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <label className="flex-1">
                  <div className="relative cursor-pointer bg-white rounded-md border border-gray-300 px-3 py-2 shadow-sm hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <span className="flex items-center justify-center text-sm text-gray-500">
                      <Upload className="h-5 w-5 mr-2 text-blue-600" />
                      {formData.ownerIdProofUrl ? 'Replace document' : 'Upload document'}
                    </span>
                    <input
                      id="ownerIdProofUrl"
                      name="ownerIdProofUrl"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, 'ownerIdProofUrl')}
                      required={!formData.ownerIdProofUrl}
                    />
                  </div>
                </label>
                {formData.ownerIdProofUrl && (
                  <a
                    href={formData.ownerIdProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    View uploaded file
                  </a>
                )}
              </div>
              {errors.ownerIdProofUrl && <p className="mt-1 text-sm text-red-500">{errors.ownerIdProofUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lab Images</label>
              <div className="mt-1">
                <label className="block">
                  <div className="relative cursor-pointer bg-white rounded-md border border-gray-300 px-3 py-2 shadow-sm hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <span className="flex items-center justify-center text-sm text-gray-500">
                      <Upload className="h-5 w-5 mr-2 text-blue-600" />
                      Upload lab images
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileChange(e, 'labImagesUrls')}
                      accept="image/*"
                    />
                  </div>
                </label>
              </div>
              {formData.labImagesUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.labImagesUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-gray-300">
                      <img
                        src={url}
                        alt={`Lab image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-600 text-white p-4 md:p-6 rounded-t-lg">
          <h2 className="text-xl md:text-2xl font-semibold">Service Provider Registration</h2>
          <p className="text-blue-100 mt-1">Register your lab or diagnostic center to join our network</p>
        </div>
        
        {/* Progress steps */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4 sm:px-6">
            <nav className="flex justify-center">
              <ol className="flex items-center space-x-4 md:space-x-8">
                {formSteps.map((step, index) => (
                  <li key={index} className="flex items-center">
                    <div 
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep > index 
                          ? 'bg-blue-600 text-white' 
                          : currentStep === index 
                            ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600' 
                            : 'bg-gray-100 text-gray-400'
                      } transition-colors duration-200`}
                    >
                      {currentStep > index ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium hidden md:block ${
                      currentStep >= index ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mt-2 text-center text-sm text-gray-500 md:hidden">
              Step {currentStep + 1}: {formSteps[currentStep].title}
            </p>
            <p className="mt-1 text-center text-xs text-gray-400">
              {formSteps[currentStep].description}
            </p>
          </div>
        </div>
        
        {/* Form */}
        <div className="bg-white shadow-md rounded-b-lg p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            {renderForm()}
            
            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                } transition-colors duration-200`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              {currentStep < formSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition-colors duration-200`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Notification */}
        {notification.show && (
          <div 
            className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
            } transition-all duration-300 transform translate-y-0 opacity-100`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={closeNotification}
                    className={`inline-flex rounded-md p-1.5 ${
                      notification.type === 'success' 
                        ? 'text-green-500 hover:bg-green-100' 
                        : 'text-red-500 hover:bg-red-100'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      notification.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                    }`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderManagement;