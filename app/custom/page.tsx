"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, CreditCard, Package, TestTube, Clock, Users, CheckCircle, Sparkles } from "lucide-react"

// Custom icons
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
)

// Types
interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: "PACKAGE" | "TEST"
  category: {
    id: number
    name: string
  }
}

interface Test {
  id: number
  name: string
  desc: string
  reportIn: string
  testCount: string
  price: string
  discountedPrice: string
  categoryName: string
}

interface SelectedItem {
  id: number
  name: string
  price: number
  discountedPrice: number
  type: "product" | "test"
  reportTime?: number
  testCount?: string
  category?: string
}

interface CustomPackage {
  id?: number
  name: string
  items: Array<{ productId?: number; testId?: number }>
}

interface Member {
  id: number
  name: string
  email?: string
  phoneNumber?: string
  gender: string
  dateOfBirth: string
  age: number
  relation: string
}

interface Address {
  id: number
  name: string
  addressLine: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

// Razorpay interface
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayInstance {
  open: () => void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

// Enhanced notification component
interface NotificationProps {
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error" | "info" | "warning"
}

const Notification = ({ title, message, isVisible, onClose, type = "success" }: NotificationProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-500",
          icon: <CheckIcon />,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-pink-500",
          icon: <CloseIcon />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
        }
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
          icon: <AlertTriangleIcon />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-sky-500 to-indigo-500",
          icon: <InfoIcon />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        }
    }
  }

  const styles = getStyles()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`h-1 ${styles.bg} w-full`} />
          <div className="p-4">
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}
              >
                <div className={styles.iconColor}>{styles.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 ml-4 flex-shrink-0 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Enhanced button component
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
  variant?: "primary" | "secondary" | "danger" | "success" | "outline"
  disabled?: boolean
  isLoading?: boolean
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  fullWidth?: boolean
}

const CustomButton = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  isLoading = false,
  size = "md",
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles =
    "relative flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed"

  const sizeStyles = {
    xs: "py-1.5 px-3 text-xs",
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
    xl: "py-5 px-10 text-xl",
  }

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-sky-200/20 focus:ring-sky-500 disabled:from-slate-400 disabled:to-slate-500",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-sm focus:ring-slate-500 disabled:bg-slate-100 disabled:text-slate-400",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:shadow-red-200/20 focus:ring-red-500 disabled:from-slate-400 disabled:to-slate-500",
    success:
      "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:shadow-green-200/20 focus:ring-green-500 disabled:from-slate-400 disabled:to-slate-500",
    outline:
      "bg-transparent hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-2 border-slate-300 hover:border-slate-400 focus:ring-slate-500 disabled:bg-slate-50 disabled:text-slate-400",
  }

  const widthStyles = fullWidth ? "w-full" : ""
  const disabledStyles = disabled || isLoading ? "opacity-60" : ""

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
    >
      {/* Shine effect overlay for primary buttons */}
      {(variant === "primary" || variant === "success" || variant === "danger") && !disabled && !isLoading && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {typeof children === "string" ? "Processing..." : children}
          </>
        ) : (
          children
        )}
      </div>
    </button>
  )
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "info" | "warning"
  isLoading?: boolean
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmationModalProps) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangleIcon />
      case "warning":
        return <AlertTriangleIcon />
      default:
        return <InfoIcon />
    }
  }

  const getIconStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-100 text-red-600"
      case "warning":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-blue-100 text-blue-600"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getIconStyles()}`}>
                  {getIcon()}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
              <div className="flex gap-3">
                <CustomButton onClick={onClose} variant="secondary" className="flex-1" size="sm" disabled={isLoading}>
                  {cancelText}
                </CustomButton>
                <CustomButton
                  onClick={onConfirm}
                  variant={type === "danger" ? "danger" : "primary"}
                  className="flex-1"
                  size="sm"
                  isLoading={isLoading}
                >
                  {confirmText}
                </CustomButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Stepper Component
interface StepperProps {
  currentStep: number
  steps: { title: string; icon: React.ReactNode }[]
}

