// Example: How to use the blog utils with the new client-side slug system
import { useRouter } from 'next/navigation'
import { generateSlug, navigateToBlog } from './utils'

// Example BlogCard component that uses slug-based URLs
interface BlogCardProps {
  blog: {
    id: number
    title: string
    slug?: string
    description: string
    img: string
    author: string
    createdAt: string
  }
}

export function BlogCard({ blog }: BlogCardProps) {
  const router = useRouter()
  
  // Handle blog navigation using the new system
  const handleBlogClick = () => {
    navigateToBlog(router, blog)
  }
  
  // Generate slug for display (optional)
  const slug = blog.slug || generateSlug(blog.title)
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={blog.img} alt={blog.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">
          <button 
            onClick={handleBlogClick}
            className="hover:text-blue-600 transition-colors text-left"
          >
            {blog.title}
          </button>
        </h2>
        <p className="text-gray-600 mb-4">{blog.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>By {blog.author}</span>
          <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
        </div>
        <p className="text-xs text-gray-400 mb-4">URL: /blog/{slug}</p>
        <button 
          onClick={handleBlogClick}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Read More
        </button>
      </div>
    </article>
  )
}

// Example: How the new system works
/*
FLOW:

1. User clicks on blog with ID=123 and title="How to Improve SEO"

2. navigateToBlog() generates slug: "how-to-improve-seo"

3. Router navigates to: /blog/how-to-improve-seo

4. BlogClient receives "how-to-improve-seo" as blogSlugOrId

5. BlogClient detects it's not numeric, so calls findBlogBySlug()

6. findBlogBySlug() fetches all blogs and finds the one with matching title/slug

7. Blog content is displayed with clean slug URL

BENEFITS:
- Clean URLs: /blog/how-to-improve-seo instead of /blog/123
- SEO friendly: Keywords in URL
- Uses existing APIs only
- Client-side handling: Fast navigation
- Backward compatible: Old ID links still work

USAGE IN BLOG LISTINGS:
Instead of: <Link href={`/blog/${blog.id}`}>
Use: <button onClick={() => navigateToBlog(router, blog)}>

The system automatically handles:
- ID to slug conversion
- URL generation
- Blog lookup by slug
- Dynamic metadata updates
*/
