"use client"

import { ChevronDown, Share2, Phone, Users, Shield, Clock, Award, ChevronRight, Star, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

export default function CBCTestPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    testDetails: true,
    faq: true,
  })

  const router = useRouter()

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleBackClick = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Test Header */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {/* <div className="w-1 h-8 bg-blue-600 rounded-full"></div> */}
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        Complete Blood Count (CBC)
                      </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base">
                      <div className="flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-2 rounded-md border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">6,263+ booked recently</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-700">
                        <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
                        <span className="font-semibold">4.9 (2,847 reviews)</span>
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
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Preparation</p>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">No special preparation</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border sm:col-span-2 md:col-span-1">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Sample Type</p>
                      <p className="text-sm sm:text-base text-gray-700 font-medium">WB EDTA</p>
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
                          <h3 className="font-bold text-gray-900 mb-2 sm:mb-3 text-base sm:text-lg">What is CBC?</h3>
                          <p className="text-gray-800 leading-relaxed text-sm sm:text-base font-medium">
                            A Complete Blood Count (CBC) is a comprehensive blood test that evaluates your overall
                            health and detects various disorders, including anemia, infection, and leukemia.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-gray-800">
                      <p className="leading-relaxed text-sm sm:text-base font-medium">
                        The CBC measures three fundamental categories of blood cells: red blood cells, white blood
                        cells, and platelets. It identifies any changes in your blood cell counts, whether positive or
                        negative, providing crucial insights into your health status.
                      </p>
                      <p className="leading-relaxed text-sm sm:text-base font-medium">
                        Normal values vary based on age and gender. By monitoring these levels, your doctor can assess
                        your general health and detect potential illnesses early, enabling timely intervention and
                        treatment.
                      </p>
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
                          29 Parameters
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
                      {[
                        "Haemoglobin (Hb)",
                        "RBC Count",
                        "PCV / Hematocrit",
                        "MCV",
                        "MCH",
                        "MCHC",
                        "Total WBC Count / TLC",
                        "Absolute Neutrophil Count (ANC)",
                        "Absolute Eosinophil Count (AEC)",
                        "Absolute Lymphocyte Count",
                        "Absolute Monocyte Count",
                        "Absolute Basophil Count",
                        "Platelet Count",
                        "Meta Myelocytes",
                        "Myelocytes",
                        "Blasts/ Atypical Cells",
                        "Atypical Lymphocytes",
                        "Neutrophils",
                        "Lymphocytes",
                        "Monocytes",
                        "Basophils",
                        "Eosinophils",
                        "RDW (Red Cell Distribution Width)",
                        "MPV (Mean Platelet Volume)",
                        "Band Forms",
                        "Pro Myelocytes",
                        "Pro Lymphocytes",
                        "Plasma Cells",
                        "Nucleated RBC Count",
                      ].map((param, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg border">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-gray-800 font-medium break-words">{param}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* FAQ */}
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
                    <div className="space-y-1">
                      {[
                        "When should I get the test results for CBC?",
                        "What does the CBC test do?",
                        "Will there be anything I need to do to get ready for the test?",
                        "What advantages does this test have?",
                      ].map((question, index) => (
                        <div key={index}>
                          <Button
                            variant="ghost"
                            className="w-full h-auto py-3 sm:py-4 px-3 sm:px-4 text-left hover:bg-gray-50 rounded-lg group"
                          >
                            <div className="flex items-start w-full gap-3">
                              <span className="text-gray-800 font-semibold text-sm sm:text-base text-left leading-relaxed flex-1 min-w-0 break-words whitespace-normal">
                                {question}
                              </span>
                              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1 group-hover:text-gray-600 transition-colors" />
                            </div>
                          </Button>
                          {index < 3 && <Separator className="my-1" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
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
                  Limited Time Offer
                </Badge>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Complete Blood Count (CBC)</h3>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg sm:text-xl text-gray-600 line-through font-medium">₹500</span>
                    <Badge
                      variant="destructive"
                      className="bg-red-50 text-red-800 border-red-200 font-semibold text-xs sm:text-sm"
                    >
                      30% OFF
                    </Badge>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">₹350</div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Inclusive of all taxes</p>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-bold rounded-lg text-sm sm:text-base">
                  Book Now
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
                  {[
                    { name: "Adenosine Deaminase (ADA)", price: "₹675" },
                    { name: "Thyroid Profile Total", price: "₹550" },
                    { name: "Complete Blood Count (CBC)", price: "₹350" },
                    { name: "Platelet Count", price: "₹50" },
                  ].map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1 pr-2 sm:pr-4 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-gray-900 leading-tight break-words">
                          {test.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <p className="text-sm sm:text-base font-bold text-blue-600">{test.price}</p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3 font-semibold whitespace-nowrap"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}