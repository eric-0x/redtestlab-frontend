import { Metadata } from "next"
import AllClient from "./AllClient"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    // Try to fetch specific meta tags using API parameter "2"
    const response = await fetch("https://redtestlab.com/api/metatags/2", {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error("Failed to fetch meta tags")
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
        siteName: "RedTest Lab",
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
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return {
      title: "Affordable Health Packages in Bihar—RedTest Lab Vaishali",
      description: "Explore full-body checkups and wellness packages with RedTest Lab. Book online for health tests with home sample collection in Bihar.",
      keywords: "health packages, medical tests, diagnostic tests, health checkups, lab tests, preventive care, RedTest Lab",
      authors: [{ name: "RedTest Lab" }],
      viewport: "width=device-width, initial-scale=1",
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: "All Health Packages & Tests - RedTest Lab",
        description: "Browse all health packages and medical tests at RedTest Lab. Comprehensive health checkups, diagnostic tests, and preventive care packages at affordable prices.",
        url: "https://redtestlab.com/all",
        type: "website",
        siteName: "RedTest Lab",
      },
      twitter: {
        card: "summary_large_image",
        title: "All Health Packages & Tests - RedTest Lab",
        description: "Browse all health packages and medical tests at RedTest Lab. Comprehensive health checkups and diagnostic tests.",
      },
      alternates: {
        canonical: "https://redtestlab.com/all",
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
}

export default function AllPage() {
  return (
    <>
      {/* JSON-LD Structured Data for All Packages Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "All Health Packages & Tests",
            "description": "Browse all health packages and medical tests at RedTest Lab. Comprehensive health checkups, diagnostic tests, and preventive care packages.",
            "url": "https://redtestlab.com/all",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Health Packages and Tests",
              "description": "Complete list of health packages and medical tests available at RedTest Lab",
            },
            "provider": {
              "@type": "Organization",
              "name": "RedTest Lab",
              "url": "https://redtestlab.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://redtestlab.com/logo.png",
              },
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://redtestlab.com",
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "All Packages",
                  "item": "https://redtestlab.com/all",
                },
              ],
            },
            "keywords": "health packages, medical tests, diagnostic tests, health checkups, lab tests, preventive care",
          }),
        }}
      />
      <AllClient />
    </>
  )
}
