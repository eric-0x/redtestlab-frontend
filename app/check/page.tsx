"use client"

import { ChevronDown, Share2, Phone, Download, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function CBCTestPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    testDetails: true,
    faq: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Test Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Complete Blood Count (CBC)</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">6263+ Booked in Last 3 Days</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Share2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Gender for</div>
                    <div className="text-sm text-gray-600">Male, Female</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">No special</div>
                    <div className="text-sm text-gray-600">preparation required</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Sample Type</div>
                    <div className="text-sm text-gray-600">WB EDTA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Overview */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <button
                  onClick={() => toggleSection("overview")}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Test Overview</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.overview ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedSections.overview && (
                  <div className="text-sm text-gray-700 space-y-4">
                    <p>
                      A Complete Blood Count (CBC) is a frequently performed test that checks for diseases impacting
                      your health. The CBC measures three fundamental categories of blood cells: red blood cells, white
                      blood cells, and platelets. It identifies any changes in your blood cell counts, whether positive
                      or negative.
                    </p>
                    <p>
                      Normal values vary based on age and gender. By monitoring these levels, your doctor can assess
                      your general health and detect potential illnesses. Regular CBC tests help in early detection and
                      management of health conditions.
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                      Read More
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "bg-yellow-500", title: "NABL approved", subtitle: "Labs" },
                { icon: "bg-orange-500", title: "Most Trusted by", subtitle: "Doctors" },
                { icon: "bg-green-500", title: "Accuracy &", subtitle: "timely reporting" },
                { icon: "bg-blue-500", title: "Widest Range", subtitle: "of Tests" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className={`w-5 h-5 ${item.icon} rounded-full`}></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Details */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <button
                  onClick={() => toggleSection("testDetails")}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900">Test Details</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">29 Parameters</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.testDetails ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {expandedSections.testDetails && (
                  <div className="flex flex-wrap gap-2">
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
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full border"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <button onClick={() => toggleSection("faq")} className="flex items-center justify-between w-full mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Frequently asked questions</h2>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.faq ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedSections.faq && (
                  <div className="space-y-1">
                    {[
                      "When should I get the test results for CBC?",
                      "What does the CBC test do?",
                      "Will there be anything I need to do to get ready for the test?",
                      "What advantages does this test have?",
                    ].map((question, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-gray-50 px-2 rounded"
                      >
                        <span className="text-sm text-gray-700">{question}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Complete Blood Count (CBC)</h3>
                <div className="text-sm text-gray-600 mb-3">Exclusive Offer</div>
                <div className="text-3xl font-bold text-red-600">₹ 350</div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  View Cart
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors">
                  Book Now
                </button>
              </div>

              <button className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Download sample Report
              </button>
            </div>

            {/* Call Support */}
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="text-sm font-medium text-gray-900 mb-2">Can't Decide the test?</div>
              <div className="text-xs text-gray-600 mb-4">
                Schedule a blood test or health checkup and have the convenience of being tested in the comfort of your
                own home.
              </div>
              <button className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                <Phone className="w-4 h-4" />
                Call Now
              </button>
            </div>

            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-teal-400 text-white rounded-lg overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="text-lg font-bold mb-1">Upto</div>
                <div className="text-3xl font-bold mb-1">77%Off</div>
                <div className="text-sm">on Health/Med</div>
                <div className="text-sm">Packages</div>
              </div>
              <div className="absolute right-4 top-4 w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-white/30 rounded-full"></div>
              </div>
            </div>

            {/* Call Back */}
            <div className="bg-blue-900 text-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Want us to Call Back?</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>

            {/* Most Frequently Booked */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-center text-gray-900">Most Frequently Booked Test</h3>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { name: "Adenosine Deaminase (ADA)", price: "₹675", originalPrice: "₹675" },
                  { name: "Thyroid Profile Total", price: "₹550", originalPrice: "₹550" },
                  { name: "Complete Blood Count (CBC)", price: "₹350", originalPrice: "₹350" },
                  { name: "Platelet Count", price: "₹50", originalPrice: "₹50" },
                ].map((test, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 font-medium">{test.name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-400 line-through">{test.originalPrice}</div>
                        <div className="text-sm font-bold text-blue-600">{test.price}</div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded font-medium transition-colors">
                        Book now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  )
}
