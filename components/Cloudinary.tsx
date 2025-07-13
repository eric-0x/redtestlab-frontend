"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface CloudinaryUploadProps {
  onUpload: (urls: string[]) => void
  multiple?: boolean
  currentImages?: string[]
  maxFiles?: number
  className?: string
}

export function CloudinaryUpload({
  onUpload,
  multiple = false,
  currentImages = [],
  maxFiles = 5,
  className = "",
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadToCloudinary = async (files: FileList) => {
    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "E-Rickshaw") // Replace with your Cloudinary upload preset

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dm8jxispy/image/upload`, // Replace with your cloud name
          {
            method: "POST",
            body: formData,
          },
        )

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.secure_url)
        } else {
          throw new Error("Upload failed")
        }
      }

      if (multiple) {
        onUpload([...currentImages, ...uploadedUrls])
      } else {
        onUpload(uploadedUrls)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files
      const remainingSlots = multiple ? maxFiles - currentImages.length : 1

      if (files.length > remainingSlots) {
        alert(`You can only upload ${remainingSlots} more image(s)`)
        return
      }

      uploadToCloudinary(files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = e.target.files
      const remainingSlots = multiple ? maxFiles - currentImages.length : 1

      if (files.length > remainingSlots) {
        alert(`You can only upload ${remainingSlots} more image(s)`)
        return
      }

      uploadToCloudinary(files)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = currentImages.filter((_, index) => index !== indexToRemove)
    onUpload(newImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || (multiple && currentImages.length >= maxFiles)}
        />

        <div className="text-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">{multiple ? "Upload images" : "Upload image"}</p>
              <p className="text-xs text-gray-500">Drag and drop or click to select</p>
              {multiple && (
                <p className="text-xs text-gray-400 mt-1">
                  {currentImages.length}/{maxFiles} images uploaded
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Previews */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {multiple ? "Uploaded Images" : "Uploaded Image"}
          </label>
          <div className={`grid gap-4 ${multiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
            {currentImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`${multiple ? "Hospital" : "Doctor"} image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URL Input Fallback */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Or paste {multiple ? "image URLs (one per line)" : "image URL"}
        </label>
        {multiple ? (
          <textarea
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            rows={3}
            onChange={(e) => {
              const urls = e.target.value
                .split("\n")
                .map((url) => url.trim())
                .filter((url) => url && url.startsWith("http"))
              if (urls.length > 0) {
                onUpload(urls)
              }
            }}
          />
        ) : (
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            onChange={(e) => {
              if (e.target.value && e.target.value.startsWith("http")) {
                onUpload([e.target.value])
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
