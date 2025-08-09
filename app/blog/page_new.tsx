import { Metadata } from "next"
import BlogListClient from "./BlogListClient"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    // Try to fetch specific blog listing meta tags
    const response = await fetch("https://redtestlab.com/api/metatags/blog")
    if (!response.ok) {
      throw new Error("Failed to fetch blog meta tags")
    }
    const data = await response.json()

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      authors: [{ name: data.author }],
      viewport: data.viewport,
      icons: {
        icon: data.favicon,
      },
      openGraph: {
        title: data.title,
        description: data.description,
        url: data.canonicallink,
        type: "website",
        images: data.opengraph ? [data.opengraph] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.description,
        images: data.twitter ? [data.twitter] : undefined,
      },
      alternates: {
        canonical: data.canonicallink,
      },
      robots: "index, follow",
    }
  } catch (error) {
    console.error("Error fetching blog metadata:", error)
    return {
      title: "RedTest Lab Blog - Health Articles & News",
      description: "Read the latest health articles, medical news, and insights from RedTest Lab. Stay informed about health tests, preventive care, and wellness tips.",
      keywords: "health blog, medical articles, health news, lab tests, wellness tips, preventive care, medical insights",
      authors: [{ name: "RedTest Lab" }],
      viewport: "width=device-width, initial-scale=1",
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: "RedTest Lab Blog - Health Articles & News",
        description: "Read the latest health articles, medical news, and insights from RedTest Lab. Stay informed about health tests, preventive care, and wellness tips.",
        url: "https://redtestlab.com/blog",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "RedTest Lab Blog",
        description: "Read the latest health articles, medical news, and insights from RedTest Lab.",
      },
      alternates: {
        canonical: "https://redtestlab.com/blog",
      },
      robots: "index, follow",
    }
  }
}

export default function BlogPage() {
  return (
    <>
      {/* JSON-LD Structured Data for Blog Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "RedTest Lab Health Blog",
            "description": "Read the latest health articles, medical news, and insights from RedTest Lab. Stay informed about health tests, preventive care, and wellness tips.",
            "url": "https://redtestlab.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "RedTest Lab",
              "logo": {
                "@type": "ImageObject",
                "url": "https://redtestlab.com/logo.png",
              },
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://redtestlab.com/blog",
            },
            "genre": ["Health", "Medical", "Wellness"],
            "keywords": "health blog, medical articles, health news, lab tests, wellness tips, preventive care, medical insights",
          }),
        }}
      />
      <BlogListClient />
    </>
  )
}
