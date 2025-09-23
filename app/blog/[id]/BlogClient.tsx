"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  generateSlug, 
  generateCanonicalUrl, 
  formatImageUrl 
} from "../utils"

interface BlogData {
  id?: number
  title: string
  content: string
  img: string
  slug?: string
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

function isNumericId(value: string): boolean {
  return /^\d+$/.test(value)
}

export default function BlogClient({ blogSlugOrId }: { blogSlugOrId: string }) {
  const router = useRouter()
  const [blog, setBlog] = useState<BlogData | null>(null)
  const [related, setRelated] = useState<BlogData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        if (isNumericId(blogSlugOrId)) {
          const res = await fetch(`https://redtestlab.com/api/blog/${blogSlugOrId}`, { cache: "no-store" })
          if (res.ok) {
            const data: BlogData = await res.json()
            setBlog(data)
          }
          const all = await fetch("https://redtestlab.com/api/blog", { cache: "no-store" })
          if (all.ok) {
            const list: BlogData[] = await all.json()
            setRelated(list.filter((b) => b.id !== Number(blogSlugOrId)).slice(0, 5))
          }
        } else {
          const all = await fetch("https://redtestlab.com/api/blog", { cache: "no-store" })
          if (all.ok) {
            const list: BlogData[] = await all.json()
            const found = list.find((b) => (b.slug && b.slug === blogSlugOrId) || generateSlug(b.title) === blogSlugOrId) || null
            setBlog(found)
            setRelated(list.filter((b) => (found ? b.title !== found.title : true)).slice(0, 5))
          }
        }
      } catch (e) {
        // noop
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [blogSlugOrId])

  const canonical = useMemo(() => (blog ? generateCanonicalUrl(blog) : ""), [blog])
  const coverImage = useMemo(() => formatImageUrl(blog?.opengraph || blog?.img), [blog])
  const processedContent = useMemo(() => {
    const raw = blog?.content || ""
    // If content already contains paragraph or rich HTML tags, use as is
    if (/<p[\s>]/i.test(raw) || /<(ul|ol|h1|h2|h3|h4|blockquote|table|img|div)/i.test(raw)) {
      return raw
    }
    // Normalize line breaks, convert <br> to newlines, and split into paragraphs
    const normalized = raw
      .replace(/\r\n/g, "\n")
      .replace(/<br\s*\/?>(\s*)/gi, "\n")
    const parts = normalized
      .split(/\n{2,}|\n/)
      .map((s) => s.trim())
      .filter(Boolean)
    return parts.map((p) => `<p>${p}</p>`).join("")
  }, [blog])

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-12">
        <div className="container-custom">
          <div className="text-center text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-12">
        <div className="container-custom">
          <div className="text-center text-gray-600">Article not found.</div>
        </div>
      </div>
    )
  }

  const formattedUpdatedAt = blog.updatedAt || blog.createdAt || ""
  const dateText = formattedUpdatedAt
    ? new Date(formattedUpdatedAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
    : ""

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen py-8">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600">
          <a className="hover:text-sacred-maroon" href="/">Home</a>
          <span className="mx-2">/</span>
          <a className="hover:text-sacred-maroon" href="/blog">Blog</a>
          <span className="mx-2">/</span>
          <span className="text-sacred-maroon">{blog.title}</span>
        </nav>

        {/* Hero Image */}
        <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden mb-8">
          <img src={coverImage} alt={blog.title} className="object-cover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article */}
          <article className="lg:w-2/3 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            <header className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-sacred-maroon mb-3 md:mb-4 leading-tight tracking-tight">{blog.title}</h1>
              <div className="flex items-center text-gray-600 space-x-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sacred-gold mr-2">
                    {/* Calendar SVG (same as reference) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {dateText && <span>Last Updated: {dateText}</span>}
                </div>
              </div>
            </header>

            {/* Content */}
            <section
              className="prose prose-lg md:prose-lg prose-slate max-w-none mb-8
                         prose-headings:text-gray-900 prose-headings:font-bold
                         prose-p:text-gray-700 prose-p:leading-7 prose-p:my-4
                         prose-a:text-blue-600 hover:prose-a:text-blue-800
                         prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal
                         prose-li:my-1 prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Share */}
            <section className="border-t border-b border-gray-200 py-6 my-8">
              <h3 className="text-lg font-semibold mb-4">Share This Article:</h3>
              <div className="flex space-x-4">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 320 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                  </svg>
                </a>
                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + "\n\n" + canonical)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                  </svg>
                </a>
                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(canonical)}&title=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors"
                >
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                  </svg>
                </a>
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-sacred-gold">
              <h3 className="text-xl font-bold mb-4 text-sacred-maroon">About the Author</h3>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-sacred-gold mr-4">
                  <img alt={blog.author} width={64} height={64} className="h-16 w-16 rounded-full" src={"/images/logo.png"} />
                </div>
                <div>
                  <h4 className="font-semibold">{blog.author}</h4>
                  <p className="text-sm text-gray-600">Health Writer</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{blog.description}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-sacred-gold">
              <h3 className="text-xl font-bold mb-4 text-sacred-maroon">Related Articles</h3>
              <div className="space-y-4">
                {related.map((r) => {
                  const href = `/blog/${r.slug || generateSlug(r.title)}`
                  const thumb = formatImageUrl(r.img)
                  return (
                    <a key={r.title} className="group block" href={href} onClick={(e) => { e.preventDefault(); router.push(href) }}>
                      <div className="flex items-start">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img alt={r.title} className="object-cover" src={thumb} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-sacred-maroon transition-colors line-clamp-2">{r.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}


