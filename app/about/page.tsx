import { Metadata } from "next"
import AboutClient from "./AboutClient"

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const response = await fetch("https://redtestlab.com/api/metatags/5", { cache: 'no-store' })
    if (!response.ok) throw new Error("Failed to fetch meta tags")
    const data = await response.json()
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      authors: [{ name: data.author }],
      viewport: data.viewport,
      icons: { icon: data.favicon },
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
      alternates: { canonical: data.canonicallink },
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
      title: "RedTest Lab Doctor Booking—Top Doctors in Bihar & Vaishali",
      description: "Book appointments with top-rated doctors on RedTest Lab. Connect with trusted healthcare professionals near you in Bihar and Vaishali.",
      keywords: "medical tests, lab tests, blood tests, diagnostic tests, health screening, RedTest Lab",
      authors: [{ name: "RedTest Lab" }],
      viewport: "width=device-width, initial-scale=1",
      icons: { icon: "/favicon.ico" },
      openGraph: {
        title: "All Medical Tests - RedTest Lab",
        description: "Browse and book all individual medical tests and lab diagnostics at RedTest Lab.",
        url: "https://redtestlab.com/test",
        type: "website",
        siteName: "RedTest Lab",
      },
      twitter: {
        card: "summary_large_image",
        title: "All Medical Tests - RedTest Lab",
        description: "Browse and book all individual medical tests and lab diagnostics at RedTest Lab.",
      },
      alternates: { canonical: "https://redtestlab.com/test" },
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

export default function DoctorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "All Medical Tests",
            "description": "Browse and book all individual medical tests and lab diagnostics at RedTest Lab.",
            "url": "https://redtestlab.com/test",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Medical Tests",
              "description": "Complete list of medical tests available at RedTest Lab",
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
                  "name": "All Tests",
                  "item": "https://redtestlab.com/test",
                },
              ],
            },
            "keywords": "medical tests, lab tests, blood tests, diagnostic tests, health screening, RedTest Lab",
          }),
        }}
      />
      <AboutClient />
    </>
  )
}