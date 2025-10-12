"use client"

import { useState, useEffect, useRef } from "react"
import { User, Settings, LogOut, Menu, AlignJustify, UserCircle } from "lucide-react"

interface DeliveryUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: string
  isActive: boolean
  isAvailable: boolean
  totalCollections: number
  rating: number
  totalEarnings: number
  profileImageUrl: string | null
}

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeliveryNavbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const [user, setUser] = useState<DeliveryUser | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("deliveryUser")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken")
    localStorage.removeItem("deliveryUser")
    window.location.href = "/delivery/login"
  }

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 bg-white border-b border-orange-100 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Menu button for mobile */}
        <button
          className="block lg:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 transition-colors border-1 border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <AlignJustify size={24} className="text-gray-800" />
        </button>

        {/* Left side content for desktop - can be added here if needed */}
        <div className="hidden lg:block"></div>

        {/* Right aligned user menu */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-1 p-1.5 hover:bg-orange-50 rounded-full"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center"><svg class="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                      }
                    }}
                  />
                ) : (
                  <User className="h-4 w-4 text-orange-600" />
                )}
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-orange-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-orange-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Delivery Boy"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "delivery@redtestlab.com"}</p>
                </div>
                
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors">
                  <UserCircle className="h-4 w-4 inline mr-2" />
                  Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
