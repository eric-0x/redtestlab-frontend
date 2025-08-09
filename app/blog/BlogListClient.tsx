"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, User, ArrowRight, Search, Clock } from "lucide-react"
import { navigateToBlog, calculateReadingTime, truncateText, stripHtml } from "./utils"

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

export interface BlogFormData {
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
}

export default function BlogListClient() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.keywords.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBlogs(filtered)
  }, [blogs, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://redtestlab.com/api/blog")
      if (!response.ok) {
        throw new Error("Failed to fetch blogs")
      }
      const data = await response.json()
      setBlogs(data)
      setFilteredBlogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
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

  const handleBlogClick = async (blog: Blog) => {
    await navigateToBlog(router, blog)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={fetchBlogs}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Health <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest health insights, medical breakthroughs, and wellness tips from our experts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-300"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm ? "No blogs found matching your search." : "No blogs available at the moment."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleBlogClick(blog)}
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.img || "/api/placeholder/400/200"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {getReadingTime(blog.content)}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description || truncateText(stripHtml(blog.content), 150)}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blog.author}
                    </div>
                    {blog.createdAt && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.createdAt)}
                      </div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More or Pagination could go here */}
        {filteredBlogs.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Showing {filteredBlogs.length} of {blogs.length} blog{blogs.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
