"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Bell, User, Menu, LogOut, ChevronDown } from 'lucide-react'

type NavbarProps = {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar = ({ sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    // Remove admin token from localStorage
    localStorage.removeItem('adminToken')
    
    // Redirect to admin login
    window.location.href = '/admin'
  }

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 bg-white border-b border-gray-200 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Menu button for mobile */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Left side content for desktop - can be added here if needed */}
        <div className="hidden lg:block"></div>

        {/* Right aligned icons */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button> */}

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center space-x-1 p-1.5 hover:bg-gray-100 rounded-full"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User className="h-6 w-6" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar