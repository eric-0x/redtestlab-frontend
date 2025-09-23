
import { Metadata } from "next"
import { redirect } from "next/navigation"
import BlogClient from "./BlogClient"
import { 
  generateCanonicalUrl, 
  isNumericId, 
  generateSlug, 
  formatImageUrl, 
  generateMetaDescription,
  truncateText 
} from "../utils"

// Enhanced blog data interface
interface BlogData {
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

// Fetch blog by ID to get title for slug generation
async function fetchBlogById(id: string): Promise<BlogData | null> {
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

// Fetch blog by slug - search through all blogs
async function fetchBlogBySlug(slug: string): Promise<BlogData | null> {
  try {
    const response = await fetch('https://redtestlab.com/api/blog', {
      cache: 'no-store'
    })
    if (!response.ok) return null
    
    const blogs: BlogData[] = await response.json()
    
    // Find blog by matching slug or generated slug from title
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
  
  // Get blog data for structured data
  let blog: BlogData | null = null
  if (!isNumericId(id)) {
    blog = await fetchBlogBySlug(id)
  }
  
  // If we reach here, it's a slug - pass to client component
  return (
    <>
      {/* JSON-LD Structured Data */}
      {blog && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": blog.title,
              "description": generateMetaDescription(blog),
              "image": {
                "@type": "ImageObject",
                "url": formatImageUrl(blog.opengraph || blog.img),
                "width": 1200,
                "height": 630,
              },
              "author": {
                "@type": "Person",
                "name": blog.author,
              },
              "publisher": {
                "@type": "Organization",
                "name": "RedTest Lab",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://redtestlab.com/logo.png",
                },
              },
              "datePublished": blog.createdAt,
              "dateModified": blog.updatedAt || blog.createdAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": generateCanonicalUrl(blog),
              },
              "articleSection": "Health",
              "keywords": blog.keywords.split(',').map((k: string) => k.trim()),
              "url": generateCanonicalUrl(blog),
              "isPartOf": {
                "@type": "Blog",
                "@id": "https://redtestlab.com/blog",
                "name": "RedTest Lab Health Blog",
              },
              "inLanguage": "en-US",
              "potentialAction": {
                "@type": "ReadAction",
                "target": generateCanonicalUrl(blog),
              },
            }),
          }}
        />
      )}
      <BlogClient blogSlugOrId={id} />
    </>
  )
}

// Enhanced metadata generation with proper fallbacks
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    let blog: BlogData | null = null
    
    // If it's a numeric ID, fetch the blog data
    if (isNumericId(id)) {
      blog = await fetchBlogById(id)
    } else {
      // It's a slug, find the blog by slug
      blog = await fetchBlogBySlug(id)
    }
    
    if (blog) {
      const canonicalUrl = generateCanonicalUrl(blog)
      const publishedTime = blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined
      const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined
      const metaDescription = generateMetaDescription(blog)
      const ogImageUrl = formatImageUrl(blog.opengraph || blog.img)
      const twitterImageUrl = formatImageUrl(blog.twitter || blog.opengraph || blog.img)
      
      return {
        title: blog.metaTitle || blog.title,
        description: metaDescription,
        keywords: blog.keywords,
        authors: [{ name: blog.author }],
        viewport: blog.viewport || "width=device-width, initial-scale=1",
        icons: {
          icon: formatImageUrl(blog.favicon),
        },
        openGraph: {
          title: blog.metaTitle || blog.title,
          description: metaDescription,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: blog.title,
            }
          ],
          url: canonicalUrl,
          type: "article",
          publishedTime,
          modifiedTime,
          authors: [blog.author],
          siteName: "RedTest Lab",
          locale: "en_US",
        },
        twitter: {
          card: "summary_large_image",
          title: truncateText(blog.metaTitle || blog.title, 70),
          description: truncateText(metaDescription, 200),
          images: [
            {
              url: twitterImageUrl,
              alt: blog.title,
            }
          ],
          creator: `@${blog.author.replace(/\s+/g, '').toLowerCase()}`,
          site: "@RedTestLab",
        },
        alternates: {
          canonical: canonicalUrl,
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
        // Add structured data for better SEO
        other: {
          ...(publishedTime && { 'article:published_time': publishedTime }),
          ...(modifiedTime && { 'article:modified_time': modifiedTime }),
          'article:author': blog.author,
          'article:section': 'Health',
          'article:tag': blog.keywords,
        },
      }
    }
  } catch (error) {
    console.warn("Error generating blog metadata:", error)
  }
  
  // Enhanced fallback metadata for when blog is not found
  const fallbackCanonical = `https://redtestlab.com/blog/${id}`
  
  return {
    title: 'Blog Article - RedTest Lab',
    description: 'Read our latest health articles and medical insights at RedTest Lab.',
    keywords: 'health blog, medical articles, health insights, RedTest Lab',
    authors: [{ name: "RedTest Lab" }],
    viewport: "width=device-width, initial-scale=1",
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: 'Blog Article - RedTest Lab',
      description: 'Read our latest health articles and medical insights at RedTest Lab.',
      url: fallbackCanonical,
      type: "article",
      siteName: "RedTest Lab",
    },
    twitter: {
      card: "summary_large_image",
      title: 'Blog Article - RedTest Lab',
      description: 'Read our latest health articles and medical insights at RedTest Lab.',
    },
    alternates: {
      canonical: fallbackCanonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
