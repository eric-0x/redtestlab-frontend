// app/page.tsx
import { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const generateMetadata = async (): Promise<Metadata> => {
  try {
    const response = await fetch("https://redtestlab.com/api/metatags/1");
    if (!response.ok) {
      throw new Error("Failed to fetch meta tags");
    }
    const data = await response.json();

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
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.description,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "RedTest Lab - Health Test Search",
      description: "Find and book blood tests and health checkups online with RedTest Lab",
      keywords: "blood test, health checkup, medical tests, lab tests",
      authors: [{ name: "RedTest Lab" }],
      viewport: "width=device-width, initial-scale=1",
      icons: {
        icon: "/favicon.ico",
      },
      openGraph: {
        title: "RedTest Lab Health Tests",
        description: "Find and book blood tests and health checkups online with RedTest Lab",
        url: "https://redtestlab.com",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "RedTest Lab",
        description: "Find and book blood tests and health checkups online with RedTest Lab",
      },
    };
  }
};

export default function Home() {
  return <HomeClient />;
}
