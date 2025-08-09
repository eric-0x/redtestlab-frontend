// Utility function to generate URL-friendly slugs
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
}

// Function to check if a string is a valid ID (numeric)
export function isNumericId(value: string): boolean {
  return /^\d+$/.test(value)
}

// Generate blog URL using slug - should be used throughout the app when linking to blogs
export function generateBlogUrl(blog: { id?: number; title: string; slug?: string }): string {
  const slug = blog.slug || generateSlug(blog.title)
  return `/blog/${slug}`
}

// Generate full canonical URL for SEO
export function generateCanonicalUrl(blog: { id?: number; title: string; slug?: string }): string {
  const slug = blog.slug || generateSlug(blog.title)
  return `https://redtestlab.com/blog/${slug}`
}

// Function to truncate text for meta descriptions
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Function to clean HTML from content for meta descriptions
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// Function to generate reading time estimate
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = stripHtml(content).split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Function to validate and format image URLs
export function formatImageUrl(imageUrl: string | undefined, fallback: string = '/favicon.ico'): string {
  if (!imageUrl) return fallback
  
  // If it's a relative URL, make it absolute
  if (imageUrl.startsWith('/')) {
    return `https://redtestlab.com${imageUrl}`
  }
  
  // If it doesn't start with http/https, assume it needs the domain
  if (!imageUrl.startsWith('http')) {
    return `https://redtestlab.com/${imageUrl}`
  }
  
  return imageUrl
}

// Function to generate meta description from blog content
export function generateMetaDescription(blog: { description?: string; content?: string; title: string }): string {
  // First try the explicit description
  if (blog.description && blog.description.trim()) {
    return truncateText(stripHtml(blog.description), 160)
  }
  
  // Fallback to content excerpt
  if (blog.content && blog.content.trim()) {
    const cleanContent = stripHtml(blog.content)
    return truncateText(cleanContent, 160)
  }
  
  // Last resort - generate from title
  return `Read about ${blog.title} at RedTest Lab - your trusted health testing partner.`
}

// Function to navigate to a blog post using slug-based URL
// This will fetch the blog data first, generate slug, and navigate to clean URL
export async function navigateToBlog(router: any, blog: { id?: number; title?: string; slug?: string }) {
  try {
    let blogData = blog
    
    // If we don't have title but have ID, fetch the blog data first
    if (blog.id && !blog.title) {
      const response = await fetch(`https://redtestlab.com/api/blog/${blog.id}`)
      if (response.ok) {
        blogData = await response.json()
      } else {
        // If fetch fails, fallback to ID (should rarely happen)
        router.push(`/blog/${blog.id}`)
        return
      }
    }
    
    // Generate slug from title
    if (blogData.title) {
      const slug = blogData.slug || generateSlug(blogData.title)
      router.push(`/blog/${slug}`)
    } else {
      // Last resort: use ID if no title available
      router.push(`/blog/${blog.id}`)
    }
  } catch (error) {
    console.error('Error navigating to blog:', error)
    // Fallback to ID navigation
    if (blog.id) {
      router.push(`/blog/${blog.id}`)
    }
  }
}
