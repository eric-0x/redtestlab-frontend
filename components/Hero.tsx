"use client"

import { useState, useRef, useEffect } from "react"
import { Search, FileText, Package, Mic, ChevronRight } from "lucide-react"
import Link from "next/link" // Changed from react-router-dom
import { useRouter } from "next/navigation" // Changed from react-router-dom
import Head from "next/head" // Changed from react-helmet-async

// Fix for the Speech Recognition interfaces
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
  // Add this missing interface
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onstart: (event: Event) => void
    onresult: (event: SpeechRecognitionEvent) => void
    onend: (event: Event) => void
    onerror: (event: SpeechRecognitionErrorEvent) => void
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
  // Redefine with consistent modifiers
  interface SpeechRecognitionResultList {
    readonly length: number
    item(index: number): SpeechRecognitionResult
    [index: number]: SpeechRecognitionResult
  }
  interface SpeechRecognitionResult {
    readonly length: number
    item(index: number): SpeechRecognitionAlternative
    [index: number]: SpeechRecognitionAlternative
    readonly isFinal: boolean
  }
  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionError
  }
  type SpeechRecognitionError =
    | "aborted"
    | "audio-capture"
    | "bad-grammar"
    | "language-not-supported"
    | "network"
    | "no-speech"
    | "not-allowed"
    | "service-not-allowed"
    | "timeout"
}

// Interface for the meta tags API response
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

const HealthTestSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingText, setRecordingText] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)
  const [metaTags, setMetaTags] = useState<MetaTagsResponse | null>(null)
  const [isLoadingMeta, setIsLoadingMeta] = useState(true)
  const router = useRouter() // Changed from useNavigate()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const transcriptRef = useRef("") // Add a ref to store the latest transcript

  // Fetch meta tags from API
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        setIsLoadingMeta(true)
        const response = await fetch("https://redtestlab.com/api/metatags/1")
        if (!response.ok) {
          throw new Error("Failed to fetch meta tags")
        }
        const data: MetaTagsResponse = await response.json()
        setMetaTags(data)
      } catch (error) {
        console.error("Error fetching meta tags:", error)
        // Set default meta tags in case of error
        setMetaTags({
          id: 1,
          filename: "Hero",
          title: "RedTest Lab - Health Test Search",
          description: "Find and book blood tests and health checkups online with RedTest Lab",
          keywords: "blood test, health checkup, medical tests, lab tests",
          charset: "utf-8",
          author: "RedTest Lab",
          canonicallink: typeof window !== "undefined" ? window.location.href : "", // Added check for window
          favicon: "/favicon.ico",
          opengraph: "RedTest Lab Health Tests",
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

  // Speech Recognition setup
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognitionAPI()
      if (recognitionRef.current) {
        // Add this null check
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.onstart = () => {
          setIsRecording(true)
          setShowAnimation(true)
          setRecordingText("Listening...")
          transcriptRef.current = "" // Reset transcript ref when starting new recording
        }
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("")
          setRecordingText(transcript)
          transcriptRef.current = transcript // Store the transcript in the ref
        }
        recognitionRef.current.onend = () => {
          setIsRecording(false)
          // Small delay to show the final transcript before redirecting
          setTimeout(() => {
            if (transcriptRef.current && transcriptRef.current !== "Listening...") {
              setSearchQuery(transcriptRef.current)
              handleVoiceSearch(transcriptRef.current)
            }
            setShowAnimation(false)
          }, 1000)
        }
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error", event.error)
          setIsRecording(false)
          setShowAnimation(false)
        }
      }
    }
    return () => {
      if (recognitionRef.current) {
        // This check is already there
        recognitionRef.current.abort()
      }
    }
  }, [])

  const handleVoiceSearch = (text: string) => {
    // Navigate to search results with the voice input
    router.push(`/search-results?query=${encodeURIComponent(text)}`) // Changed from navigate()
  }

  const startVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    } else {
      alert("Speech recognition is not supported in your browser.")
    }
  }

  return (
    <>
      {/* Next.js Head for dynamic meta tags */}
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
              <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ""} />{" "}
              {/* Added check for window */}
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
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-800 px-4 sm:px-8 py-4 sm:py-8 rounded-lg shadow-xl relative overflow-hidden overflow-x-hidden">
        {/* Background decoration circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-700 opacity-30"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-600 opacity-20"></div>
        {/* Voice recording animation overlay */}
        {showAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-md w-full">
              <div
                className={`w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 ${
                  isRecording ? "animate-pulse" : ""
                }`}
              >
                <Mic className={`text-red-500 ${isRecording ? "animate-bounce" : ""}`} size={40} />
              </div>
              <p className="text-lg font-medium text-gray-800 mb-2">{recordingText}</p>
              <p className="text-sm text-gray-500 text-center">
                {isRecording ? "Speak now..." : "Processing your request..."}
              </p>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto w-full px-0 sm:px-4 relative z-10">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">Looking for a blood test?</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm flex items-center">
                <span className="mr-1 sm:mr-2">🏆</span>
                <span>Trusted by 10M+ customers</span>
              </div>
              <div className="bg-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm flex items-center">
                <span className="mr-1 sm:mr-2">⭐</span>
                <span>4.9/5 rating</span>
              </div>
            </div>
          </div>
          {/* Search Bar with animation */}
          <div className="relative mb-6 sm:mb-8 w-full px-0 sm:px-2">
            <div
              className={`bg-white rounded-full shadow-lg overflow-hidden flex items-center transition-all duration-300 ${
                isSearchFocused ? "ring-4 ring-blue-400" : ""
              }`}
            >
              <Search
                className={`ml-3 sm:ml-4 transition-colors duration-300 ${
                  isSearchFocused ? "text-blue-500" : "text-gray-500"
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search Tests"
                className="w-full py-3 sm:py-4 px-2 sm:px-4 text-gray-700 focus:outline-none text-base sm:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button
                className="bg-gray-100 p-2 sm:p-3 rounded-full mr-2 hover:bg-red-50 transition-colors duration-200"
                onClick={startVoiceRecording}
              >
                <Mic className="text-red-500" size={18} />
              </button>
            </div>
          </div>
          {/* Option Cards with hover effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
            <Link href="/upload-prescription">
              {/* Changed to Next.js Link */}
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                      <FileText className="text-blue-700" size={20} />
                    </div>
                    <h2 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold text-gray-800">Upload Prescription</h2>
                  </div>
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight className="text-blue-700" size={16} />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex justify-between items-center">
                  <p className="text-gray-500 text-xs sm:text-sm pr-2">
                    Easily upload your doctor's prescription to get the right tests recommended by experts at RedTest
                    Lab. Quick, secure, and hassle-free.
                  </p>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex-shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <span className="text-blue-700 text-xl sm:text-2xl">Rx</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group w-full"
              onClick={() => router.push("/all")}
            >
              {/* Changed to router.push() */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                    <Package className="text-blue-700" size={20} />
                  </div>
                  <h2 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold text-gray-800">Select Health Package</h2>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="text-blue-700" size={16} />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex justify-between items-center">
                <p className="text-gray-500 text-xs sm:text-sm pr-2">
                  Choose from a wide range of affordable health checkups tailored to your needs. Book tests online with
                  RedTest Lab and get reports fast.
                </p>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex-shrink-0 flex items-center justify-center">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                      <span className="text-green-700 text-xl sm:text-2xl">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Health Package Promotion with visual enhancements */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-xl p-4 sm:p-6 shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 rounded-full opacity-20 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full opacity-20 -ml-10 -mb-10"></div>
            <div className="flex flex-col md:flex-row items-center relative z-10">
              {/* Logo with animation */}
              <div className="mb-4 md:mb-0 md:mr-8 transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="text-3xl sm:text-4xl font-bold text-red-500">HEALTH</div>
                  <div className="text-lg sm:text-xl font-semibold text-white">PREMIERE LEAGUE</div>
                  <div className="absolute -top-6 -right-6 animate-pulse">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 flex justify-center">
                      <div className="w-1 h-8 sm:h-10 bg-yellow-400 transform rotate-45"></div>
                      <div className="w-1 h-8 sm:h-10 bg-yellow-400 transform -rotate-45 ml-1"></div>
                      <div className="w-1 h-8 sm:h-10 bg-yellow-400 transform -rotate-45 -ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                  Champion Your Health with Power Plays of Prevention
                </h3>
                <p className="text-blue-200 text-xs sm:text-sm">Advanced screenings designed by top medical experts</p>
              </div>
              {/* Divider */}
              <div className="hidden md:block h-20 w-px bg-blue-600 mx-6"></div>
              {/* Promotion */}
              <div className="w-full md:w-auto">
                <div className="mb-2 transform hover:scale-105 transition-transform duration-300 flex justify-center md:justify-start">
                  <div className="relative">
                    <span className="inline-block bg-red-600 text-white px-2 sm:px-3 py-1 rounded-l-md text-xs sm:text-sm">
                      Use Code:
                    </span>
                    <span className="inline-block bg-white text-red-600 px-2 sm:px-3 py-1 font-bold text-xs sm:text-sm">
                      HPL20
                    </span>
                    <span className="inline-block bg-white text-black px-2 sm:px-3 py-1 rounded-r-md text-xs sm:text-sm">
                      | Get 20% OFF
                    </span>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-black px-1.5 py-0.5 rounded-full animate-bounce text-[10px] sm:text-xs">
                      Limited Time!
                    </div>
                  </div>
                </div>
                <div className="bg-blue-900 p-3 sm:p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-800 rounded-full opacity-50 -mr-10 -mt-10"></div>
                  <div className="mb-2 text-green-400 font-semibold relative z-10 text-xs sm:text-sm">
                    1+1 Free HsCRP with Fit India Full Body Checkup with Vitamin Screening
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="bg-blue-800 p-1.5 sm:p-2 rounded text-center transform hover:scale-110 transition-transform duration-300">
                      <div className="text-green-400 font-bold text-xs sm:text-base">
                        78<span className="text-[8px] sm:text-xs">% OFF</span>
                      </div>
                    </div>
                    <div className="font-bold text-white">
                      <span className="text-xs sm:text-sm line-through text-gray-400">₹13632</span>
                      <br />
                      <span className="text-sm sm:text-base">₹2999</span>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded flex items-center transform hover:scale-110 transition-transform duration-300">
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-[10px] sm:text-xs">+</span>
                      </div>
                      <span className="ml-1 sm:ml-2 font-bold text-gray-800 text-xs sm:text-sm">96 Tests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HealthTestSearch
