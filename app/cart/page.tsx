"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCart } from "../../components/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import PremiumEmptyCart from "../../components/Empty-Cart"
import Head from 'next/head'
interface MetaTagsResponse {
  id: number
  filename: string
  title: string
  description: string
  keywords: string
  charset: string
  author: string
  canonicallink: string
  favicon: string
  opengraph: string
  twitter: string
  schema: string
  viewport: string
  createdAt: string
  updatedAt: string
}

// Custom icons
const ShoppingCartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

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

const CreditCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
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

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
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

// Types
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
  
  // Fetch meta tags from API


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

// Login prompt component
const LoginPrompt = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ShoppingCartIcon />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center">Please Login</h2>
        <p className="text-slate-600 text-center leading-relaxed">
          You need to be logged in to view your cart details and proceed with booking
        </p>
        <CustomButton onClick={() => (window.location.href = "/login")} className="mt-6" size="lg">
          Go to Login
        </CustomButton>
      </motion.div>
    </div>
  )
}

// Cart item component
interface CartItemProps {
  item: any
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  loadingType: "none" | "quantity" | "remove"
}

const CartItem = ({ item, onUpdateQuantity, onRemove, loadingType }: CartItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="py-4 sm:py-6 flex flex-col lg:flex-row gap-4 lg:gap-6"
    >
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800 mb-2 text-base sm:text-lg leading-tight">{item.product?.name}</h3>
        <div className="flex items-center mb-4">
          <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
            <CheckIcon />
          </div>
          <p className="text-sm text-emerald-600 font-medium">Reports in {item.product?.reportTime} hours</p>
        </div>

        <div className="flex items-center justify-between lg:justify-start lg:space-x-6">
          <div className="flex items-center bg-slate-50 rounded-xl p-1">
            <button
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
              onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
              disabled={loadingType !== "none" || item.quantity <= 1}
            >
              <MinusIcon />
            </button>
            <div className="mx-3 w-12 text-center relative">
              {loadingType === "quantity" ? (
                <div className="inline-flex items-center">
                  <span className="font-medium text-slate-400">{item.quantity}</span>
                  <div className="ml-1 w-3 h-3 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <span className="font-semibold text-slate-800 text-lg">{item.quantity}</span>
              )}
            </div>
            <button
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              disabled={loadingType !== "none"}
            >
              <PlusIcon />
            </button>
          </div>

          <button
            className={`text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 px-3 py-2 rounded-lg hover:bg-red-50`}
            onClick={() => onRemove(item.productId)}
            disabled={loadingType !== "none"}
          >
            <span className="flex items-center space-x-1">
              <TrashIcon />
              <span className="hidden sm:inline">Remove</span>
              {loadingType === "remove" && (
                <div className="ml-1 w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
              )}
            </span>
          </button>
        </div>
      </div>

      <div className="flex justify-between lg:block lg:text-right lg:min-w-[120px]">
        <div className="text-lg sm:text-xl font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</div>
        {item.quantity > 1 && <div className="text-sm text-slate-500 mt-1">₹{item.price.toFixed(2)} each</div>}
      </div>
    </motion.div>
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

// Cart skeleton for initial loading
const CartSkeleton = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
     
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="flex items-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
            <ShoppingCartIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">Your Cart</h1>
            <p className="text-slate-600 text-sm sm:text-base">Complete your health test booking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Cart Items</h2>
                  <span className="text-slate-500 font-medium">Price</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {[1, 2].map((i) => (
                    <div key={i} className="py-6 flex flex-col lg:flex-row animate-pulse">
                      <div className="flex-1">
                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center bg-slate-200 rounded-xl p-1">
                            <div className="w-10 h-10 rounded-lg bg-slate-300"></div>
                            <div className="mx-3 w-12 h-6 bg-slate-300 rounded"></div>
                            <div className="w-10 h-10 rounded-lg bg-slate-300"></div>
                          </div>
                          <div className="h-6 bg-slate-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 text-right lg:min-w-[120px]">
                        <div className="h-6 bg-slate-200 rounded w-20 ml-auto mb-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
                <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-5 bg-slate-200 rounded w-20"></div>
                    <div className="h-5 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-slate-200 rounded w-20"></div>
                    <div className="h-5 bg-slate-200 rounded w-16"></div>
                  </div>
                  <div className="border-t border-slate-200 pt-4 flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-24"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="h-12 bg-slate-200 rounded-xl w-full mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Cart Component
const Cart = () => {
  const {
    cart,
    loading: initialLoading,
    error: initialError,
    updateCartItem,
    removeFromCart,
    totalItems,
    totalPrice,
    refreshCart,
    isAuthenticated: cartIsAuthenticated,
  } = useCart()

  // Stepper state
  const [currentStep, setCurrentStep] = useState(0)
  const steps = [
    { title: "Items", icon: <ShoppingCartIcon /> },
    { title: "Member & Address", icon: <UserIcon /> },
    { title: "Payment", icon: <CreditCardIcon /> },
  ]

  // Member and Address state - Updated for multiple selection
  const [members, setMembers] = useState<Member[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]) // Changed to array
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

  const [notification, setNotification] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "info" | "warning",
  })
  const [isAuthenticated, setIsAuthenticated] = useState(cartIsAuthenticated)
  const [loadingItemsState, setLoadingItemsState] = useState<Record<number, "none" | "quantity" | "remove">>({})
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const [couponCode, setCouponCode] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")

  // Use local state to manage cart data to avoid full page reloads
  const [localCart, setLocalCart] = useState(cart)
  const [localTotalItems, setLocalTotalItems] = useState(totalItems)
  const [localTotalPrice, setLocalTotalPrice] = useState(totalPrice)
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

  // Update authentication state when cart context changes
  useEffect(() => {
    setIsAuthenticated(cartIsAuthenticated)
  }, [cartIsAuthenticated])

  // Listen for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("userToken")
      const newAuthState = !!token
      setIsAuthenticated(newAuthState)

      // Refresh cart after login with a delay
      if (newAuthState && refreshCart) {
        setTimeout(() => {
          refreshCart()
        }, 500) // Small delay to ensure everything is ready
      }
    }

    window.addEventListener("authStateChanged", handleAuthChange)

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange)
    }
  }, [refreshCart])

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    // Update local state when initial cart data loads
    if (cart) {
      setLocalCart(cart)
      setLocalTotalItems(totalItems)
      setLocalTotalPrice(totalPrice)

      // Set the discount information if available in the cart response
      if (cart.originalTotal !== undefined) {
        setOriginalTotal(cart.originalTotal)
        setDiscountAmount(cart.discountAmount || 0)
        setDiscountedTotal(cart.discountedTotal || cart.originalTotal)
      } else {
        setOriginalTotal(totalPrice)
        setDiscountedTotal(totalPrice)
      }

      // Set applied coupon if it exists in the cart response
      if (cart.appliedCoupon) {
        setAppliedCoupon(cart.appliedCoupon)
        setCouponCode(cart.appliedCoupon.code)
      } else {
        setAppliedCoupon(null)
        setCouponCode("")
      }
    }
  }, [cart, totalItems, totalPrice])

  // Load members and addresses when step changes to 1
  useEffect(() => {
    if (currentStep === 1 && isAuthenticated) {
      loadMembers()
      loadAddresses()
    }
  }, [currentStep, isAuthenticated])

  const getUserId = () => {
    return localStorage.getItem("userId") || "3" // fallback to "3" as in original code
  }

  const loadMembers = async () => {
    try {
      const userId = getUserId()
      const response = await fetch(`https://redtestlab.com/api/bookings/members/${userId}`)
      const data = await response.json()

      if (data.success) {
        setMembers(data.members)
      }
    } catch (error) {
      console.error("Error loading members:", error)
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to load family members",
        type: "error",
      })
    }
  }
      const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)

  // Get userId from localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

    useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/3")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 3,
          filename: "BookingsReports",
          title: "RedTest Lab - Bookings & Reports",
          description: "View your health test bookings and medical reports online with RedTest Lab",
          keywords: "bookings, reports, health tests, medical reports, lab results",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: window.location.href,
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Bookings and Reports",
          twitter: "RedTest Lab",
          schema: "",
          viewport: "width=device-width, initial-scale=1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      } finally {
        setIsLoadingMeta(false)
      }
    }

    fetchMetaTags()
  }, [])

  const loadAddresses = async () => {
    try {
      const userId = getUserId()
      const response = await fetch(`https://redtestlab.com/api/bookings/addresses/${userId}`)
      const data = await response.json()

      if (data.success) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to load addresses",
        type: "error",
      })
    }
  }

  const handleAddMember = async (memberData: Omit<Member, "id">) => {
    try {
      setMemberLoading(true)
      const userId = getUserId()

      const response = await fetch("https://redtestlab.com/api/bookings/members", {
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
        setNotification({
          show: true,
          title: "Member Added",
          message: "Family member has been added successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to add member")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to add member",
        type: "error",
      })
    } finally {
      setMemberLoading(false)
    }
  }

  const handleEditMember = async (memberData: Omit<Member, "id">) => {
    if (!editingMember) return

    try {
      setMemberLoading(true)

      const response = await fetch(`https://redtestlab.com/api/bookings/members/${editingMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      })

      const data = await response.json()

      if (data.success) {
        setMembers(members.map((m) => (m.id === editingMember.id ? data.member : m)))
        // Update selected members if the edited member was selected
        setSelectedMembers(selectedMembers.map((m) => (m.id === editingMember.id ? data.member : m)))
        setEditingMember(null)
        setShowMemberForm(false)
        setNotification({
          show: true,
          title: "Member Updated",
          message: "Family member has been updated successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to update member")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to update member",
        type: "error",
      })
    } finally {
      setMemberLoading(false)
    }
  }

  const handleDeleteMember = async (member: Member) => {
    try {
      setDeleteConfirmation((prev) => ({ ...prev, loading: true }))

      const response = await fetch(`https://redtestlab.com/api/bookings/members/${member.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setMembers(members.filter((m) => m.id !== member.id))
        // Remove from selected members if it was selected
        setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))
        setNotification({
          show: true,
          title: "Member Deleted",
          message: "Family member has been deleted successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to delete member")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to delete member",
        type: "error",
      })
    } finally {
      setDeleteConfirmation((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleAddAddress = async (addressData: Omit<Address, "id">) => {
    try {
      setAddressLoading(true)
      const userId = getUserId()

      const response = await fetch("https://redtestlab.com/api/bookings/addresses", {
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
        setNotification({
          show: true,
          title: "Address Added",
          message: "Address has been added successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to add address")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to add address",
        type: "error",
      })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleEditAddress = async (addressData: Omit<Address, "id">) => {
    if (!editingAddress) return

    try {
      setAddressLoading(true)

      const response = await fetch(
        `https://redtestlab.com/api/bookings/addresses/${editingAddress.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        },
      )

      const data = await response.json()

      if (data.success) {
        setAddresses(addresses.map((a) => (a.id === editingAddress.id ? data.address : a)))
        // Update selected address if the edited address was selected
        if (selectedAddress?.id === editingAddress.id) {
          setSelectedAddress(data.address)
        }
        setEditingAddress(null)
        setShowAddressForm(false)
        setNotification({
          show: true,
          title: "Address Updated",
          message: "Address has been updated successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to update address")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to update address",
        type: "error",
      })
    } finally {
      setAddressLoading(false)
    }
  }

  const handleDeleteAddress = async (address: Address) => {
    try {
      setDeleteConfirmation((prev) => ({ ...prev, loading: true }))

      const response = await fetch(`https://redtestlab.com/api/bookings/addresses/${address.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setAddresses(addresses.filter((a) => a.id !== address.id))
        // Remove from selected address if it was selected
        if (selectedAddress?.id === address.id) {
          setSelectedAddress(null)
        }
        setNotification({
          show: true,
          title: "Address Deleted",
          message: "Address has been deleted successfully.",
          type: "success",
        })
      } else {
        throw new Error(data.error || "Failed to delete address")
      }
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to delete address",
        type: "error",
      })
    } finally {
      setDeleteConfirmation((prev) => ({ ...prev, loading: false }))
    }
  }

  // Updated member selection handler for multiple selection
  const handleMemberSelection = (member: Member) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id)

    if (isSelected) {
      // Unselect member
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))
    } else {
      // Select member
      setSelectedMembers([...selectedMembers, member])
    }
  }

  // Updated address selection handler for unselect functionality
  const handleAddressSelection = (address: Address) => {
    if (selectedAddress?.id === address.id) {
      // Unselect address
      setSelectedAddress(null)
    } else {
      // Select address
      setSelectedAddress(address)
    }
  }

  const handleNavigateToProducts = () => {
    // Navigate to products page
    window.location.href = "/products"
  }

  // Optimistically update the local cart when changing quantity
  const updateLocalCart = (productId: number, newQuantity: number) => {
    if (!localCart) return

    const updatedItems = localCart.items.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    // Update local state
    setLocalCart({
      ...localCart,
      items: updatedItems,
    })

    // Recalculate totals
    const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    const newTotalPrice = updatedItems.reduce(
      (sum, item) =>
        sum +
        item.price * (item.quantity / (localCart.items.find((i) => i.productId === item.productId)?.quantity || 1)),
      0,
    )

    setLocalTotalItems(newTotalItems)
    setLocalTotalPrice(newTotalPrice)
    setOriginalTotal(newTotalPrice)

    // If there's a coupon applied, recalculate the discount
    if (appliedCoupon) {
      let newDiscountAmount = 0
      if (appliedCoupon.discountType === "percentage" && appliedCoupon.discountValue) {
        newDiscountAmount = newTotalPrice * (appliedCoupon.discountValue / 100)
      } else if (appliedCoupon.discountType === "fixed" && appliedCoupon.discountValue) {
        newDiscountAmount = appliedCoupon.discountValue
      }
      setDiscountAmount(newDiscountAmount)
      setDiscountedTotal(Math.max(0, newTotalPrice - newDiscountAmount))
    } else {
      setDiscountedTotal(newTotalPrice)
    }
  }

  // Optimistically remove item from local cart
  const removeLocalCartItem = (productId: number) => {
    if (!localCart) return

    const itemToRemove = localCart.items.find((item) => item.productId === productId)
    if (!itemToRemove) return

    const updatedItems = localCart.items.filter((item) => item.productId !== productId)

    // Update local state
    setLocalCart({
      ...localCart,
      items: updatedItems,
    })

    // Recalculate totals
    const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0)

    setLocalTotalItems(newTotalItems)
    setLocalTotalPrice(newTotalPrice)
    setOriginalTotal(newTotalPrice)

    // If there's a coupon applied, recalculate the discount
    if (appliedCoupon) {
      let newDiscountAmount = 0
      if (appliedCoupon.discountType === "percentage" && appliedCoupon.discountValue) {
        newDiscountAmount = newTotalPrice * (appliedCoupon.discountValue / 100)
      } else if (appliedCoupon.discountType === "fixed" && appliedCoupon.discountValue) {
        newDiscountAmount = appliedCoupon.discountValue
      }
      setDiscountAmount(newDiscountAmount)
      setDiscountedTotal(Math.max(0, newTotalPrice - newDiscountAmount))
    } else {
      setDiscountedTotal(newTotalPrice)
    }

    // If cart becomes empty, remove the coupon (backend will do this too)
    if (updatedItems.length === 0 && appliedCoupon) {
      setAppliedCoupon(null)
      setCouponCode("")
      setDiscountAmount(0)
      setDiscountedTotal(newTotalPrice)
    }
  }

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      // Only update if the quantity is different
      const currentItem = localCart?.items.find((item) => item.productId === productId)
      if (currentItem && currentItem.quantity === quantity) return

      // Set loading state for this specific item
      setLoadingItemsState((prev) => ({ ...prev, [productId]: "quantity" }))

      // Optimistically update the UI
      updateLocalCart(productId, quantity)

      // Make the actual API call
      await updateCartItem(productId, quantity)

      setNotification({
        show: true,
        title: "Cart Updated",
        message: "Item quantity has been updated.",
        type: "success",
      })
    } catch (err) {
      // On error, revert to the original cart data
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to update cart.",
        type: "error",
      })

      // Revert to original cart data without full page reload
      if (cart) {
        setLocalCart(cart)
        setLocalTotalItems(totalItems)
        setLocalTotalPrice(totalPrice)

        if (cart.originalTotal !== undefined) {
          setOriginalTotal(cart.originalTotal)
          setDiscountAmount(cart.discountAmount || 0)
          setDiscountedTotal(cart.discountedTotal || cart.originalTotal)
        }
      }
    } finally {
      // Remove loading state after a short delay to ensure UI shows the change
      setTimeout(() => {
        setLoadingItemsState((prev) => ({ ...prev, [productId]: "none" }))
      }, 500)
    }
  }

  const handleRemoveItem = async (productId: number) => {
    try {
      setLoadingItemsState((prev) => ({ ...prev, [productId]: "remove" }))

      // Optimistically remove from local cart
      removeLocalCartItem(productId)

      // Make the actual API call
      await removeFromCart(productId)

      setNotification({
        show: true,
        title: "Item Removed",
        message: "Item has been removed from your cart.",
        type: "success",
      })
    } catch (err) {
      // On error, revert to the original cart data
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to remove item from cart.",
        type: "error",
      })

      // Revert to original cart data without full page reload
      if (cart) {
        setLocalCart(cart)
        setLocalTotalItems(totalItems)
        setLocalTotalPrice(totalPrice)

        if (cart.originalTotal !== undefined) {
          setOriginalTotal(cart.originalTotal)
          setDiscountAmount(cart.discountAmount || 0)
          setDiscountedTotal(cart.discountedTotal || cart.originalTotal)
        }

        if (cart.appliedCoupon) {
          setAppliedCoupon(cart.appliedCoupon)
          setCouponCode(cart.appliedCoupon.code)
        }
      }
    } finally {
      // Remove loading state after a short delay to ensure UI shows the change
      setTimeout(() => {
        setLoadingItemsState((prev) => ({ ...prev, [productId]: "none" }))
      }, 500)
    }
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }))
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      setCouponLoading(true)
      setCouponError("")

      const userToken = localStorage.getItem("userToken")
      if (!userToken) {
        throw new Error("Authentication required")
      }

      const response = await fetch("https://redtestlab.com/api/cart/apply-coupon", {
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
        setOriginalTotal(data.originalTotal || localTotalPrice)
        setDiscountedTotal(data.discountedTotal || data.originalTotal)

        // Calculate discount amount
        const discount = data.originalTotal - data.discountedTotal
        setDiscountAmount(discount)
      }

      setNotification({
        show: true,
        title: "Coupon Applied",
        message: `Coupon ${data.coupon.code} has been applied successfully!`,
        type: "success",
      })
    } catch (error) {
      console.error("Coupon error:", error)
      setCouponError(error instanceof Error ? error.message : "Failed to apply coupon")
      setNotification({
        show: true,
        title: "Coupon Error",
        message: error instanceof Error ? error.message : "Failed to apply coupon",
        type: "error",
      })
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

      // Call the API to remove the coupon
      const response = await fetch("https://redtestlab.com/api/cart/remove-coupon", {
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

      const data = await response.json()

      // Reset coupon and discount information
      setAppliedCoupon(null)
      setCouponCode("")
      setDiscountAmount(0)
      setDiscountedTotal(data.originalTotal || originalTotal)
      setOriginalTotal(data.originalTotal || originalTotal)

      setNotification({
        show: true,
        title: "Coupon Removed",
        message: "Discount coupon has been removed.",
        type: "info",
      })
    } catch (error) {
      console.error("Remove coupon error:", error)
      setNotification({
        show: true,
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to remove coupon",
        type: "error",
      })
    } finally {
      setCouponLoading(false)
    }
  }

  const handleProceedToMemberAddress = () => {
    if (!localCart || localCart.items.length === 0) {
      setNotification({
        show: true,
        title: "Cart Empty",
        message: "Please add items to your cart first.",
        type: "error",
      })
      return
    }
    setCurrentStep(1)
  }

  const handleProceedToPayment = () => {
    if (selectedMembers.length === 0) {
      setNotification({
        show: true,
        title: "Member Required",
        message: "Please select at least one family member for this booking.",
        type: "error",
      })
      return
    }

    if (!selectedAddress) {
      setNotification({
        show: true,
        title: "Address Required",
        message: "Please select an address for this booking.",
        type: "error",
      })
      return
    }

    setCurrentStep(2)
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true)

      // Get user ID from localStorage or use a default value
      const userId = Number.parseInt(getUserId())

      // Create the request payload
      const payload = {
        userId: userId,
        type: "cart",
        couponCode: appliedCoupon?.code, // Add the coupon code if one is applied
      }

      console.log("Sending payment order request:", payload)

      // Call the API to create a payment order
      const response = await fetch("https://redtestlab.com/api/bookings/create-payment-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Only include Authorization if there's a token
          ...(localStorage.getItem("userToken")
            ? {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      })

      // Log the response status to help with debugging
      console.log("API response status:", response.status)

      // Parse the response
      const data = await response.json()
      console.log("API response data:", data)

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment order")
      }

      // Extract cart items from local cart for booking creation
      const cartItems =
        localCart?.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })) || []

      // Open Razorpay payment popup
      const options = {
        key: "rzp_test_Iycvp4aODn242I", // Replace with your actual Razorpay key
        amount: data.amount * 100, // Amount in smallest currency unit (paise for INR)
        currency: data.currency,
        name: "Health Tests",
        description: "Payment for health tests",
        order_id: data.orderId,
        handler: (response: any) => {
          // Handle successful payment
          handlePaymentSuccess(response, data.orderId, data.amount, cartItems)
        },
        prefill: {
          name: selectedMembers[0]?.name || "Customer Name",
          email: selectedMembers[0]?.email || "customer@example.com",
          contact: selectedMembers[0]?.phoneNumber || "9999999999",
        },
        theme: {
          color: "#0284c7", // Sky-600 color to match your UI
        },
        modal: {
          ondismiss: () => {
            setCheckoutLoading(false)
            setNotification({
              show: true,
              title: "Checkout Cancelled",
              message: "You cancelled the payment process",
              type: "info",
            })
          },
        },
      }

      // Create and open Razorpay instance
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        throw new Error("Razorpay SDK failed to load. Please try again later.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setNotification({
        show: true,
        title: "Checkout Failed",
        message: error instanceof Error ? error.message : "Failed to process checkout",
        type: "error",
      })
      setCheckoutLoading(false)
    }
  }

  const handlePaymentSuccess = async (response: any, razorpayOrderId: string, amount: number, items: any[]) => {
    try {
      console.log("Payment successful, creating booking...")

      // Get user ID from localStorage
      const userId = Number.parseInt(getUserId())

      // Create booking after successful payment - Updated to use first selected member
      const bookingResponse = await fetch("https://redtestlab.com/api/bookings/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("userToken")
            ? {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              }
            : {}),
        },
        body: JSON.stringify({
          userId: userId,
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: response.razorpay_payment_id,
          amount: amount,
          type: "cart",
          items: items,
          memberId: selectedMembers[0]?.id, // Use first selected member for now
          addressId: selectedAddress?.id,
        }),
      })

      const bookingData = await bookingResponse.json()
      console.log("Booking created:", bookingData)

      if (!bookingResponse.ok) {
        throw new Error(bookingData.error || `Booking creation failed: ${bookingResponse.status}`)
      }

      // Show success notification
      setNotification({
        show: true,
        title: "Payment Successful",
        message: "Your booking has been confirmed!",
        type: "success",
      })

      // Reset the cart and stepper
      setCurrentStep(0)
      setSelectedMembers([])
      setSelectedAddress(null)

      // For demo purposes, just reset loading state
      setCheckoutLoading(false)
    } catch (error) {
      console.error("Booking creation error:", error)
      setNotification({
        show: true,
        title: "Payment Processed but Booking Failed",
        message: "Your payment was successful but we couldn't create your booking. Please contact support.",
        type: "error",
      })
      setCheckoutLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  // Show skeleton loader during initial load instead of blank page
  if (initialLoading) {
    return <CartSkeleton />
  }

  if (initialError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {metaTags && !isLoadingMeta && (
  <Head>
    <title>{metaTags.title}</title>
    <meta name="description" content={metaTags.description} />
    <meta name="keywords" content={metaTags.keywords} />
    <meta name="author" content={metaTags.author} />
    <meta charSet={metaTags.charset} />
    <meta name="viewport" content={metaTags.viewport} />

    {/* Canonical Link */}
    {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}

    {/* Favicon */}
    {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}

    {/* Open Graph Tags */}
    {metaTags.opengraph && (
      <>
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      </>
    )}

    {/* Twitter Card Tags */}
    {metaTags.twitter && (
      <>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
      </>
    )}

    {/* Schema.org structured data */}
    {metaTags.schema && <script type="application/ld+json">{metaTags.schema}</script>}
  </Head>
)}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
              <ShoppingCartIcon />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">Your Cart</h1>
              <p className="text-slate-600 text-sm sm:text-base">Complete your health test booking</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center text-red-500 mb-4">
              <AlertTriangleIcon />
              <span className="ml-2 font-medium">{initialError}</span>
            </div>
            <CustomButton onClick={() => window.location.reload()} variant="primary">
              Try Again
            </CustomButton>
          </div>
        </div>
      </div>
    )
  }

  // If cart is empty or not loaded yet
  if (!localCart || localCart.items.length === 0) {
    return (
      <PremiumEmptyCart
        onExplore={handleNavigateToProducts}
        title="Your Cart is empty"
        subtitle="We've curated some exceptional health tests just for you"
        buttonText="Explore Tests"
      />
    )
  }

  // Calculate the final total price to display
  const finalTotalPrice = appliedCoupon ? discountedTotal : originalTotal || localTotalPrice

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
       {metaTags && !isLoadingMeta && (
  <Head>
    <title>{metaTags.title}</title>
    <meta name="description" content={metaTags.description} />
    <meta name="keywords" content={metaTags.keywords} />
    <meta name="author" content={metaTags.author} />
    <meta charSet={metaTags.charset} />
    <meta name="viewport" content={metaTags.viewport} />

    {/* Canonical Link */}
    {metaTags.canonicallink && <link rel="canonical" href={metaTags.canonicallink} />}

    {/* Favicon */}
    {metaTags.favicon && <link rel="icon" href={metaTags.favicon} />}

    {/* Open Graph Tags */}
    {metaTags.opengraph && (
      <>
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      </>
    )}

    {/* Twitter Card Tags */}
    {metaTags.twitter && (
      <>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
      </>
    )}

    {/* Schema.org structured data */}
    {metaTags.schema && <script type="application/ld+json">{metaTags.schema}</script>}
  </Head>
)}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
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

        <div className="flex items-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
            <ShoppingCartIcon />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-800">Your Cart</h1>
            <p className="text-slate-600 text-sm sm:text-base">Complete your health test booking</p>
          </div>
        </div>

        {/* Stepper */}
        <Stepper currentStep={currentStep} steps={steps} />

        {/* Step 0: Cart Items */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center">
                      Cart Items
                      <span className="ml-3 inline-flex items-center justify-center px-3 py-1 text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-full shadow-lg">
                        {localTotalItems}
                      </span>
                    </h2>
                    <span className="text-slate-500 font-semibold">Price</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <AnimatePresence>
                      {localCart.items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onUpdateQuantity={handleUpdateQuantity}
                          onRemove={handleRemoveItem}
                          loadingType={loadingItemsState[item.productId] || "none"}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
                  <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
                </div>
                <div className="p-6">
                  {/* Coupon Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        disabled={couponLoading || !!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <CustomButton onClick={handleRemoveCoupon} variant="danger" size="sm" isLoading={couponLoading}>
                          Remove
                        </CustomButton>
                      ) : (
                        <CustomButton
                          onClick={handleApplyCoupon}
                          variant="secondary"
                          size="sm"
                          isLoading={couponLoading}
                          disabled={!couponCode.trim()}
                        >
                          Apply
                        </CustomButton>
                      )}
                    </div>
                    {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                    {appliedCoupon && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-700">
                          <TagIcon />
                          <span className="ml-2 text-sm font-medium">
                            Coupon "{appliedCoupon.code}" applied successfully!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({localTotalItems} items)</span>
                      <span>₹{originalTotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-bold text-slate-800">
                      <span>Total</span>
                      <span>₹{finalTotalPrice.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && discountAmount > 0 && (
                      <div className="text-center text-sm text-green-600 font-medium">
                        You saved ₹{discountAmount.toFixed(2)}!
                      </div>
                    )}
                  </div>

                  <div className="mt-8 space-y-4">
                    <CustomButton onClick={handleProceedToMemberAddress} fullWidth size="lg">
                      Proceed to Booking Details
                      <ArrowRightIcon />
                    </CustomButton>
                    <CustomButton onClick={handleNavigateToProducts} variant="outline" fullWidth size="md">
                      Continue Shopping
                    </CustomButton>
                  </div>

                  <div className="mt-6 flex items-center justify-center text-sm text-slate-500">
                    <ShieldCheckIcon />
                    <span className="ml-2">Secure checkout with 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Member & Address Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Booking Details</h2>
              <CustomButton onClick={() => setCurrentStep(0)} variant="secondary" size="sm">
                <ArrowLeftIcon />
                Back to Cart
              </CustomButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Family Members Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <UserIcon />
                    <span className="ml-2">Select Family Members</span>
                  </h3>
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

                {showMemberForm && (
                  <MemberForm
                    onSubmit={editingMember ? handleEditMember : handleAddMember}
                    onCancel={() => {
                      setShowMemberForm(false)
                      setEditingMember(null)
                    }}
                    isLoading={memberLoading}
                    editMember={editingMember}
                  />
                )}

                <div className="space-y-4">
                  {members.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">No Family Members</h4>
                      <p className="text-slate-600 mb-4">Add family members to proceed with booking</p>
                      <CustomButton
                        onClick={() => {
                          setEditingMember(null)
                          setShowMemberForm(true)
                        }}
                        size="sm"
                      >
                        Add First Member
                      </CustomButton>
                    </div>
                  ) : (
                    members.map((member) => {
                      const isSelected = selectedMembers.some((m) => m.id === member.id)
                      return (
                        <motion.div
                          key={member.id}
                          layout
                          className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "border-sky-500 bg-sky-50 shadow-sky-200/50"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-xl"
                          }`}
                          onClick={() => handleMemberSelection(member)}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                                    isSelected
                                      ? "bg-sky-500 text-white"
                                      : "bg-gradient-to-br from-slate-400 to-slate-500 text-white"
                                  }`}
                                >
                                  {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded-full">{member.relation}</span>
                                    <span>{member.gender}</span>
                                    <span>{member.age} years</span>
                                  </div>
                                  {member.email && <p className="text-sm text-slate-500 mt-2">{member.email}</p>}
                                  {member.phoneNumber && <p className="text-sm text-slate-500">{member.phoneNumber}</p>}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isSelected && (
                                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                                    <CheckIcon />
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingMember(member)
                                    setShowMemberForm(true)
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteConfirmation({
                                      show: true,
                                      type: "member",
                                      item: member,
                                      loading: false,
                                    })
                                  }}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>

                {selectedMembers.length > 0 && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <h5 className="font-semibold text-sky-800 mb-2">Selected Members ({selectedMembers.length})</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedMembers.map((member) => (
                        <span
                          key={member.id}
                          className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Addresses Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                    <MapPinIcon />
                    <span className="ml-2">Select Address</span>
                  </h3>
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

                {showAddressForm && (
                  <AddressForm
                    onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
                    onCancel={() => {
                      setShowAddressForm(false)
                      setEditingAddress(null)
                    }}
                    isLoading={addressLoading}
                    editAddress={editingAddress}
                  />
                )}

                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPinIcon />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">No Addresses</h4>
                      <p className="text-slate-600 mb-4">Add an address to proceed with booking</p>
                      <CustomButton
                        onClick={() => {
                          setEditingAddress(null)
                          setShowAddressForm(true)
                        }}
                        size="sm"
                      >
                        Add First Address
                      </CustomButton>
                    </div>
                  ) : (
                    addresses.map((address) => {
                      const isSelected = selectedAddress?.id === address.id
                      return (
                        <motion.div
                          key={address.id}
                          layout
                          className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "border-sky-500 bg-sky-50 shadow-sky-200/50"
                              : "border-slate-200 hover:border-slate-300 hover:shadow-xl"
                          }`}
                          onClick={() => handleAddressSelection(address)}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                                    isSelected
                                      ? "bg-sky-500 text-white"
                                      : "bg-gradient-to-br from-slate-400 to-slate-500 text-white"
                                  }`}
                                >
                                  <MapPinIcon />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-bold text-slate-800 mb-2">{address.name}</h4>
                                  <p className="text-slate-600 mb-2">{address.addressLine}</p>
                                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                                    <span>{address.city}</span>
                                    <span>•</span>
                                    <span>{address.state}</span>
                                    <span>•</span>
                                    <span>{address.pincode}</span>
                                  </div>
                                  {address.landmark && (
                                    <p className="text-sm text-slate-500 mt-1">Near: {address.landmark}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isSelected && (
                                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                                    <CheckIcon />
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingAddress(address)
                                    setShowAddressForm(true)
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteConfirmation({
                                      show: true,
                                      type: "address",
                                      item: address,
                                      loading: false,
                                    })
                                  }}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>

                {selectedAddress && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <h5 className="font-semibold text-sky-800 mb-2">Selected Address</h5>
                    <p className="text-sky-700 text-sm">{selectedAddress.name}</p>
                    <p className="text-sky-600 text-sm">{selectedAddress.addressLine}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <CustomButton onClick={handleProceedToPayment} size="lg" className="px-12">
                Proceed to Payment
                <ArrowRightIcon />
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
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Payment</h2>
              <CustomButton onClick={() => setCurrentStep(1)} variant="secondary" size="sm">
                <ArrowLeftIcon />
                Back to Details
              </CustomButton>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
                  <h3 className="text-xl font-bold text-slate-800">Order Summary</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {localCart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-slate-800">{item.product?.name}</h4>
                          <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>₹{originalTotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>₹{finalTotalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <h3 className="text-xl font-bold text-slate-800">Booking Details</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                        <UserIcon />
                        <span className="ml-2">Selected Members ({selectedMembers.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {selectedMembers.map((member) => (
                          <div key={member.id} className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{member.name}</p>
                                <p className="text-sm text-slate-500">
                                  {member.relation} • {member.gender} • {member.age} years
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedAddress && (
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                          <MapPinIcon />
                          <span className="ml-2">Delivery Address</span>
                        </h4>
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h5 className="font-medium text-slate-800">{selectedAddress.name}</h5>
                          <p className="text-slate-600 mt-1">{selectedAddress.addressLine}</p>
                          <p className="text-slate-500 text-sm mt-1">
                            {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                          </p>
                          {selectedAddress.landmark && (
                            <p className="text-slate-500 text-sm">Near: {selectedAddress.landmark}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <CustomButton onClick={handleCheckout} fullWidth size="lg" isLoading={checkoutLoading}>
                      <LockIcon />
                      Pay ₹{finalTotalPrice.toFixed(2)} Securely
                    </CustomButton>
                    <div className="mt-4 flex items-center justify-center text-sm text-slate-500">
                      <ShieldCheckIcon />
                      <span className="ml-2">Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Cart
