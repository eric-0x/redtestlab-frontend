"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, User, ArrowLeft, Clock, Share2, BookOpen, Tag } from "lucide-react"
import { isNumericId, generateSlug, calculateReadingTime } from "./utils"

export interface Blog {
  id?: number
  title: string
  content: string
  img: string
  slug: string
  filename: string
  metaTitle: string
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
  createdAt?: string
  updatedAt?: string
}

interface BlogClientProps {
  blogSlugOrId: string
}

export default function BlogClient({ blogSlugOrId }: BlogClientProps) {
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleBlogNavigation(blogSlugOrId)
  }, [blogSlugOrId])

  const handleBlogNavigation = async (slugOrId: string) => {
    setLoading(true)
    setError(null)

    try {
      // Since server-side redirects handle ID→slug conversion,
      // by the time we're here, it should always be a slug
      // But keep ID fallback for direct client-side navigation
      if (isNumericId(slugOrId)) {
        // This should rarely happen due to server redirect, but handle it
        const blogData = await fetchBlogById(slugOrId)
        if (blogData) {
          setBlog(blogData)
        } else {
          setError("Blog not found")
        }
      } else {
        // It's a slug, find the blog
        const blogData = await findBlogBySlug(slugOrId)
        if (blogData) {
          setBlog(blogData)
        } else {
          setError("Blog not found")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch blog by ID using existing API
  const fetchBlogById = async (id: string): Promise<Blog | null> => {
    try {
      const response = await fetch(`https://redtestlab.com/api/blog/${id}`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      return null
    }
  }

  // Find blog by slug - fetch all blogs and match by title
  const findBlogBySlug = async (slug: string): Promise<Blog | null> => {
    try {
      // Convert slug back to potential title for matching
      const titleFromSlug = slug.replace(/-/g, ' ')
      
      // Fetch all blogs (you might want to implement pagination if you have many blogs)
      const response = await fetch('https://redtestlab.com/api/blog')
      if (!response.ok) return null
      
      const blogs: Blog[] = await response.json()
      
      // Find blog by matching slug or title
      const foundBlog = blogs.find(blog => {
        // First try exact slug match if blog has slug property
        if (blog.slug && blog.slug === slug) return true
        
        // Then try generated slug match
        const generatedSlug = generateSlug(blog.title)
        return generatedSlug === slug
      })
      
      return foundBlog || null
    } catch (error) {
      return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadingTime = (content: string) => {
    return calculateReadingTime(content)
  }

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else if (typeof window !== "undefined") {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleSocialShare = (platform: string) => {
    if (typeof window === "undefined" || !blog) return

    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(blog.title)

    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title} ${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/blog")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Blog
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="bg-white border-b sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/blog")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Blog</span>
            </button>
            {/* <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button> */}
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        <div className="aspect-[16/9] mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={blog.img || "/placeholder.svg?height=600&width=1200"}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=600&width=1200"
            }}
          />
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.keywords
              .split(",")
              .slice(0, 4)
              .map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {keyword.trim()}
                </span>
              ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">{blog.title}</h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-medium text-gray-900">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{blog.createdAt && formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{getReadingTime(blog.content)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>Article</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xl text-gray-600 leading-relaxed p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
            {blog.description}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-blue max-w-none">
          <div
            className="text-gray-800 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{
              lineHeight: "1.8",
              fontSize: "1.125rem",
            }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share this article</h3>
                <p className="text-gray-600">Help others discover this content</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSocialShare("twitter")}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={() => handleSocialShare("linkedin")}
                  className="px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 transition-colors"
                >
                  LinkedIn
                </button>
                <button
                  onClick={() => handleSocialShare("whatsapp")}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Last updated: {blog.updatedAt && formatDate(blog.updatedAt)}</p>
          </div>
        </footer>
      </article>
    </div>
  )
}