const Stepper = ({ currentStep, steps }: StepperProps) => {
  return (
    <div className="flex items-center justify-center mb-8 px-4">
      <div className="flex items-center max-w-3xl w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  index < currentStep
                    ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200/50"
                    : index === currentStep
                      ? "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-200/50"
                      : "bg-white border-slate-300 text-slate-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {index < currentStep ? <CheckIcon /> : step.icon}
              </motion.div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium text-center transition-colors duration-300 ${
                  index <= currentStep ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-all duration-500 ${
                  index < currentStep ? "bg-green-500" : "bg-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Member Form Component
interface MemberFormProps {
  onSubmit: (member: Omit<Member, "id">) => void
  onCancel: () => void
  isLoading: boolean
  editMember?: Member | null
}

const MemberForm = ({ onSubmit, onCancel, isLoading, editMember }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    name: editMember?.name || "",
    email: editMember?.email || "",
    phoneNumber: editMember?.phoneNumber || "",
    gender: editMember?.gender || "",
    dateOfBirth: editMember?.dateOfBirth || "",
    relation: editMember?.relation || "",
  })

  const handleSubmit = () => {
    // Calculate age from dateOfBirth
    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    onSubmit({
      ...formData,
      age,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <UserIcon />
        <span className="ml-2">{editMember ? "Edit" : "Add"} Family Member</span>
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Relation *</label>
            <select
              required
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value="">Select relation</option>
              <option value="Self">Self</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Grandfather">Grandfather</option>
              <option value="Grandmother">Grandmother</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender *</label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth *</label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter email (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter phone number (optional)"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <CustomButton onClick={handleSubmit} isLoading={isLoading} className="flex-1" size="lg">
            {editMember ? "Update" : "Add Member"}
          </CustomButton>
          <CustomButton onClick={onCancel} variant="secondary" className="flex-1" size="lg">
            Cancel
          </CustomButton>
        </div>
      </form>
    </motion.div>
  )
}

// Address Form Component
interface AddressFormProps {
  onSubmit: (address: Omit<Address, "id">) => void
  onCancel: () => void
  isLoading: boolean
  editAddress?: Address | null
}

const AddressForm = ({ onSubmit, onCancel, isLoading, editAddress }: AddressFormProps) => {
  const [formData, setFormData] = useState({
    name: editAddress?.name || "",
    addressLine: editAddress?.addressLine || "",
    city: editAddress?.city || "",
    state: editAddress?.state || "",
    pincode: editAddress?.pincode || "",
    landmark: editAddress?.landmark || "",
  })

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
    >
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <MapPinIcon />
        <span className="ml-2">{editAddress ? "Edit" : "Add"} Address</span>
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="e.g., Home, Office, Clinic"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode *</label>
            <input
              type="text"
              required
              pattern="[0-9]{6}"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Address Line *</label>
          <textarea
            required
            value={formData.addressLine}
            onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
            placeholder="Enter complete address with house/flat number, street name"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">City *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">State *</label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Enter state name"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Landmark</label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            placeholder="Enter nearby landmark (optional)"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <CustomButton onClick={handleSubmit} isLoading={isLoading} className="flex-1" size="lg">
            {editAddress ? "Update" : "Add Address"}
          </CustomButton>
          <CustomButton onClick={onCancel} variant="secondary" className="flex-1" size="lg">
            Cancel
          </CustomButton>
        </div>
      </form>
    </motion.div>
  )
}

const CustomPackage: React.FC = () => {
  // Existing states
  const [products, setProducts] = useState<Product[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [packageName, setPackageName] = useState("")
  const [createdPackage, setCreatedPackage] = useState<CustomPackage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"products" | "tests">("products")
  const [buyNowLoading, setBuyNowLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // New states for enhanced functionality
  const [currentStep, setCurrentStep] = useState(0)
  const [members, setMembers] = useState<Member[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [memberLoading, setMemberLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean
    type: "member" | "address"
    item: Member | Address | null
    loading: boolean
  }>({ show: false, type: "member", item: null, loading: false })

  // Coupon states - using the same approach as cart
  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")
  const [originalTotal, setOriginalTotal] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountedTotal, setDiscountedTotal] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id?: number
    code: string
    discountType?: string
    discountValue?: number
    minimumAmount?: number | null
    expiresAt?: string | null
    usageLimit?: number | null
  } | null>(null)

  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  })

  const BASE_URL = "https://redtestlab.com"

  const steps = [
    { title: "Create Package", icon: <Package className="w-5 h-5" /> },
    { title: "Member & Address", icon: <UserIcon /> },
    { title: "Payment", icon: <CreditCard className="w-5 h-5" /> },
  ]

  useEffect(() => {
    fetchProducts()
    fetchTests()
    loadRazorpayScript()
  }, [])

  // Load members and addresses when step changes to 1
  useEffect(() => {
    if (currentStep === 1) {
      loadMembers()
      loadAddresses()
    }
  }, [currentStep])

  // Update totals when selected items change
  useEffect(() => {
    const total = getTotalPrice()
    setOriginalTotal(total)
    if (!appliedCoupon) {
      setDiscountedTotal(total)
    } else {
      // Recalculate discount when items change
      let newDiscountAmount = 0
      if (appliedCoupon.discountType === "percentage" && appliedCoupon.discountValue) {
        newDiscountAmount = total * (appliedCoupon.discountValue / 100)
      } else if (appliedCoupon.discountType === "fixed" && appliedCoupon.discountValue) {
        newDiscountAmount = appliedCoupon.discountValue
      }
      setDiscountAmount(newDiscountAmount)
      setDiscountedTotal(Math.max(0, total - newDiscountAmount))
    }
  }, [selectedItems, appliedCoupon])

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        setRazorpayLoaded(true)
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true

      script.onload = () => {
        console.log("Razorpay script loaded successfully")
        setRazorpayLoaded(true)
        resolve(true)
      }

      script.onerror = () => {
        console.error("Failed to load Razorpay script")
        setRazorpayLoaded(false)
        reject(new Error("Failed to load Razorpay script"))
      }

      document.body.appendChild(script)
    })
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/product`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        console.log("Products fetched:", data.length)
      } else {
        console.error("Failed to fetch products:", response.status)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to fetch products")
    }
  }

  const fetchTests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/tests`)
      if (response.ok) {
        const data = await response.json()
        setTests(data)
        console.log("Tests fetched:", data.length)
      } else {
        console.error("Failed to fetch tests:", response.status)
      }
    } catch (error) {
      console.error("Error fetching tests:", error)
      setError("Failed to fetch tests")
    }
  }

  const getUserId = () => {
    return localStorage.getItem("userId") || "3"
  }

  const loadMembers = async () => {
    try {
      const userId = getUserId()
      const response = await fetch(`${BASE_URL}/api/bookings/members/${userId}`)
      const data = await response.json()

      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error("Error loading members:", error)
      showNotification("Error", "Failed to load family members", "error")
    }
  }

  const loadAddresses = async () => {
    try {
      const userId = getUserId()
      const response = await fetch(`${BASE_URL}/api/bookings/addresses/${userId}`)
      const data = await response.json()

      if (data.success) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
      showNotification("Error", "Failed to load addresses", "error")
    }
  }

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      setMemberLoading(true)
      const userId = getUserId()

      const response = await fetch(`${BASE_URL}/api/bookings/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number.parseInt(userId),
          ...memberData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMembers([...members, data.member])
        setShowMemberForm(false)
        showNotification("Member Added", "Family member has been added successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to add member")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to add member", "error")
    } finally {
      setMemberLoading(false)
    }
  }

  const handleEditMember = async (memberData: Omit<Member, "id">) => {
    if (!editingMember) return

    try {
      setMemberLoading(true)

      const response = await fetch(`${BASE_URL}/api/bookings/members/${editingMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const data = await response.json()

      if (data.success) {
        setMembers(members.map((m) => (m.id === editingMember.id ? data.member : m)))
        setSelectedMembers(selectedMembers.map((m) => (m.id === editingMember.id ? data.member : m)))
        setEditingMember(null)
        setShowMemberForm(false)
        showNotification("Member Updated", "Family member has been updated successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to update member")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to update member", "error")
    } finally {
      setMemberLoading(false)
    }
  }

  const handleDeleteMember = async (member: Member) => {
    try {
      setDeleteConfirmation((prev) => ({ ...prev, loading: true }))

      const response = await fetch(`${BASE_URL}/api/bookings/members/${member.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setMembers(members.filter((m) => m.id !== member.id))
        setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))
        showNotification("Member Deleted", "Family member has been deleted successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to delete member")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to delete member", "error")
    } finally {
      setDeleteConfirmation((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleAddAddress = async (addressData: Omit<Address, "id">) => {
    try {
      setAddressLoading(true)
      const userId = getUserId()

      const response = await fetch(`${BASE_URL}/api/bookings/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number.parseInt(userId),
          ...addressData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAddresses([...addresses, data.address])
        setShowAddressForm(false)
        showNotification("Address Added", "Address has been added successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to add address")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to add address", "error")
    } finally {
      setAddressLoading(false)
    }
  }

  const handleEditAddress = async (addressData: Omit<Address, "id">) => {
    if (!editingAddress) return

    try {
      setAddressLoading(true)

      const response = await fetch(`${BASE_URL}/api/bookings/addresses/${editingAddress.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      })

      const data = await response.json()

      if (data.success) {
        setAddresses(addresses.map((a) => (a.id === editingAddress.id ? data.address : a)))
        if (selectedAddress?.id === editingAddress.id) {
          setSelectedAddress(data.address)
        }
        setEditingAddress(null)
        setShowAddressForm(false)
        showNotification("Address Updated", "Address has been updated successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to update address")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to update address", "error")
    } finally {
      setAddressLoading(false)
    }
  }

  const handleDeleteAddress = async (address: Address) => {
    try {
      setDeleteConfirmation((prev) => ({ ...prev, loading: true }))

      const response = await fetch(`${BASE_URL}/api/bookings/addresses/${address.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setAddresses(addresses.filter((a) => a.id !== address.id))
        if (selectedAddress?.id === address.id) {
          setSelectedAddress(null)
        }
        showNotification("Address Deleted", "Address has been deleted successfully.", "success")
      } else {
        throw new Error(data.error || "Failed to delete address")
      }
    } catch (error) {
      showNotification("Error", error instanceof Error ? error.message : "Failed to delete address", "error")
    } finally {
      setDeleteConfirmation((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleMemberSelection = (member: Member) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id)

    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))
    } else {
      setSelectedMembers([...selectedMembers, member])
    }
  }

  const handleAddressSelection = (address: Address) => {
    if (selectedAddress?.id === address.id) {
      setSelectedAddress(null)
    } else {
      setSelectedAddress(address)
    }
  }

  // Updated coupon handling to match cart component exactly
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      setCouponLoading(true)
      setCouponError("")

      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        throw new Error("Authentication required")
      }

      // Use the same endpoint as cart component
      const response = await fetch(`${BASE_URL}/api/cart/apply-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ code: couponCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply coupon")
      }

      // Update with the response data
      if (data.coupon) {
        setAppliedCoupon(data.coupon)
        setCouponCode(data.coupon.code)

        // Calculate discount amount based on current total
        let discount = 0
        if (data.coupon.discountType === "percentage" && data.coupon.discountValue) {
          discount = originalTotal * (data.coupon.discountValue / 100)
        } else if (data.coupon.discountType === "fixed" && data.coupon.discountValue) {
          discount = data.coupon.discountValue
        }

        setDiscountAmount(discount)
        setDiscountedTotal(Math.max(0, originalTotal - discount))
      }

      showNotification("Coupon Applied", `Coupon ${data.coupon.code} has been applied successfully!`, "success")
    } catch (error) {
      console.error("Coupon error:", error)
      setCouponError(error instanceof Error ? error.message : "Failed to apply coupon")
      showNotification("Coupon Error", error instanceof Error ? error.message : "Failed to apply coupon", "error")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = async () => {
    try {
      setCouponLoading(true)

      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        throw new Error("Authentication required")
      }

      // Call the API to remove the coupon - same as cart component
      const response = await fetch(`${BASE_URL}/api/cart/remove-coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove coupon")
      }

      // Reset coupon and discount information
      setAppliedCoupon(null)
      setCouponCode("")
      setDiscountAmount(0)
      setDiscountedTotal(originalTotal)

      showNotification("Coupon Removed", "Discount coupon has been removed.", "info")
    } catch (error) {
      console.error("Remove coupon error:", error)
      showNotification("Error", error instanceof Error ? error.message : "Failed to remove coupon", "error")
    } finally {
      setCouponLoading(false)
    }
  }

  const addItemToPackage = (item: Product | Test, type: "product" | "test") => {
    const selectedItem: SelectedItem = {
      id: item.id,
      name: item.name,
      price: type === "product" ? (item as Product).actualPrice : Number.parseInt((item as Test).price),
      discountedPrice:
        type === "product" ? (item as Product).discountedPrice : Number.parseInt((item as Test).discountedPrice),
      type,
      reportTime: type === "product" ? (item as Product).reportTime : undefined,
      testCount: type === "test" ? (item as Test).testCount : undefined,
      category: type === "product" ? (item as Product).category.name : (item as Test).categoryName,
    }

    const isAlreadySelected = selectedItems.some((selected) => selected.id === item.id && selected.type === type)

    if (!isAlreadySelected) {
      setSelectedItems([...selectedItems, selectedItem])
      showNotification("Item Added", `${item.name} has been added to your package`, "success")
    }
  }

  const removeItemFromPackage = (itemId: number, type: "product" | "test") => {
    const item = selectedItems.find((item) => item.id === itemId && item.type === type)
    setSelectedItems(selectedItems.filter((item) => !(item.id === itemId && item.type === type)))
    if (item) {
      showNotification("Item Removed", `${item.name} has been removed from your package`, "info")
    }
  }

  const createCustomPackage = async () => {
    if (!packageName.trim()) {
      setError("Please enter a package name")
      return
    }

    if (selectedItems.length === 0) {
      setError("Please select at least one item")
      return
    }

    setLoading(true)
    setError("")

    try {
      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        setError("User token not found. Please login first.")
        setLoading(false)
        return
      }

      const packageData: CustomPackage = {
        name: packageName,
        items: selectedItems.map((item) => (item.type === "product" ? { productId: item.id } : { testId: item.id })),
      }

      console.log("Creating package with data:", packageData)

      const response = await fetch(`${BASE_URL}/api/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(packageData),
      })

      console.log("Package creation response status:", response.status)

      if (response.ok) {
        const createdData = await response.json()
        console.log("Package created successfully:", createdData)
        setCreatedPackage({ ...packageData, id: createdData.id })
        showNotification("Package Created", "Your custom package has been created successfully!", "success")
        setError("")
        setCurrentStep(1) // Move to member & address selection
      } else {
        const errorData = await response.json()
        console.error("Package creation failed:", errorData)
        setError(errorData.error || "Failed to create package")
      }
    } catch (error) {
      console.error("Error creating package:", error)
      setError("Failed to create package")
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToMemberAddress = () => {
    if (!createdPackage) {
      showNotification("Package Required", "Please create a package first.", "error")
      return
    }
    setCurrentStep(1)
  }

  const handleProceedToPayment = () => {
    if (selectedMembers.length === 0) {
      showNotification("Member Required", "Please select at least one family member for this booking.", "error")
      return
    }

    if (!selectedAddress) {
      showNotification("Address Required", "Please select an address for this booking.", "error")
      return
    }

    setCurrentStep(2)
  }

  const buyNow = async () => {
    if (!createdPackage?.id) {
      console.error("No created package ID")
      showNotification("Error", "No package found for purchase", "error")
      return
    }

    setBuyNowLoading(true)
    console.log("Starting buy now process for package ID:", createdPackage.id)

    try {
      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        showNotification("Authentication Required", "Please login to proceed with purchase", "error")
        setBuyNowLoading(false)
        return
      }

      if (!razorpayLoaded || !window.Razorpay) {
        console.log("Razorpay not loaded, attempting to load...")
        try {
          await loadRazorpayScript()
        } catch (error) {
          console.error("Failed to load Razorpay:", error)
          showNotification("Error", "Payment system not available. Please try again.", "error")
          setBuyNowLoading(false)
          return
        }
      }

      console.log("Creating payment order...")
      const orderResponse = await fetch(`${BASE_URL}/api/custom-bookings/create-payment-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          customPackageId: createdPackage.id,
          couponCode: appliedCoupon?.code,
        }),
      })

      console.log("Payment order response status:", orderResponse.status)

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        console.error("Payment order creation failed:", errorData)
        throw new Error(errorData.error || "Failed to create payment order")
      }

      const orderData = await orderResponse.json()
      console.log("Payment order created:", orderData)

      if (!orderData.success) {
        throw new Error("Failed to create payment order")
      }

      const finalAmount = appliedCoupon ? discountedTotal : originalTotal

      const options = {
        key: "rzp_test_Iycvp4aODn242I",
        amount: finalAmount * 100, // Convert to paise
        currency: orderData.currency || "INR",
        name: "RedTest Labs",
        description: `Payment for ${packageName}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          console.log("Payment successful, creating booking...", response)
          try {
            const bookingResponse = await fetch(`${BASE_URL}/api/custom-bookings/create-booking`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                razorpayOrderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                customPackageId: createdPackage.id,
                memberId: selectedMembers[0]?.id,
                addressId: selectedAddress?.id,
                couponCode: appliedCoupon?.code,
              }),
            })

            console.log("Booking response status:", bookingResponse.status)

            if (bookingResponse.ok) {
              const bookingData = await bookingResponse.json()
              console.log("Booking created successfully:", bookingData)
              showNotification("Payment Successful", "Your booking has been confirmed!", "success")

              // Reset the form after successful payment
              setTimeout(() => {
                setCreatedPackage(null)
                setSelectedItems([])
                setPackageName("")
                setSelectedMembers([])
                setSelectedAddress(null)
                setAppliedCoupon(null)
                setCouponCode("")
                setDiscountAmount(0)
                setDiscountedTotal(0)
                setCurrentStep(0)
              }, 2000)
            } else {
              const errorData = await bookingResponse.json()
              console.error("Booking creation failed:", errorData)
              throw new Error(errorData.error || "Failed to create booking")
            }
          } catch (error) {
            console.error("Error creating booking:", error)
            showNotification(
              "Booking Failed",
              "Payment successful but booking creation failed. Please contact support.",
              "error",
            )
          } finally {
            setBuyNowLoading(false)
          }
        },
        prefill: {
          name: selectedMembers[0]?.name || "Customer Name",
          email: selectedMembers[0]?.email || "customer@example.com",
          contact: selectedMembers[0]?.phoneNumber || "9999999999",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user")
            setBuyNowLoading(false)
            showNotification("Payment Cancelled", "You cancelled the payment process", "info")
          },
        },
      }

      console.log("Opening Razorpay with options:", options)

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Error in buy now:", error)
      showNotification("Error", error instanceof Error ? error.message : "Failed to process payment", "error")
      setBuyNowLoading(false)
    }
  }

  const deleteItemFromCreatedPackage = async (itemId: number, type: "product" | "test") => {
    if (!createdPackage?.id) return

    try {
      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        setError("User token not found")
        return
      }

      const response = await fetch(`${BASE_URL}/api/custom/${createdPackage.id}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      if (response.ok) {
        removeItemFromPackage(itemId, type)
      } else {
        setError("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      setError("Failed to delete item")
    }
  }

  const showNotification = (title: string, message: string, type: "success" | "error" | "info" | "warning") => {
    setNotification({ show: true, title, message, type })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.discountedPrice, 0)
  }

  const getOriginalPrice = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0)
  }

  const getSavings = () => {
    return getOriginalPrice() - getTotalPrice()
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate the final total price to display
  const finalTotalPrice = appliedCoupon ? discountedTotal : originalTotal || getTotalPrice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Notification
        title={notification.title}
        message={notification.message}
        isVisible={notification.show}
        onClose={closeNotification}
        type={notification.type}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false, type: "member", item: null, loading: false })}
        onConfirm={() => {
          if (deleteConfirmation.item) {
            if (deleteConfirmation.type === "member") {
              handleDeleteMember(deleteConfirmation.item as Member)
            } else {
              handleDeleteAddress(deleteConfirmation.item as Address)
            }
          }
          setDeleteConfirmation({ show: false, type: "member", item: null, loading: false })
        }}
        title={`Delete ${deleteConfirmation.type === "member" ? "Member" : "Address"}`}
        message={`Are you sure you want to delete this ${deleteConfirmation.type}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteConfirmation.loading}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Sparkles className="w-12 h-12 text-blue-200" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Create Your Custom Package
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Build your personalized health package with our comprehensive tests and products
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                <span>Expert Curated</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-300" />
                <span>Fast Reports</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-300" />
                <span>Trusted by Thousands</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <Stepper currentStep={currentStep} steps={steps} />

        {/* Step 0: Create Package */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 xl:grid-cols-4 gap-8"
          >
            {/* Main Content */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Package Name Input */}
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="max-w-md">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Package Name</label>
                    <input
                      type="text"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      placeholder="Enter your custom package name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Search Bar */}
                <div className="p-6 border-b border-gray-100">
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tests and packages..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab("products")}
                      className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                        activeTab === "products"
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Package className="w-5 h-5 inline mr-2" />
                      Products ({filteredProducts.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("tests")}
                      className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                        activeTab === "tests"
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <TestTube className="w-5 h-5 inline mr-2" />
                      Tests ({filteredTests.length})
                    </button>
                  </nav>
                </div>

                {/* Items Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
                    {activeTab === "products" &&
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                product.productType === "PACKAGE"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {product.productType}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Report in {product.reportTime} hours
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <Package className="w-3 h-3 mr-1" />
                              {product.category.name}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{product.tags}</p>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">₹{product.discountedPrice}</span>
                              <span className="text-sm text-gray-500 line-through">₹{product.actualPrice}</span>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Save ₹{product.actualPrice - product.discountedPrice}
                            </div>
                          </div>

                          <button
                            onClick={() => addItemToPackage(product, "product")}
                            disabled={selectedItems.some((item) => item.id === product.id && item.type === "product")}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                          >
                            {selectedItems.some((item) => item.id === product.id && item.type === "product") ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Package
                              </>
                            )}
                          </button>
                        </div>
                      ))}

                    {activeTab === "tests" &&
                      filteredTests.map((test) => (
                        <div
                          key={test.id}
                          className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                              {test.name}
                            </h3>
                            <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-800">
                              TEST
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-xs text-gray-600 line-clamp-2">{test.desc}</p>
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              Report in {test.reportIn}
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <TestTube className="w-3 h-3 mr-1" />
                              {test.testCount} tests • {test.categoryName}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">₹{test.discountedPrice}</span>
                              <span className="text-sm text-gray-500 line-through">₹{test.price}</span>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                              Save ₹{Number.parseInt(test.price) - Number.parseInt(test.discountedPrice)}
                            </div>
                          </div>

                          <button
                            onClick={() => addItemToPackage(test, "test")}
                            disabled={selectedItems.some((item) => item.id === test.id && item.type === "test")}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                          >
                            {selectedItems.some((item) => item.id === test.id && item.type === "test") ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Package
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Package Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                    <h2 className="text-xl font-bold mb-2">Package Summary</h2>
                    <p className="text-blue-100 text-sm">
                      {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>

                  <div className="p-6">
                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">No items selected yet</p>
                        <p className="text-gray-400 text-xs mt-1">Start building your package</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                          {selectedItems.map((item) => (
                            <div
                              key={`${item.type}-${item.id}`}
                              className="bg-gray-50 rounded-lg p-3 flex justify-between items-start"
                            >
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-800 truncate">{item.name}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-blue-600 font-semibold text-sm">₹{item.discountedPrice}</span>
                                  <span className="text-gray-500 line-through text-xs">₹{item.price}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                      item.type === "product"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {item.type === "product" ? "Product" : "Test"}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeItemFromPackage(item.id, item.type)}
                                className="text-red-500 hover:text-red-700 p-1 ml-2"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="line-through text-gray-500">₹{getOriginalPrice()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600 font-medium">You Save:</span>
                            <span className="text-green-600 font-bold">₹{getSavings()}</span>
                          </div>

                          {appliedCoupon && discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span className="flex items-center font-medium text-sm">
                                <TagIcon />
                                <span className="ml-1">Coupon ({appliedCoupon.code})</span>
                              </span>
                              <span className="font-bold text-sm">-₹{discountAmount.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Total Price:</span>
                            <span className="text-2xl font-bold text-blue-600">₹{finalTotalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Coupon Code Section */}
                        <div className="mt-6 border-t border-gray-100 pt-6">
                          <div className="flex flex-col space-y-3">
                            <label htmlFor="coupon" className="text-sm font-bold text-gray-700">
                              {appliedCoupon ? "Applied Coupon Code" : "Apply Coupon Code"}
                            </label>
                            <div className="flex flex-col space-y-2">
                              <input
                                type="text"
                                id="coupon"
                                value={couponCode}
                                onChange={(e) => !appliedCoupon && setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                disabled={!!appliedCoupon || couponLoading}
                                className={`p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm ${
                                  appliedCoupon ? "bg-green-50 border-green-300 text-green-700" : "border-gray-300"
                                }`}
                              />
                              {appliedCoupon ? (
                                <CustomButton
                                  onClick={handleRemoveCoupon}
                                  variant="danger"
                                  size="sm"
                                  isLoading={couponLoading}
                                  fullWidth
                                >
                                  <CloseIcon />
                                  Remove Coupon
                                </CustomButton>
                              ) : (
                                <CustomButton
                                  onClick={handleApplyCoupon}
                                  variant="secondary"
                                  size="sm"
                                  disabled={!couponCode.trim()}
                                  isLoading={couponLoading}
                                  fullWidth
                                >
                                  <CheckIcon />
                                  Apply Coupon
                                </CustomButton>
                              )}
                            </div>
                            {couponError && <p className="text-sm text-red-500 mt-1">{couponError}</p>}
                            {appliedCoupon && appliedCoupon.discountType && (
                              <p className="text-sm text-green-600 mt-1 flex items-center font-medium">
                                <CheckIcon />
                                <span className="ml-1">
                                  {appliedCoupon.discountType === "percentage"
                                    ? `${appliedCoupon.discountValue}% off`
                                    : `₹${appliedCoupon.discountValue} off`}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={createCustomPackage}
                          disabled={loading || selectedItems.length === 0 || !packageName.trim()}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 mt-6 flex items-center justify-center"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Create Package
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Member and Address Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Member Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <UserIcon />
                    <span className="ml-2">Select Family Members</span>
                  </h2>
                  <p className="text-slate-600 mt-1">You can select multiple members for this booking</p>
                  {selectedMembers.length > 0 && (
                    <p className="text-sky-600 font-medium mt-1 flex items-center">
                      <CheckIcon />
                      <span className="ml-1">
                        {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
                      </span>
                    </p>
                  )}
                </div>
                <CustomButton
                  onClick={() => {
                    setEditingMember(null)
                    setShowMemberForm(true)
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <PlusIcon />
                  Add Member
                </CustomButton>
              </div>

              {showMemberForm ? (
                <MemberForm
                  onSubmit={editingMember ? handleEditMember : handleAddMember}
                  onCancel={() => {
                    setShowMemberForm(false)
                    setEditingMember(null)
                  }}
                  isLoading={memberLoading}
                  editMember={editingMember}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {members.map((member) => {
                    const isSelected = selectedMembers.some((m) => m.id === member.id)
                    return (
                      <motion.div
                        key={member.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMemberSelection(member)}
                        className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-200/50"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg">
                            <CheckIcon />
                          </div>
                        )}
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 shadow-lg text-white">
                            <UserIcon />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate">{member.name}</h3>
                            <p className="text-sm text-slate-500">{member.relation}</p>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>
                            <span className="font-medium">Age:</span> {member.age}
                          </p>
                          <p>
                            <span className="font-medium">Gender:</span> {member.gender}
                          </p>
                          {member.email && (
                            <p className="truncate">
                              <span className="font-medium">Email:</span> {member.email}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingMember(member)
                              setShowMemberForm(true)
                            }}
                            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all text-sm font-medium flex items-center justify-center"
                          >
                            <EditIcon />
                            <span className="ml-1">Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirmation({ show: true, type: "member", item: member, loading: false })
                            }}
                            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all text-sm font-medium flex items-center justify-center"
                          >
                            <DeleteIcon />
                            <span className="ml-1">Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                  {members.length === 0 && !showMemberForm && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No family members added yet</h3>
                      <p className="text-slate-500 mb-4">Add your first family member to continue with the booking</p>
                      <CustomButton
                        onClick={() => {
                          setEditingMember(null)
                          setShowMemberForm(true)
                        }}
                        variant="primary"
                        size="sm"
                      >
                        <PlusIcon />
                        Add your first member
                      </CustomButton>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <MapPinIcon />
                    <span className="ml-2">Select Address</span>
                  </h2>
                  <p className="text-slate-600 mt-1">Choose where you want the sample collection</p>
                  {selectedAddress && (
                    <p className="text-sky-600 font-medium mt-1 flex items-center">
                      <CheckIcon />
                      <span className="ml-1">{selectedAddress.name} selected</span>
                    </p>
                  )}
                </div>
                <CustomButton
                  onClick={() => {
                    setEditingAddress(null)
                    setShowAddressForm(true)
                  }}
                  variant="secondary"
                  size="sm"
                >
                  <PlusIcon />
                  Add Address
                </CustomButton>
              </div>

              {showAddressForm ? (
                <AddressForm
                  onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
                  onCancel={() => {
                    setShowAddressForm(false)
                    setEditingAddress(null)
                  }}
                  isLoading={addressLoading}
                  editAddress={editingAddress}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {addresses.map((address) => {
                    const isSelected = selectedAddress?.id === address.id
                    return (
                      <motion.div
                        key={address.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddressSelection(address)}
                        className={`relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? "border-sky-500 bg-sky-50 shadow-lg shadow-sky-200/50"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg">
                            <CheckIcon />
                          </div>
                        )}
                        <div className="flex items-start mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 mt-1 shadow-lg text-white">
                            <MapPinIcon />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800">{address.name}</h3>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{address.addressLine}</p>
                            <p className="text-sm text-slate-500 mt-1">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            {address.landmark && <p className="text-sm text-slate-500">Near: {address.landmark}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingAddress(address)
                              setShowAddressForm(true)
                            }}
                            className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all text-sm font-medium flex items-center justify-center"
                          >
                            <EditIcon />
                            <span className="ml-1">Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirmation({ show: true, type: "address", item: address, loading: false })
                            }}
                            className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all text-sm font-medium flex items-center justify-center"
                          >
                            <DeleteIcon />
                            <span className="ml-1">Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                  {addresses.length === 0 && !showAddressForm && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPinIcon />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">No addresses added yet</h3>
                      <p className="text-slate-500 mb-4">Add your first address to continue with the booking</p>
                      <CustomButton
                        onClick={() => {
                          setEditingAddress(null)
                          setShowAddressForm(true)
                        }}
                        variant="primary"
                        size="sm"
                      >
                        <PlusIcon />
                        Add your first address
                      </CustomButton>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <CustomButton onClick={() => setCurrentStep(0)} variant="secondary" className="flex-1" size="lg">
                <ArrowLeftIcon />
                Back to Package
              </CustomButton>
              <CustomButton
                onClick={handleProceedToPayment}
                className="flex-1"
                size="lg"
                disabled={selectedMembers.length === 0 || !selectedAddress}
              >
                <ArrowRightIcon />
                Proceed to Payment
              </CustomButton>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Booking Summary</h2>

              {/* Package Details */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                  <Package className="w-5 h-5" />
                  <span className="ml-2">Custom Package</span>
                </h3>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-800">{packageName}</p>
                  <p className="text-sm text-slate-600 mt-1">{selectedItems.length} items included</p>
                </div>
              </div>

              {/* Selected Members */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                  <UserIcon />
                  <span className="ml-2">Selected Members ({selectedMembers.length})</span>
                </h3>
                <div className="space-y-3">
                  {selectedMembers.map((member) => (
                    <div key={member.id} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-sm text-slate-600">
                        <p className="font-semibold text-slate-800">{member.name}</p>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <p>
                            <span className="font-medium">Relation:</span> {member.relation}
                          </p>
                          <p>
                            <span className="font-medium">Age:</span> {member.age}
                          </p>
                          <p>
                            <span className="font-medium">Gender:</span> {member.gender}
                          </p>
                          {member.email && (
                            <p className="col-span-2 truncate">
                              <span className="font-medium">Email:</span> {member.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Address */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                  <MapPinIcon />
                  <span className="ml-2">Delivery Address</span>
                </h3>
                {selectedAddress && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">{selectedAddress.name}</p>
                      <p className="mt-1">{selectedAddress.addressLine}</p>
                      <p>
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.landmark && <p>Near: {selectedAddress.landmark}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Package Items Summary */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 mb-3">Package Items ({selectedItems.length})</h3>
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex justify-between text-sm bg-slate-50 p-3 rounded-lg"
                    >
                      <span className="text-slate-600 font-medium">{item.name}</span>
                      <span className="font-bold text-slate-800">₹{item.discountedPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <CreditCard className="w-6 h-6" />
                <span className="ml-2">Payment Details</span>
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">₹{originalTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center font-medium">
                      <TagIcon />
                      <span className="ml-1">Discount ({appliedCoupon.code})</span>
                    </span>
                    <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-slate-800">Total Amount</span>
                  <span className="text-xl font-bold text-slate-800">₹{finalTotalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <CustomButton onClick={buyNow} fullWidth size="lg" isLoading={buyNowLoading} disabled={!razorpayLoaded}>
                  <LockIcon />
                  {buyNowLoading ? "Processing..." : !razorpayLoaded ? "Loading Payment..." : "Pay Now"}
                </CustomButton>

                <CustomButton onClick={() => setCurrentStep(1)} variant="secondary" fullWidth size="lg">
                  <ArrowLeftIcon />
                  Back to Member & Address
                </CustomButton>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center mb-2">
                  <ShieldCheckIcon />
                  <span className="ml-2 font-semibold text-slate-800">Secure Payment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your payment is secured with 256-bit SSL encryption. We accept all major credit cards, debit cards,
                  and UPI payments through Razorpay.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CustomPackage
