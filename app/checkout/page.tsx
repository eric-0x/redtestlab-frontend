'use client'

import type React from 'react'
import { useState } from 'react'
import {
  Check,
  CreditCard,
  Home,
  User,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Shield,
  AlertCircle,
  ArrowRight,
  Clock,
  Beaker,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence,Variants } from 'framer-motion'
import rayzor from '../../public/razorpay-icon.svg'
import Image from 'next/image'
// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

const slideVariants: Variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    }
  }
}
// Sample cart item
const cartItem = {
  id: '5',
  title: 'Comprehensive Wellness Package',
  reportTime: 24,
  parameters: 105,
  parametersList: [
    { name: 'Complete Blood Count' },
    { name: 'Liver Function' },
    { name: 'Kidney Function' },
    { name: 'Cardiac Risk' },
    { name: 'Vitamin Panel' }
  ],
  originalPrice: 9500,
  discountedPrice: 2499,
  discountPercentage: 76
}

const HospitalCheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',

    // Address details
    address: '',
    city: '',
    state: '',
    zipCode: '',

    // Appointment details
    appointmentDate: '',
    appointmentTime: '',

    // Payment details
    paymentMethod: 'razorpay'
  })

  // Track form completion status
  const [stepComplete, setStepComplete] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  })

  // Payment status
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})


  // Calculate total price
  const calculateTotal = () => {
    return cartItem.discountedPrice
  }

  const calculateGST = () => {
    return Math.round(calculateTotal() * 0.18)
  }

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateGST()
  }

  // Validate form fields
  const validateForm = (step: number) => {
    const errors: Record<string, string> = {}

    // Still collect errors for display purposes, but don't block progression
    if (step === 1) {
      if (!formData.firstName) errors.firstName = 'First name is required'
      if (!formData.lastName) errors.lastName = 'Last name is required'
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid'
      }
      if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        errors.phone = 'Phone number must be 10 digits'
      }
    } else if (step === 2) {
      // Collect errors but don't block
    } else if (step === 3) {
      // Remove terms acceptance requirement
    }

    setFormErrors(errors)
    return true // Always return true to allow progression
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setCurrentStep(currentStep + 1)
      }, 600)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Always proceed regardless of form validation
    setPaymentStatus('processing')
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setPaymentStatus('success')
      setCurrentStep(4) // Move to success step
    }, 2000)
  }

  // Render step indicators
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-between items-center mb-6 sm:mb-8 px-2 sm:px-4 relative">
        {/* Progress bar */}
        <div className="absolute top-1/3 left-0 h-1 bg-gray-200 w-full -z-10"></div>
        <div
          className="absolute top-1/3 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 -z-10 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex flex-col items-center z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: currentStep >= step ? 1 : 0.9,
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 rounded-full border-2 
                ${
                  currentStep === step
                    ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200'
                    : currentStep > step
                      ? 'border-blue-600 bg-white text-blue-600'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
            >
              {currentStep > step ? (
                <Check className="h-4 w-4 sm:h-6 sm:w-6" />
              ) : (
                step
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xs mt-2 font-medium text-center ${
                currentStep >= step ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {step === 1 && 'Personal Info'}
              {step === 2 && 'Appointment'}
              {step === 3 && 'Payment'}
              {step === 4 && 'Confirmation'}
            </motion.div>
          </div>
        ))}
      </div>
    )
  }

  // Step 1: Personal Information
  const renderPersonalInfoStep = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6 py-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Personal Information
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="Enter your first name"
              />
              {formErrors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.firstName}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="Enter your last name"
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="you@example.com"
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="10-digit mobile number"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
              />
              {formErrors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.dateOfBirth}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.gender ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm appearance-none`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
              {formErrors.gender && (
                <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex justify-end items-center pt-6 mt-8"
        >
          <button
            type="button"
            onClick={handleNextStep}
            disabled={isLoading}
            className="group relative inline-flex items-center px-8 py-3.5 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    )
  }

  // Step 2: Address Information
  const renderAddressStep = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6 py-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Address & Appointment
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                formErrors.address ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
              placeholder="Enter your street address"
            />
            {formErrors.address && (
              <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="relative">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.city ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="City"
              />
              {formErrors.city && (
                <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              State
            </label>
            <div className="relative">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.state ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="State"
              />
              {formErrors.state && (
                <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code
            </label>
            <div className="relative">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                placeholder="ZIP Code"
              />
              {formErrors.zipCode && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.zipCode}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Select Appointment Date & Time
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    formErrors.appointmentDate
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm`}
                />
                {formErrors.appointmentDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.appointmentDate}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Time
              </label>
              <div className="relative">
                <select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    formErrors.appointmentTime
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm appearance-none`}
                >
                  <option value="">Select Time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </div>
                {formErrors.appointmentTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.appointmentTime}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 mt-8"
        >
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={isLoading}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    )
  }

  // Step 3: Payment
  const renderPaymentStep = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-6 py-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-3 mb-6"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Payment Information
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 mb-6 border border-blue-100 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Test in Cart</h3>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h4 className="font-bold text-lg text-gray-800">
                  {cartItem.title}
                </h4>
                <div className="flex flex-wrap items-center mt-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" />
                    <span>Report in {cartItem.reportTime} hours</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Beaker className="h-4 w-4 mr-1 text-blue-500 flex-shrink-0" />
                    <span>{cartItem.parameters} Parameters</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Includes:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {cartItem.parametersList.map((param, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500 flex-shrink-0" />
                        <span>{param.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right mt-4 sm:mt-0">
                <div className="flex flex-col sm:items-end">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{cartItem.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{cartItem.discountedPrice.toLocaleString()}
                  </span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full mt-1">
                    {cartItem.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Payment Method
          </h3>

          <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50 shadow-md mb-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="bg-white p-2 rounded-md mb-3 sm:mb-0 sm:mr-3 h-12 w-32 flex items-center justify-center shadow-sm">
                <Image src={rayzor} alt="Razorpay" className="h-8" />
              </div>
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <p className="font-medium">Razorpay</p>
                <p className="text-sm text-gray-600">
                  Secure payment processing
                </p>
              </div>
              <Check className="text-blue-600 sm:ml-auto" size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Order Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">{cartItem.title}</span>
              <span className="font-medium">
                ₹{cartItem.discountedPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-medium">
                ₹{calculateGST().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{calculateGrandTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={() => {
              setTermsAccepted(!termsAccepted)
              if (formErrors.terms) {
                setFormErrors({
                  ...formErrors,
                  terms: ''
                })
              }
            }}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Terms and Conditions
            </span>{' '}
            and{' '}
            <span className="text-blue-600 hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </label>
        </motion.div>
        {formErrors.terms && (
          <p className="text-red-500 text-xs -mt-4 mb-4">{formErrors.terms}</p>
        )}

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4"
        >
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || paymentStatus === 'processing'}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            {isLoading || paymentStatus === 'processing' ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Payment...
              </div>
            ) : (
              <>
                Pay ₹{calculateGrandTotal().toLocaleString()}
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    )
  }

  // Step 4: Confirmation
  const renderConfirmationStep = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.2
          }}
          className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 mb-6 shadow-lg shadow-green-200"
        >
          <Check className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
        >
          Booking Confirmed!
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-600 mb-8 text-lg"
        >
          Your health checkup appointment has been scheduled successfully.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 max-w-md mx-auto mb-8 border border-blue-100 shadow-md"
        >
          <h3 className="font-bold text-xl text-gray-800 mb-4 text-left">
            Appointment Details
          </h3>
          <div className="space-y-4 text-left">
            <div className="flex">
              <Calendar
                className="text-blue-600 mr-3 flex-shrink-0"
                size={20}
              />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-gray-600">
                  {formData.appointmentDate} at {formData.appointmentTime}
                </p>
              </div>
            </div>
            <div className="flex">
              <User className="text-blue-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">Patient</p>
                <p className="text-gray-600">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
            </div>
            <div className="flex">
              <Home className="text-blue-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">HealthPlus Medical Center</p>
                <p className="text-gray-600">
                  {formData.address}, {formData.city}
                </p>
              </div>
            </div>
            <div className="flex">
              <Beaker className="text-blue-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <p className="font-medium">Test Package</p>
                <p className="text-gray-600">{cartItem.title}</p>
                <p className="text-blue-600 font-medium">
                  ₹{calculateGrandTotal().toLocaleString()} (Paid)
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto mb-8 shadow-sm"
        >
          <div className="flex">
            <AlertCircle
              className="text-yellow-600 mr-3 flex-shrink-0 mt-1"
              size={20}
            />
            <div className="text-left">
              <p className="font-bold text-yellow-800 text-lg">
                Important Instructions
              </p>
              <ul className="text-sm text-yellow-700 list-disc pl-5 mt-2 space-y-1">
                <li>
                  Please arrive 15 minutes before your scheduled appointment
                </li>
                <li>Bring valid ID proof and appointment confirmation</li>
                <li>
                  Fast for 10-12 hours before your appointment (water is
                  allowed)
                </li>
                <li>Bring any previous medical records if available</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          <p className="text-gray-500 mb-6">
            A confirmation email has been sent to {formData.email}
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              Download Appointment Details
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 border border-blue-300 shadow-sm text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Progress steps */}
          <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
            {renderStepIndicators()}
          </div>

          {/* Step content */}
          <div className="p-6">
            <form>
              <AnimatePresence mode="wait" initial={false} custom={currentStep}>
                {currentStep === 1 && renderPersonalInfoStep()}
                {currentStep === 2 && renderAddressStep()}
                {currentStep === 3 && renderPaymentStep()}
                {currentStep === 4 && renderConfirmationStep()}
              </AnimatePresence>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mt-2 flex items-center justify-center">
            <Shield className="text-blue-600 mr-1" size={16} />
            <span>Secure checkout powered by Razorpay</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HospitalCheckoutPage
