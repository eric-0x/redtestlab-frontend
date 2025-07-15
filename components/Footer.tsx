"use client"

import  Link  from "next/link"
import { useState, useEffect } from "react"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Clock,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react"

interface Category {
  id: number
  name: string
  products: Product[]
}

interface Product {
  id: number
  name: string
  reportTime: number
  parameters: string
  tags: string
  actualPrice: number
  discountedPrice: number
  categoryId: number
  productType: string
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://redtestlab.com/api/category")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const categoriesData: Category[] = await response.json()

        // Filter categories that have at least one product with productType = "PACKAGE"
        const categoriesWithPackages = categoriesData.filter(
          (category) => category.products && category.products.some((product) => product.productType === "PACKAGE"),
        )

        setCategories(categoriesWithPackages)
      } catch (err) {
        console.error("Error fetching categories:", err)
        // Fallback to empty array if API fails
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-950 text-white">
      {/* Top Banner */}
      <div className="bg-blue-800 py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-sm">24/7 Customer Support</span>
          </div>
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm">HIPAA Compliant & Secure</span>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            <span className="text-sm">Trusted by 1M+ Patients</span>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-blue-800">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 md:w-1/2">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Stay Updated with Health Tips</h3>
              <p className="text-blue-200 text-sm md:text-base max-w-md">
                Subscribe to our newsletter for the latest health insights, service updates, and exclusive offers.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md bg-blue-800/50 border border-blue-700 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
                <button className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-blue-100 transition-colors font-medium flex items-center justify-center whitespace-nowrap">
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-blue-300 mt-2">
                By subscribing, you agree to our{" "}
                <Link href="/privacy-policy" className="underline hover:text-white">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">RedTest Lab</h2>
              <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-blue-200 mb-6">
              Empowering individuals with accessible, personalized healthcare solutions for a healthier tomorrow.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://youtube.com"
                className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
               
                { name: "Find a Doctor", href: "/doctors" },

                { name: "Health Blog", href: "/blog" },
            
                { name: "Careers", href: "/careers" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Dynamic Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Our Services
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-3 w-3 bg-blue-700 rounded-full mr-2 animate-pulse"></div>
                    <div className="h-4 bg-blue-700 rounded animate-pulse flex-1"></div>
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((category) => {
                  const packageCount = category.products.filter((product) => product.productType === "PACKAGE").length

                  return (
                    <li key={category.id}>
                      <Link
                        href={`/all?category=${category.id}`}
                        className="text-blue-200 hover:text-white transition-colors flex items-center group"
                      >
                        <CheckCircle className="h-3 w-3 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="flex-1">{category.name}</span>
                      
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <ul className="space-y-3">
                {/* Fallback to static services if API fails */}
                {[
                  {
                    name: "Preventive Health Checkups",
                    href: "/services/preventive",
                  },
                  { name: "Diagnostic Tests", href: "/services/diagnostics" },
                  { name: "Telemedicine", href: "/services/telemedicine" },
                  {
                    name: "Chronic Disease Management",
                    href: "/services/chronic-care",
                  },
                  {
                    name: "Mental Health Services",
                    href: "/services/mental-health",
                  },
                  { name: "Maternal & Child Health", href: "/services/maternal" },
                ].map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-blue-200 hover:text-white transition-colors flex items-center group"
                    >
                      <CheckCircle className="h-3 w-3 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
                <span className="text-blue-200">
                  Hajipur, Vaishali, Bihar, 
                  <br />
                  India 844101
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
                <Link href="tel:+18001234567" className="text-blue-200 hover:text-white">
                  +91 8804789764
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400 flex-shrink-0" />
                <Link href="mailto:info@myhealthplatform.com" className="text-blue-200 hover:text-white">
                  contact@redtestlab.com
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-blue-800/50 rounded-lg border border-blue-700/50 backdrop-blur-sm">
              <h4 className="font-medium mb-2">Emergency Helpline</h4>
              <Link
                href="tel:+18009119999"
                className="text-xl font-bold text-white hover:text-blue-200 transition-colors flex items-center"
              >
                <Phone className="h-5 w-5 mr-2 text-blue-400" />
                +91 8804789764
              </Link>
              <p className="text-xs text-blue-300 mt-1">Available 24/7 for medical emergencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm mb-4 md:mb-0">
              © {currentYear} RedTest Lab. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/privacy-policy" className="text-blue-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-blue-200 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-blue-200 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="text-blue-200 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
