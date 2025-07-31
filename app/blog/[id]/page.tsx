"use client"

import { Metadata } from "next"
import { redirect } from "next/navigation"
import BlogClient from "../BlogClient"
import { generateCanonicalUrl, isNumericId, generateSlug } from "../utils"

// Fetch blog by ID to get title for slug generation
async function fetchBlogById(id: string) {
  try {
    const response = await fetch(`https://redtestlab.com/api/blog/${id}`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    return null
  }
}

// Server component that handles ID→slug redirect before rendering
export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // If someone accessed via numeric ID, redirect to slug URL immediately
  if (isNumericId(id)) {
    const blog = await fetchBlogById(id)
    if (blog) {
      const slug = blog.slug || generateSlug(blog.title)
      redirect(`/blog/${slug}`)
    }
    // If blog not found, let the client component handle the error
  }
  
  // If we reach here, it's a slug - pass to client component
  return <BlogClient blogSlugOrId={id} />
}

// Enhanced metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    let blog = null
    
    // If it's a numeric ID, fetch the blog data
    if (isNumericId(id)) {
      blog = await fetchBlogById(id)
    } else {
      // It's a slug, we'd need to fetch all blogs to find it
      // For performance, we'll use basic metadata for slugs
      // The client-side will update the metadata once loaded
    }
    
    if (blog) {
      const canonicalUrl = generateCanonicalUrl(blog)
      
      return {
        title: blog.metaTitle || blog.title,
        description: blog.description,
        keywords: blog.keywords,
        authors: [{ name: blog.author }],
        openGraph: {
          title: blog.metaTitle || blog.title,
          description: blog.description,
          images: [blog.opengraph],
          url: canonicalUrl,
          type: "article",
        },
        twitter: {
          card: "summary_large_image",
          title: blog.metaTitle || blog.title,
          description: blog.description,
          images: [blog.twitter],
        },
        alternates: {
          canonical: canonicalUrl,
        },
      }
    }
  } catch (error) {
    console.warn("Error generating metadata:", error)
  }
  
  // Fallback metadata
  return {
    title: 'Red Test Lab Blog',
    description: 'Read our latest blog posts and articles.',
  }
}
