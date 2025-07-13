"use client";

import type React from "react"
import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import {
  Book,
  Database,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Upload,
  ImageIcon,
  Bold,
  Italic,
  List,
  LinkIcon,
  ListOrdered,
} from "lucide-react"
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


const BlogAdminPanel: React.FC = () => {
  // State management
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: "success" | "error"
  }>({
    show: false,
    message: "",
    type: "success",
  })
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [faviconUploading, setFaviconUploading] = useState(false)

  // Initialize form data with default values
  const emptyFormData: BlogFormData = {
    title: "",
    content: "",
    img: "",
    slug: "",
    filename: "",
    metaTitle: "",
    description: "",
    keywords: "",
    charset: "UTF-8",
    author: "",
    canonicallink: "",
    favicon: "",
    opengraph: "",
    twitter: "",
    schema: "",
    viewport: "width=device-width, initial-scale=1.0",
  }

  const [formData, setFormData] = useState<BlogFormData>(emptyFormData)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BlogFormData, string>>>({})
  const [mounted, setMounted] = useState(false);

// Set mounted to true after component mounts
useEffect(() => {
  setMounted(true);
}, []);


  // TipTap Editor
  const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "max-w-full h-auto rounded-lg mx-auto my-4",
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-blue-600 hover:text-blue-800 underline",
      },
    }),
  ],
  content: formData.content,
  onUpdate: ({ editor }) => {
    setFormData((prev) => ({
      ...prev,
      content: editor.getHTML(),
    }));
  },
  editorProps: {
    attributes: {
      class: "prose prose-sm focus:outline-none max-w-none",
    },
  },
  // Add this to prevent SSR issues
  immediatelyRender: false,
});
  // Update editor content when form data changes
  useEffect(() => {
  if (editor && mounted && editor.getHTML() !== formData.content) {
    editor.commands.setContent(formData.content);
  }
}, [formData.content, editor, mounted]);

  // Fetch blogs
  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://redtestlab.com/api/blog")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      showNotification("Failed to load blogs", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Get admin token from local storage
  const getAdminToken = (): string | null => {
    return localStorage.getItem("adminToken")
  }

  // Initial data fetch
  useEffect(() => {
    fetchBlogs()
  }, [])

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (formErrors[name as keyof BlogFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim()
  }

  // Auto-fill slug and filename when title changes
  useEffect(() => {
    if (formData.title && !editingBlog) {
      const slug = generateSlug(formData.title)
      setFormData((prev) => ({
        ...prev,
        slug,
        filename: `${slug}.html`,
        metaTitle: formData.title,
      }))
    }
  }, [formData.title, editingBlog])

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BlogFormData, string>> = {}
    let isValid = true

    if (!formData.title.trim()) {
      errors.title = "Title is required"
      isValid = false
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required"
      isValid = false
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required"
      isValid = false
    }

    if (!formData.filename.trim()) {
      errors.filename = "Filename is required"
      isValid = false
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Handle image upload (for blog cover image and favicon)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "img" | "favicon") => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "E-Rickshaw") // Update this with your Cloudinary upload preset

    type === "img" ? setImageUploading(true) : setFaviconUploading(true)

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dm8jxispy/image/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()

      setFormData((prev) => ({
        ...prev,
        [type]: data.secure_url,
      }))

      showNotification(`${type === "img" ? "Image" : "Favicon"} uploaded successfully`, "success")
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      showNotification(`Failed to upload ${type === "img" ? "image" : "favicon"}`, "error")
    } finally {
      type === "img" ? setImageUploading(false) : setFaviconUploading(false)
    }
  }

  // TipTap Editor Functions
  const addImage = () => {
    const url = window.prompt("Enter image URL (Cloudinary recommended):")
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const token = getAdminToken()
    if (!token) {
      showNotification("Admin token not found. Please log in.", "error")
      return
    }

    setIsLoading(true)
    try {
      const url = editingBlog
        ? `https://redtestlab.com/api/blog/${editingBlog.id}`
        : "https://redtestlab.com/api/blog"

      const response = await fetch(url, {
        method: editingBlog ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      fetchBlogs()
      setShowAddDialog(false)
      setFormData(emptyFormData)
      setEditingBlog(null)
      if (editor) {
        editor.commands.setContent("")
      }
      showNotification(
        editingBlog
          ? `Blog post "${formData.title}" updated successfully`
          : `Blog post "${formData.title}" added successfully`,
        "success",
      )
    } catch (error) {
      console.error("Error saving blog post:", error)
      showNotification(
        `Failed to ${editingBlog ? "update" : "add"} blog post: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Edit blog
  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      img: blog.img,
      slug: blog.slug,
      filename: blog.filename,
      metaTitle: blog.metaTitle,
      description: blog.description,
      keywords: blog.keywords,
      charset: blog.charset,
      author: blog.author,
      canonicallink: blog.canonicallink,
      favicon: blog.favicon,
      opengraph: blog.opengraph,
      twitter: blog.twitter,
      schema: blog.schema,
      viewport: blog.viewport,
    })
    setShowAddDialog(true)
  }

  // Delete blog
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      const token = getAdminToken()
      if (!token) {
        showNotification("Admin token not found. Please log in.", "error")
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`https://redtestlab.com/api/blog/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to delete: ${response.status}`)
        }

        fetchBlogs()
        showNotification("Blog post deleted successfully", "success")
      } catch (error) {
        console.error("Error deleting blog post:", error)
        showNotification("Failed to delete blog post", "error")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Show notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  // Handle add new
  const handleAddNew = () => {
    setEditingBlog(null)
    setFormData(emptyFormData)
    setFormErrors({})
    if (editor) {
      editor.commands.setContent("")
    }
    setShowAddDialog(true)
  }

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter((blog) => {
    const searchFields = [blog.title, blog.content, blog.description, blog.keywords, blog.author]

    return searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // Toggle expanded view
  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Truncate text for display
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-[1400px]">
        {/* Header Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
              <p className="mt-1 text-gray-500">Create, edit and manage your blog posts</p>
            </div>
          </div>

          {/* Action Buttons and Search */}
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            <div className="w-full sm:w-[50%]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
            <button
              onClick={handleAddNew}
              className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Blog Post
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div
            className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md transition-all duration-500 ease-in-out transform ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {isLoading && !filteredBlogs.length ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p>Loading blog posts...</p>
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Database className="h-8 w-8 text-gray-400" />
                <p>No blog posts found</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{blog.title}</h3>
                      <p className="text-gray-500">{truncateText(blog.description, 150)}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                          {blog.slug}
                        </span>
                        {blog.keywords
                          .split(",")
                          .slice(0, 3)
                          .map((keyword, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                            >
                              {keyword.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                    {blog.img && (
                      <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden">
                        <img
                          src={blog.img || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => blog.id && handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => blog.id && toggleExpanded(blog.id)}
                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform ${expandedId === blog.id ? "rotate-180" : ""}`}
                    />
                    {expandedId === blog.id ? "Show Less" : "View Details"}
                  </button>

                  {expandedId === blog.id && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Content Preview</h4>
                          <div
                            className="text-gray-600 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: truncateText(blog.content, 300) }}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Meta Information</h4>
                          <div className="space-y-2 mt-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Meta Title:</span>
                              <p className="text-gray-700">{blog.metaTitle}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Author:</span>
                              <p className="text-gray-700">{blog.author || "None"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Keywords:</span>
                              <p className="text-gray-700">{blog.keywords || "None"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">File Information</h4>
                          <div className="space-y-1 mt-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Filename:</span>
                              <p className="text-gray-700">{blog.filename}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Slug:</span>
                              <p className="text-gray-700">{blog.slug}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Technical Settings</h4>
                          <div className="space-y-1 mt-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Charset:</span>
                              <p className="text-gray-700">{blog.charset}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Viewport:</span>
                              <p className="text-gray-700">{blog.viewport}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Links</h4>
                          <div className="space-y-1 mt-2">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Canonical:</span>
                              <p className="text-gray-700">{blog.canonicallink || "None"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Favicon:</span>
                              <p className="text-gray-700">{blog.favicon || "None"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Open Graph</h4>
                          <p className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 break-all">
                            {blog.opengraph || "None"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Twitter Card</h4>
                          <p className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 break-all">
                            {blog.twitter || "None"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Schema</h4>
                          <p className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600 break-all">
                            {blog.schema || "None"}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Created: {new Date(blog.createdAt || "").toLocaleString()}</p>
                        <p>Last Updated: {new Date(blog.updatedAt || "").toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <Book className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingBlog ? "Edit Blog Post" : "Add Blog Post"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddDialog(false)
                    setEditingBlog(null)
                    setFormErrors({})
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Blog Post Title"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${formErrors.title ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                        />
                        {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div className="flex">
                          <input
                            type="text"
                            name="img"
                            value={formData.img}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <label className="flex items-center justify-center bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => handleImageUpload(e, "img")}
                              disabled={imageUploading}
                            />
                            {imageUploading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                            ) : (
                              <Upload className="h-5 w-5 text-gray-600" />
                            )}
                          </label>
                        </div>
                        {formData.img && (
                          <div className="mt-2 relative w-24 h-24 rounded-md overflow-hidden">
                            <img
                              src={formData.img || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>

                      {/* TipTap Editor Toolbar */}
                      {editor && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleBold().run()}
                              className={`px-3 py-1 rounded ${
                                editor.isActive("bold") ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              } border hover:bg-blue-50`}
                            >
                              <Bold className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleItalic().run()}
                              className={`px-3 py-1 rounded ${
                                editor.isActive("italic") ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              } border hover:bg-blue-50`}
                            >
                              <Italic className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleBulletList().run()}
                              className={`px-3 py-1 rounded ${
                                editor.isActive("bulletList") ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              } border hover:bg-blue-50`}
                            >
                              <List className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => editor.chain().focus().toggleOrderedList().run()}
                              className={`px-3 py-1 rounded ${
                                editor.isActive("orderedList") ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              } border hover:bg-blue-50`}
                            >
                              <ListOrdered className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={addImage}
                              className="px-3 py-1 rounded bg-white text-gray-700 border hover:bg-blue-50"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={addLink}
                              className={`px-3 py-1 rounded ${
                                editor.isActive("link") ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                              } border hover:bg-blue-50`}
                            >
                              <LinkIcon className="h-4 w-4" />
                            </button>
                            {editor.isActive("link") && (
                              <button
                                type="button"
                                onClick={removeLink}
                                className="px-3 py-1 rounded bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                              >
                                Remove Link
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                     {mounted && editor && (
  <EditorContent
    editor={editor}
    className={`min-h-[300px] p-4 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 prose prose-sm max-w-none
    ${formErrors.content ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
  />
)}
            {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
          </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">SEO Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          placeholder="blog-post-slug"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${formErrors.slug ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                        />
                        {formErrors.slug && <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filename*</label>
                        <input
                          type="text"
                          name="filename"
                          value={formData.filename}
                          onChange={handleInputChange}
                          placeholder="blog-post.html"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${formErrors.filename ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                        />
                        {formErrors.filename && <p className="mt-1 text-sm text-red-600">{formErrors.filename}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                        <input
                          type="text"
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleInputChange}
                          placeholder="SEO Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="SEO description..."
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          ${formErrors.description ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
                        />
                        {formErrors.description && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                        <input
                          type="text"
                          name="keywords"
                          value={formData.keywords}
                          onChange={handleInputChange}
                          placeholder="keyword1, keyword2, keyword3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          placeholder="Author Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Advanced Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Canonical Link</label>
                        <input
                          type="text"
                          name="canonicallink"
                          value={formData.canonicallink}
                          onChange={handleInputChange}
                          placeholder="https://example.com/blog/post"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
                        <div className="flex">
                          <input
                            type="text"
                            name="favicon"
                            value={formData.favicon}
                            onChange={handleInputChange}
                            placeholder="https://example.com/favicon.ico"
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <label className="flex items-center justify-center bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => handleImageUpload(e, "favicon")}
                              disabled={faviconUploading}
                            />
                            {faviconUploading ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-600" />
                            )}
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Charset</label>
                        <input
                          type="text"
                          name="charset"
                          value={formData.charset}
                          onChange={handleInputChange}
                          placeholder="UTF-8"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Viewport</label>
                        <input
                          type="text"
                          name="viewport"
                          value={formData.viewport}
                          onChange={handleInputChange}
                          placeholder="width=device-width, initial-scale=1.0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Social Media & Structured Data</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Open Graph URL</label>
                        <input
                          type="text"
                          name="opengraph"
                          value={formData.opengraph}
                          onChange={handleInputChange}
                          placeholder="https://example.com/og-image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card URL</label>
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          placeholder="https://example.com/twitter-image.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">JSON-LD Schema</label>
                      <textarea
                        name="schema"
                        value={formData.schema}
                        onChange={handleInputChange}
                        placeholder='{ "@context": "https://schema.org", "@type": "BlogPosting", "headline": "Blog Title" }'
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-200 p-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDialog(false)
                    setEditingBlog(null)
                    setFormErrors({})
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{editingBlog ? "Update Blog Post" : "Publish Blog Post"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogAdminPanel
