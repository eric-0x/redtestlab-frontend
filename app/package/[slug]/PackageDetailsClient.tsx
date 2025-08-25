"use client"

import { ChevronDown, Share2, Phone, Users, Shield, Clock, Award, ChevronRight, Star, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/CartContext"

// Interfaces
interface Parameter {
  id: number;
  name: string;
  unit: string;
  referenceRange: string;
  productId: number;
}

interface TestProduct {
  id: number;
  name: string;
  reportTime: number;
  tags: string;
  actualPrice: number;
  discountedPrice: number;
  categoryId: number;
  productType: string;
  Parameter: Parameter[];
}

interface ProductPackageLink {
  id: number;
  packageId: number;
  testId: number;
  Product_ProductPackageLink_testIdToProduct: TestProduct;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  productId: number;
}

interface PackageData {
  id: number;
  name: string;
  reportTime: string;
  tags: string;
  actualPrice: number;
  discountedPrice: number;
  categoryId: number;
  description?: string;
  overview?: string;
  FAQ?: FAQ[];
  productType: string;
  ProductPackageLink_ProductPackageLink_packageIdToProduct?: ProductPackageLink[];
}

export default function PackageDetailsClient({ slug }: { slug?: string }) {
  const [activeTab, setActiveTab] = useState("details")
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    testDetails: true,
    faq: true,
  })
  const [activeFAQId, setActiveFAQId] = useState<number | null>(null)
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [popularTests, setPopularTests] = useState<PackageData[]>([])
  const [bookingTestId, setBookingTestId] = useState<number | null>(null)

  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        const response = await fetch(`https://redtestlab.com/api/product/slug/${slug}`)
        
        if (!response.ok) {
          throw new Error("Package not found")
        }
        
        const data = await response.json()
        setPackageData(data)
      } catch (err) {
        console.error("Error fetching package data:", err)
        setError(err instanceof Error ? err.message : "Failed to load package")
      } finally {
        setLoading(false)
      }
    }

    const fetchPopularTests = async () => {
      try {
        const response = await fetch("https://redtestlab.com/api/product/type/packages")
        if (response.ok) {
          const data = await response.json()

          // Prefer categoryId 14, but ensure we always have 4 items
          const preferred = data.filter((item: PackageData) => item.categoryId === 14)
          const popular: PackageData[] = []

          // add up to 4 from preferred
          for (const p of preferred) {
            if (popular.length >= 4) break
            popular.push(p)
          }

          // if still less than 4, fill from other items
          if (popular.length < 4) {
            for (const p of data) {
              if (popular.length >= 4) break
              if (!popular.find((x) => x.id === p.id)) popular.push(p)
            }
          }

          // if still less than 4, try to pull linked tests from the current packageData
          if (popular.length < 4 && packageData?.ProductPackageLink_ProductPackageLink_packageIdToProduct) {
            for (const link of packageData.ProductPackageLink_ProductPackageLink_packageIdToProduct) {
              if (popular.length >= 4) break
              const prod = link.Product_ProductPackageLink_testIdToProduct as unknown as PackageData
              if (prod && !popular.find((x) => x.id === prod.id)) popular.push(prod)
            }
          }

          // finally if still less than 4, pad with placeholders
          while (popular.length < 4) {
            const placeholderId = -1 * (popular.length + 1)
            popular.push({
              id: placeholderId,
              name: "Health Package",
              reportTime: "24",
              tags: "",
              actualPrice: 1000,
              discountedPrice: 799,
              categoryId: 14,
              productType: "package",
            } as PackageData)
          }

          setPopularTests(popular.slice(0, 4))
        }
      } catch (err) {
        console.error("Error fetching popular tests:", err)
      }
    }

    fetchPackageData()
    fetchPopularTests()
  }, [slug])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Accordion: only one FAQ open at a time
  const toggleFAQ = (faqId: number) => {
    setActiveFAQId((prev) => (prev === faqId ? null : faqId))
  }

  const handleBackClick = () => {
    router.push("/")
  }

  const handleAddToCart = async () => {
    if (!packageData) return
    
    try {
      setAddingToCart(true)
      await addToCart(packageData.id, 1)
      router.push("/cart")
    } catch (err) {
      console.error("Error adding to cart:", err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBookPopularTest = async (testId: number) => {
    try {
      setBookingTestId(testId)
      await addToCart(testId, 1)
      router.push("/cart")
    } catch (err) {
      console.error("Error booking test:", err)
    } finally {
      setBookingTestId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The package you're looking for doesn't exist."}</p>
          <Button onClick={handleBackClick}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const discountPercentage = Math.round(
    ((packageData.actualPrice - packageData.discountedPrice) / packageData.actualPrice) * 100
  )

  const allParameters = packageData.ProductPackageLink_ProductPackageLink_packageIdToProduct
    ?.flatMap(link => link.Product_ProductPackageLink_testIdToProduct.Parameter || []) || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Package Header */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {packageData.name}
                      </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                      <div className="flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-2 rounded-md border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">Popular Package</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-700">
                        <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                        <span className="font-semibold">4.9 (Reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 ml-2">
                    <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Gender</p>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">Male, Female</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Report Time</p>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">{packageData.reportTime} hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border sm:col-span-2 md:col-span-1">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Sample Type</p>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">Blood Sample</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Overview */}
            <Card className="border-0 shadow-sm bg-white">
              <Collapsible open={expandedSections.overview} onOpenChange={() => toggleSection("overview")}>
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-bold text-lg sm:text-xl text-gray-900 hover:text-blue-600"
                    >
                      Test Overview
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-800 border-blue-200 font-semibold text-xs sm:text-sm"
                        >
                          Essential Test
                        </Badge>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedSections.overview ? "rotate-180" : ""}`}
                        />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-4 sm:px-6">
                    <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200 mb-4 sm:mb-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">
                            {packageData.FAQ && packageData.FAQ.length > 0 
                              ? packageData.FAQ[0].question 
                              : `What is ${packageData.name}?`
                            }
                          </h3>
                          {packageData.FAQ && packageData.FAQ.length > 0 ? (
                            <p className="text-gray-800 leading-relaxed text-sm sm:text-base font-medium">
                              {packageData.FAQ[0].answer}
                            </p>
                          ) : packageData.overview ? (
                            <div 
                              className="text-gray-800 leading-relaxed text-sm sm:text-base font-medium prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: packageData.overview }}
                            />
                          ) : (
                            <p className="text-gray-800 leading-relaxed text-sm sm:text-base font-medium">
                              {packageData.description || `${packageData.name} is a comprehensive health package that evaluates your overall health and detects various disorders through multiple tests.`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-gray-800">
                      {packageData.FAQ && packageData.FAQ.length > 0 ? (
                        // If FAQ exists, show overview content here
                        packageData.overview ? (
                          <div 
                            className="leading-relaxed text-sm sm:text-base font-medium prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: packageData.overview }}
                          />
                        ) : (
                          <>
                            <p className="leading-relaxed text-sm sm:text-base font-medium">
                              The package measures comprehensive health markers and provides crucial insights into your overall health status.
                            </p>
                            <p className="leading-relaxed text-sm sm:text-base font-medium">
                              Normal values vary based on age and gender. By monitoring these levels, your doctor can assess your general health and detect potential illnesses early, enabling timely intervention and treatment.
                            </p>
                          </>
                        )
                      ) : (
                        // If no FAQ, show default content
                        <>
                          <p className="leading-relaxed text-sm sm:text-base font-medium">
                            The package measures comprehensive health markers and provides crucial insights into your overall health status.
                          </p>
                          <p className="leading-relaxed text-sm sm:text-base font-medium">
                            Normal values vary based on age and gender. By monitoring these levels, your doctor can assess your general health and detect potential illnesses early, enabling timely intervention and treatment.
                          </p>
                        </>
                      )}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                      >
                        Read Complete Medical Guide
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                {
                  icon: Award,
                  title: "NABL Certified",
                  subtitle: "Accredited Labs",
                  color: "text-yellow-600",
                  bg: "bg-yellow-50",
                  border: "border-yellow-200",
                },
                {
                  icon: Users,
                  title: "Doctor Trusted",
                  subtitle: "98% Accuracy",
                  color: "text-red-600",
                  bg: "bg-red-50",
                  border: "border-red-200",
                },
                {
                  icon: Shield,
                  title: "Quality Assured",
                  subtitle: "ISO Certified",
                  color: "text-green-600",
                  bg: "bg-green-50",
                  border: "border-green-200",
                },
                {
                  icon: Clock,
                  title: "Same Day",
                  subtitle: "Results",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className={`border ${item.border} ${item.bg} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center bg-white`}>
                        <item.icon className={`w-4 sm:w-5 h-4 sm:h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-xs sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium">{item.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Test Details */}
            <Card className="border-0 shadow-sm bg-white">
              <Collapsible open={expandedSections.testDetails} onOpenChange={() => toggleSection("testDetails")}>
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-bold text-lg sm:text-xl text-gray-900 hover:text-blue-600"
                    >
                      Test Parameters
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-800 border-blue-200 font-semibold text-xs sm:text-sm"
                        >
                          {allParameters.length} Parameters
                        </Badge>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedSections.testDetails ? "rotate-180" : ""}`}
                        />
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {allParameters.map((param, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg border">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-800 font-medium break-words">{param.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* FAQ */}
            {packageData.FAQ && Array.isArray(packageData.FAQ) && packageData.FAQ.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <Collapsible open={expandedSections.faq} onOpenChange={() => toggleSection("faq")}>
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto font-bold text-lg sm:text-xl text-gray-900 hover:text-blue-600"
                      >
                        Frequently Asked Questions
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedSections.faq ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                  <CardContent className="pt-0 px-4 sm:px-6">
                    <div className="space-y-3">
                      {packageData.FAQ.map((faqItem: FAQ) => {
                        const isOpen = activeFAQId === faqItem.id
                        return (
                          <Collapsible
                            key={faqItem.id}
                            open={isOpen}
                            onOpenChange={() => toggleFAQ(faqItem.id)}
                          >
                            <div className={`overflow-hidden rounded-lg border ${isOpen ? 'border-gray-200' : 'border-transparent'} bg-white`}>
                              <CollapsibleTrigger asChild>
                                <button
                                  className={`w-full text-left py-3 sm:py-4 px-3 sm:px-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors duration-150 ${isOpen ? 'bg-gray-50' : ''}`}
                                >
                                  <span className="text-gray-800 font-semibold text-sm sm:text-base leading-relaxed flex-1 min-w-0 break-words">
                                    {faqItem.question}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-600' : 'text-gray-400'}`}
                                  />
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                {/* Animated container: transition on max-height and opacity for smooth open/close */}
                                <div
                                  className="px-3 sm:px-4 pb-3 sm:pb-4"
                                  style={{
                                    transition: 'max-height 260ms ease, opacity 200ms ease',
                                    maxHeight: isOpen ? '1200px' : '0px',
                                    opacity: isOpen ? 1 : 0,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div className="bg-white p-3 sm:p-4 border-t border-gray-200">
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                      {faqItem.answer}
                                    </p>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Pricing Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-4 sm:p-6 text-center">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-800 border-green-200 mb-3 sm:mb-4 font-semibold text-xs sm:text-sm"
                >
                  {discountPercentage}% OFF
                </Badge>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">{packageData.name}</h3>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl text-gray-600 line-through font-medium">₹{packageData.actualPrice}</span>
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-800 border-red-200 font-semibold text-xs sm:text-sm"
                    >
                      {discountPercentage}% OFF
                    </Badge>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">₹{packageData.discountedPrice}</div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Inclusive of all taxes</p>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold rounded-lg text-sm sm:text-base"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding...
                    </div>
                  ) : (
                    "Book Now"
                  )}
                </Button>

               
              </CardContent>
            </Card>

            {/* Call Support */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 sm:p-6 text-center">
                <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">Need Help Choosing?</h4>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 leading-relaxed font-medium">
                  Get expert guidance from our healthcare professionals.
                </p>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent font-semibold text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Talk to Expert
                </Button>
              </CardContent>
            </Card>

            {/* Promotional Banner */}
            <Card className="border-0 shadow-sm bg-blue-600 text-white">
              <CardContent className="p-4 sm:p-6 text-center">
                <p className="text-lg sm:text-xl font-bold mb-1">Up to</p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">77% Off</p>
                <p className="text-sm sm:text-base opacity-90 font-medium">on Health & Medical Packages</p>
              </CardContent>
            </Card>

            {/* Most Frequently Booked */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="bg-gray-50 px-4 sm:px-6">
                <CardTitle className="text-center text-gray-900 text-lg sm:text-xl font-bold">
                  Most Frequently Booked Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3">
                  {popularTests.length > 0 ? (
                    popularTests.map((test) => {
                      const discountPercentage = Math.round(
                        ((test.actualPrice - test.discountedPrice) / test.actualPrice) * 100
                      )
                      return (
                        <div
                          key={test.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex-1 pr-2 sm:pr-4 min-w-0">
                            <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight break-words">
                              {test.name}
                            </p>
                            {discountPercentage > 0 && (
                              <p className="text-xs text-green-600 font-medium">
                                {discountPercentage}% off
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-sm sm:text-base font-bold text-blue-600">₹{test.discountedPrice}</p>
                              {discountPercentage > 0 && (
                                <p className="text-xs text-gray-500 line-through">₹{test.actualPrice}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 font-semibold whitespace-nowrap"
                              onClick={() => handleBookPopularTest(test.id)}
                              disabled={bookingTestId === test.id}
                            >
                              {bookingTestId === test.id ? (
                                <div className="flex items-center gap-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                  <span>...</span>
                                </div>
                              ) : (
                                "Book Now"
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Loading popular tests...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
