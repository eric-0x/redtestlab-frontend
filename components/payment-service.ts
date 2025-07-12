// Utility functions for handling payments and bookings

interface PaymentOrderResponse {
  success: boolean
  orderId: string
  amount: number
  originalAmount: number
  discount: number
  currency: string
  couponApplied: any
}

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

// Function to create a payment order
export const createPaymentOrder = async (
  userId: number,
  type: "cart" | "direct",
  productId?: number,
  quantity?: number,
) => {
  try {
    // Create the request payload based on type
    const payload =
      type === "direct"
        ? {
            userId,
            type,
            productId,
            quantity: quantity || 1, // Default to 1 for direct purchases
          }
        : {
            userId,
            type,
          }

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

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to create payment order")
    }

    return data
  } catch (error) {
    console.error("Error creating payment order:", error)
    throw error
  }
}

// Function to create a booking after successful payment
export const createBooking = async (
  userId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  amount: number,
  type: "cart" | "direct",
  items: any[],
) => {
  try {
    const response = await fetch("https://redtestlab.com/api/bookings/create-booking", {
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
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        amount,
        type,
        items,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Booking creation failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

// Function to handle the Razorpay payment flow
export const processPayment = async (
  userId: number,
  type: "cart" | "direct",
  productId?: number,
  quantity?: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
  onCancel?: () => void,
) => {
  try {
    // Step 1: Create payment order
    const orderData = await createPaymentOrder(userId, type, productId, quantity)

    // Extract items for booking creation
    const items = orderData.items || []

    // Step 2: Configure Razorpay options
    const options = {
      key: "rzp_test_Iycvp4aODn242I", // Replace with your actual Razorpay key
      amount: orderData.amount * 100, // Amount in smallest currency unit (paise for INR)
      currency: orderData.currency,
      name: "Health Tests",
      description: type === "direct" ? "Payment for health test" : "Payment for health tests",
      order_id: orderData.orderId,
      handler: async (response: any) => {
        try {
          // Step 3: Create booking after successful payment
          await createBooking(userId, orderData.orderId, response.razorpay_payment_id, orderData.amount, type, items)

          // Call success callback if provided
          if (onSuccess) onSuccess()
        } catch (error) {
          // Call error callback if provided
          if (onError && error instanceof Error) onError(error)
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0284c7", // Sky-600 color to match your UI
      },
      modal: {
        ondismiss: () => {
          // Call cancel callback if provided
          if (onCancel) onCancel()
        },
      },
    }

    // Step 3: Open Razorpay payment dialog
    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options)
      razorpay.open()
      return true
    } else {
      throw new Error("Razorpay SDK failed to load. Please try again later.")
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    // Call error callback if provided
    if (onError && error instanceof Error) onError(error)
    return false
  }
}

// Function to create a payment order for custom package
export const createCustomPackagePaymentOrder = async (customPackageId: number) => {
  try {
    const token = localStorage.getItem("userToken")
    if (!token) {
      throw new Error("User not authenticated")
    }

    // Create payment order for custom package
    const response = await fetch("https://redtestlab.com/api/custom-bookings/create-payment-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ customPackageId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "Failed to create payment order")
    }

    return data
  } catch (error) {
    console.error("Error creating custom package payment order:", error)
    throw error
  }
}

// Function to create a booking for custom package after successful payment
export const createCustomPackageBooking = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  customPackageId: number,
) => {
  try {
    const token = localStorage.getItem("userToken")
    if (!token) {
      throw new Error("User not authenticated")
    }

    const response = await fetch("https://redtestlab.com/api/custom-bookings/create-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        customPackageId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Booking creation failed: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating custom package booking:", error)
    throw error
  }
}

// Function to handle the Razorpay payment flow for custom packages
export const processCustomPackagePayment = async (
  customPackageId: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
  onCancel?: () => void,
) => {
  try {
    // Step 1: Create payment order for custom package
    const orderData = await createCustomPackagePaymentOrder(customPackageId)

    // Step 2: Configure Razorpay options
    const options = {
      key: "rzp_test_Iycvp4aODn242I", // Replace with your actual Razorpay key
      amount: orderData.amount * 100, // Amount in smallest currency unit (paise for INR)
      currency: orderData.currency || "INR",
      name: "Health Tests",
      description: "Custom Package Payment",
      order_id: orderData.orderId,
      handler: async (response: any) => {
        try {
          // Step 3: Create booking after successful payment
          await createCustomPackageBooking(orderData.orderId, response.razorpay_payment_id, customPackageId)

          // Call success callback if provided
          if (onSuccess) onSuccess()
        } catch (error) {
          // Call error callback if provided
          if (onError && error instanceof Error) onError(error)
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#0284c7", // Sky-600 color to match your UI
      },
      modal: {
        ondismiss: () => {
          // Call cancel callback if provided
          if (onCancel) onCancel()
        },
      },
    }

    // Step 3: Open Razorpay payment dialog
    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options)
      razorpay.open()
      return true
    } else {
      throw new Error("Razorpay SDK failed to load. Please try again later.")
    }
  } catch (error) {
    console.error("Custom package payment processing error:", error)
    // Call error callback if provided
    if (onError && error instanceof Error) onError(error)
    return false
  }
}
