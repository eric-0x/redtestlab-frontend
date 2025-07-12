"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for our cart items and context
export interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  category?: {
    id: number
    name: string
  }
}

export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  price: number
  addedAt: string
  product: Product
}

export interface Cart {
  appliedCoupon: any
  discountedTotal: number
  discountAmount: number
  originalTotal: number
  id: number
  userId: number
  createdAt: string
  updatedAt: string
  items: CartItem[]
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateCartItem: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  clearCart: () => void
  refreshCart: () => Promise<void>
  totalItems: number
  totalPrice: number
  isAuthenticated: boolean
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  error: null,
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: () => {},
  refreshCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
  isAuthenticated: false,
})

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Calculate total items and price
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalPrice = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken")
      const newAuthState = !!token
      setIsAuthenticated(newAuthState)

      // Only fetch cart if authenticated and we don't have cart data yet
      if (newAuthState && !cart) {
        fetchCart()
      } else if (!newAuthState) {
        // Clear cart if not authenticated
        setCart(null)
        setError(null)
      }
    }

    // Check initially
    checkAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userToken") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events when login happens in the same tab
    const handleAuthChange = () => {
      setTimeout(checkAuth, 100) // Small delay to ensure token is set
    }

    window.addEventListener("authStateChanged", handleAuthChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authStateChanged", handleAuthChange)
    }
  }, [cart])

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("userToken")
    if (!token) return null
    return token
  }

  // Fetch cart data
  const fetchCart = async () => {
    const token = getToken()
    if (!token) {
      setError("User not authenticated")
      setIsAuthenticated(false)
      return
    }

    setLoading(true)
    setError(null) // Clear any previous errors

    try {
      const response = await fetch("https://redtestlab.com/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear auth state
          localStorage.removeItem("userToken")
          localStorage.removeItem("userData")
          localStorage.removeItem("userId")
          setIsAuthenticated(false)
          setError("Session expired. Please login again.")
          return
        }

        const errorText = await response.text()
        console.error("Cart fetch error response:", errorText)
        throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setCart(data)
      setError(null)
      setIsAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching cart:", err)
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    const token = getToken()
    if (!token) {
      setError("User not authenticated")
      setIsAuthenticated(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://redtestlab.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Add to cart error response:", errorText)
        throw new Error(`Failed to add item to cart: ${response.status} ${response.statusText}`)
      }

      // Refresh cart after adding item
      await fetchCart()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error adding to cart:", err)
    } finally {
      setLoading(false)
    }
  }

  // Update cart item
  const updateCartItem = async (productId: number, quantity: number) => {
    const token = getToken()
    if (!token) {
      setError("User not authenticated")
      setIsAuthenticated(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://redtestlab.com/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Update cart error response:", errorText)
        throw new Error(`Failed to update cart item: ${response.status} ${response.statusText}`)
      }

      // Refresh cart after updating
      await fetchCart()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error updating cart:", err)
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeFromCart = async (productId: number) => {
    const token = getToken()
    if (!token) {
      setError("User not authenticated")
      setIsAuthenticated(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://redtestlab.com/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Remove from cart error response:", errorText)
        throw new Error(`Failed to remove item from cart: ${response.status} ${response.statusText}`)
      }

      // Refresh cart after removing item
      await fetchCart()
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error removing from cart:", err)
    } finally {
      setLoading(false)
    }
  }

  // Clear cart (local function only, no API call)
  const clearCart = () => {
    setCart(null)
  }

  // Refresh cart function
  const refreshCart = async () => {
    if (isAuthenticated) {
      await fetchCart()
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
