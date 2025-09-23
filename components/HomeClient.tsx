// components/HomeClient.tsx
"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryShowcase from "@/components/CategoryShowcase";
import HealthPackageCurosel from "@/components/HealthPackageCurosel";
import HealthTestsCarousel from "@/components/HealthTestsCarousel";
import ServiceFeatures from "@/components/ServiceFeatures";
import WomenHealthPackages from "@/components/WomenHealthPackages";
import CustomPackage from "@/components/CustomPackage";
import ScanList from "@/components/ScanList";
import HospitalBanner from "@/components/HospitalBanner";
import PlayStoreCard from "@/components/PlayStoreCard";
import Slider from "@/components/Slider";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function HomeClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("openProfileSidebar") === "true") {
        setSidebarOpen(true);
        localStorage.removeItem("openProfileSidebar");
      }
    }
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <CategoryShowcase />
      <HealthPackageCurosel />
      <HealthTestsCarousel />
      <ServiceFeatures />
      <WomenHealthPackages />
      <CustomPackage />
      <ScanList />
      <HospitalBanner />
     
      <Slider />
       <PlayStoreCard />
      <Testimonial />
      
      <Footer />
      <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
