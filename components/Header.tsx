"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import ProfileSidebar from "./ProfileSidebar"
import { useCart } from "./CartContext"
import Image from "next/image"
import {
  Menu,
  X,
  CheckCircle,
  Heart,
  Star,
  ShoppingCart,
  User,
  Home,
  Stethoscope,
  Search,
  Users,
  Droplet,
  Camera,
  BookOpen,
  FileText,
  Info,
  Phone,
  CircleHelp,
  Handshake,
  PhoneCall,
} from "lucide-react"

const EnhancedHospitalHeader = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)
  const [discountBar, setDiscountBar] = useState<{ title: string; discountCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname()
  const router = useRouter()

  // Get cart total items from CartContext
  const { totalItems } = useCart()

  const isBookingsPage = pathname === "/booking-reports"
  const isHomePage = pathname === "/" || pathname === ""

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle profile sidebar
  const toggleProfileSidebar = () => {
    setProfileSidebarOpen(!profileSidebarOpen)
  }

  useEffect(() => {
    const fetchDiscountBar = async () => {
      try {
        const res = await fetch("https://redtestlab.com/api/stickdiscountbar");
        if (!res.ok) throw new Error("Failed to fetch discount bar");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDiscountBar({ title: data[0].title, discountCode: data[0].discountCode });
        }
      } catch (err) {
        setDiscountBar(null);
      }
    };
    fetchDiscountBar();
  }, []);

  const handleCopyDiscount = () => {
    if (discountBar?.discountCode) {
      navigator.clipboard.writeText(discountBar.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full font-sans relative z-50">
      {/* Profile Sidebar */}
      <ProfileSidebar isOpen={profileSidebarOpen} onClose={() => setProfileSidebarOpen(false)} />
      {/* Notification Banner with improved animation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-2 sm:px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="relative flex items-center justify-center text-xs sm:text-sm">
          {discountBar ? (
            <>
              <span className="font-medium">{discountBar.title}</span>
              <button
                className="ml-2 sm:ml-4 bg-white text-blue-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors duration-200 transform hover:scale-105 shadow-md"
                onClick={handleCopyDiscount}
              >
                {copied ? "Copied!" : "CLAIM"}
              </button>
            </>
          ) : (
            <span className="font-medium">Special Offer</span>
          )}
        </div>
      </div>
      {/* Top Navigation Bar with improved gradient and shadow */}
      <div
        className={`flex items-center justify-between px-3 sm:px-8 md:px-12 py-3 sm:py-4 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-white to-gray-50 shadow-sm"
        }`}
      >
        {/* Mobile menu button - moved to left side on mobile */}
        <button
          className="md:hidden flex items-center justify-center p-1.5 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        {/* Enhanced Logo with improved animation - simplified for mobile */}
        <div
          className="flex items-center group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            <div
              className={`absolute -inset-1 bg-red-600/10 rounded-full blur-sm opacity-0 ${
                isHovered ? "opacity-100" : ""
              } transition-opacity duration-300`}
            ></div>
          </div>
          <Link href="/">
            <div className="ml-2 sm:ml-3">
              <Image
                src="https://res.cloudinary.com/dtcucixii/image/upload/v1750265141/Redtest_lab_logo_luyjlk.jpg"
                alt="RedTest Labs"
                width={100}
                height={40}
                className="h-9 sm:h-10 object-contain"
              />
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300"></div>
            </div>
          </Link>
        </div>
        {/* Center info badges with improved styling - hidden on mobile */}
        <div className="hidden lg:flex space-x-6">
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
            <CheckCircle className="text-green-500 mr-2 h-4 w-4" />
            <span className="text-xs font-medium text-gray-700">NABL Accredited</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
            <Heart className="text-blue-500 mr-2 h-4 w-4" />
            <span className="text-xs font-medium text-gray-700">Trusted by 10M+</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
            <Star className="text-yellow-500 mr-2 h-4 w-4" />
            <span className="text-xs font-medium text-gray-700">4.9/5 Rating</span>
          </div>
        </div>
        {/* Right Side Navigation Items */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          {/* Cart Button with improved counter display */}
          <Link href="/cart">
            <div className="flex items-center group cursor-pointer relative">
              <div className="relative mr-3">
                {/* Improved cart count indicator - Now dynamic based on totalItems */}
                {totalItems > 0 && (
                  <div className="absolute -top-3 -right-2 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full transform transition-transform duration-500 group-hover:scale-110 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <span className="text-white text-xs font-bold">{totalItems}</span>
                    {/* Pulsating effect for notifications */}
                    <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping"></span>
                  </div>
                )}
                <ShoppingCart className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200 transform group-hover:scale-110 h-5 w-5" />
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-red-500/0 group-hover:bg-red-500/10 blur-md transition-all duration-300"></div>
              </div>
              {/* <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 hidden sm:inline">                Cart              </span> */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-300"></div>
            </div>
          </Link>
          {/* Profile Button with enhanced hover effect - Updated to toggle profile sidebar */}
          <div className="flex items-center group cursor-pointer relative" onClick={toggleProfileSidebar}>
            <div className="p-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300 shadow-sm overflow-hidden">
              <div className="relative">
                <User className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200 relative z-10 h-4 w-4" />
                <div className="absolute inset-0 bg-blue-300 blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
            {/* <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 hidden sm:inline">              Profile            </span> */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"></div>
          </div>
        </div>
      </div>
      {/* Mobile Menu - only visible when mobileMenuOpen is true */}
      <div
        className={`md:hidden ${mobileMenuOpen ? "fixed inset-0 z-50 bg-black bg-opacity-50" : "hidden"}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                {/* Custom SVG for logo in mobile menu header */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4L4 8L12 12L20 8L12 4Z"
                    stroke="#B91C1C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(220, 38, 38, 0.1)"
                  />
                  <path
                    d="M4 16L12 20L20 16"
                    stroke="#B91C1C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(220, 38, 38, 0.05)"
                  />
                  <path
                    d="M4 12L12 16L20 12"
                    stroke="#B91C1C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="rgba(220, 38, 38, 0.05)"
                  />
                </svg>
                <span className="ml-2 font-bold text-gray-900">RedTest Labs</span>
              </div>
              <button
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Mobile menu content */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Main navigation links */}
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Navigation
              </div>
              {/* Home */}
              <Link href="/" className="no-underline" onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center px-4 py-3 ${
                    isHomePage ? "bg-pink-50 border-l-4 border-pink-500" : "hover:bg-gray-50"
                  }`}
                >
                  <Home className={isHomePage ? "text-pink-500 mr-3 h-4 w-4" : "text-gray-700 mr-3 h-4 w-4"} />
                  <div>
                    <div className={`font-medium ${isHomePage ? "text-pink-600" : "text-gray-900"}`}>Home</div>
                    <div className="text-xs text-gray-500">Welcome to RedTest Labs</div>
                  </div>
                </div>
              </Link>
              {/* Health Packages */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/all")}>
                <Stethoscope className="text-pink-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Health Packages</div>
                  <div className="text-xs text-gray-500">Comprehensive health checkups</div>
                </div>
              </div>
              {/* Find a Test */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/test")}>
                <Search className="text-blue-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Find a Test</div>
                  <div className="text-xs text-gray-500">Search for specific tests</div>
                </div>
              </div>
              {/* Top Hospital */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/hospital")}>
                <Users className="text-green-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Top Hospital</div>
                  <div className="text-xs text-gray-500">Consult with specialists</div>
                </div>
              </div>
              {/* Blood Tests */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/test")}>
                <Droplet className="text-red-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Blood Tests</div>
                  <div className="text-xs text-gray-500">Complete blood analysis</div>
                </div>
              </div>
              {/* Scan Tests */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/scans")}>
                <Camera className="text-purple-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Scan Tests</div>
                  <div className="text-xs text-gray-500">X-Ray, MRI, CT scans</div>
                </div>
              </div>
              {/* Blog */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/blog")}>
                <BookOpen className="text-indigo-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Blog</div>
                  <div className="text-xs text-gray-500">Health tips and articles</div>
                </div>
              </div>
              {/* Bookings & Reports */}
              <Link href="/booking-reports" className="no-underline" onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center px-4 py-3 ${
                    isBookingsPage ? "bg-pink-50 border-l-4 border-pink-500" : "hover:bg-gray-50"
                  }`}
                >
                  <FileText className={isBookingsPage ? "text-pink-500 mr-3 h-4 w-4" : "text-gray-700 mr-3 h-4 w-4"} />
                  <div>
                    <div className={`font-medium ${isBookingsPage ? "text-pink-600" : "text-gray-900"}`}>
                      Bookings & Reports
                    </div>
                    <div className="text-xs text-gray-500">View your test reports</div>
                  </div>
                </div>
              </Link>
              {/* Support & Info section */}
              <div className="px-4 py-2 mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Support & Info
              </div>
              {/* About Us */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/about")}>
                <Info className="text-orange-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">About Us</div>
                  <div className="text-xs text-gray-500">Learn more about our services</div>
                </div>
              </div>
              {/* Contact Us */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/contact")}>
                <Phone className="text-teal-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Contact Us</div>
                  <div className="text-xs text-gray-500">Get in touch with us</div>
                </div>
              </div>
              {/* Terms & Conditions */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/terms")}>
                <FileText className="text-gray-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Terms & Conditions</div>
                  <div className="text-xs text-gray-500">Legal terms and policies</div>
                </div>
              </div>
              {/* Help & Support */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/help")}>
                <CircleHelp className="text-blue-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Help & Support</div>
                  <div className="text-xs text-gray-500">FAQ and customer support</div>
                </div>
              </div>
              {/* Partnership */}
              <div className="px-4 py-3 hover:bg-gray-50 flex items-center" onClick={() => router.push("/partnership")}>
                <Handshake className="text-amber-500 mr-3 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">Partnership</div>
                  <div className="text-xs text-gray-500">Business partnerships</div>
                </div>
              </div>
            </div>
            {/* Mobile menu footer */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">898 898 8787</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                      24/7 Support
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Navigation Bar - hidden on mobile */}
      <div
        className={`hidden md:flex items-center justify-between px-12 py-5 backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-white/95 shadow-md" : "bg-gradient-to-r from-gray-50/95 to-gray-100/95 shadow-md"
        }`}
      >
        {/* Left: Menu with enhanced hover effect */}
        <div className="flex items-center cursor-pointer group ml-10" onClick={() => setMenuOpen(!menuOpen)}>
          <div
            className={`p-2 rounded-full bg-white group-hover:bg-gray-100 transition-all duration-300 shadow-sm ${
              menuOpen ? "rotate-90" : ""
            }`}
          >
            <Menu className={`transition-transform duration-300 ${menuOpen ? "transform rotate-90" : ""} h-4 w-4`} />
          </div>
          <span className="ml-3 font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            Menu
          </span>
          {menuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-100 animate-fadeIn z-50">
              <div className="grid grid-cols-3 gap-6 p-6 w-[720px]">
                {/* Services Column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    Our Services
                  </h3>
                  <div className="space-y-2">
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/")}
                    >
                      <Home className="text-gray-500 mr-2 h-4 w-4" />
                      Home
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/all")}
                    >
                      <Stethoscope className="text-pink-500 mr-2 h-4 w-4" />
                      Health Packages
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/test")}
                    >
                      <Search className="text-blue-500 mr-2 h-4 w-4" />
                      Find a Test
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/hospital")}
                    >
                      <Users className="text-green-500 mr-2 h-4 w-4" />
                      Top Hospital
                    </div>
                  </div>
                </div>
                {/* Tests Column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    Tests & Diagnostics
                  </h3>
                  <div className="space-y-2">
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/test")}
                    >
                      <Droplet className="text-red-500 mr-2 h-4 w-4" />
                      Blood Tests
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/scans")}
                    >
                      <Camera className="text-purple-500 mr-2 h-4 w-4" />
                      Scan Tests
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/blog")}
                    >
                      <BookOpen className="text-indigo-500 mr-2 h-4 w-4" />
                      Blog
                    </div>
                  </div>
                </div>
                {/* Support Column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    Support & Info
                  </h3>
                  <div className="space-y-2">
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/about")}
                    >
                      <Info className="text-orange-500 mr-2 h-4 w-4" />
                      About Us
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/contact")}
                    >
                      <Phone className="text-teal-500 mr-2 h-4 w-4" />
                      Contact Us
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/help")}
                    >
                      <CircleHelp className="text-blue-500 mr-2 h-4 w-4" />
                      Help & Support
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/terms")}
                    >
                      <FileText className="text-gray-500 mr-2 h-4 w-4" />
                      Terms & Conditions
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium transition-colors duration-200 flex items-center"
                      onClick={() => router.push("/partnership")}
                    >
                      <Handshake className="text-amber-500 mr-2 h-4 w-4" />
                      Partnership
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Center: Main Navigation menu items with refined hover and active states */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <div className="flex space-x-28">
            {/* Book a Test */}
            <Link href="/" className="no-underline">
              <div className="group flex flex-col items-center relative">
                <div className="flex items-center pb-1">
                  <div
                    className={`p-1.5 rounded-md ${
                      isHomePage ? "bg-pink-100" : "bg-transparent group-hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    <Home
                      className={
                        isHomePage ? "text-pink-500 h-4 w-4" : "text-gray-700 group-hover:text-gray-900 h-4 w-4"
                      }
                    />
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      isHomePage ? "text-pink-600 font-semibold" : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    Book a Test
                  </span>
                  {isHomePage && (
                    <span className="flex h-2 w-2 relative ml-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                  )}
                </div>
                <div
                  className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                    isHomePage ? "bg-gradient-to-r from-pink-400 to-pink-600 w-full" : "bg-gray-400"
                  }`}
                ></div>
              </div>
            </Link>
            {/* Bookings & Reports */}
            <Link href="/booking-reports" className="no-underline">
              <div className="group flex flex-col items-center relative">
                <div className="flex items-center pb-1">
                  <div
                    className={`p-1.5 rounded-md ${
                      isBookingsPage ? "bg-pink-100" : "bg-transparent group-hover:bg-gray-100"
                    } transition-colors duration-200`}
                  >
                    <FileText
                      className={
                        isBookingsPage ? "text-pink-500 h-4 w-4" : "text-gray-700 group-hover:text-gray-900 h-4 w-4"
                      }
                    />
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      isBookingsPage ? "text-pink-500 font-semibold" : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    Bookings & Reports
                  </span>
                  {isBookingsPage && (
                    <span className="flex h-2 w-2 relative ml-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                  )}
                </div>
                <div
                  className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                    isBookingsPage ? "bg-gradient-to-r from-pink-400 to-pink-600 w-full" : "bg-gray-400"
                  }`}
                ></div>
              </div>
            </Link>
          </div>
        </div>
        {/* Right: Phone Number with enhanced styling and animation */}
        <div className="flex items-center cursor-pointer group relative overflow-hidden">
          <div className="relative p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
            <PhoneCall className="text-white relative z-10 h-4 w-4" />
            {/* Enhanced ripple effect */}
            <span className="absolute top-0 left-0 right-0 bottom-0 bg-white rounded-full opacity-30 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-1000"></span>
            {/* Active indicator with pulse */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
          </div>
          <div className="ml-3 font-medium">
            <span className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200 flex items-center">
              898 898 8787
              <PhoneCall className="ml-2 text-green-500 transform group-hover:rotate-12 transition-transform duration-300 h-3 w-3" />
            </span>
            <div className="text-xs text-gray-500 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedHospitalHeader
