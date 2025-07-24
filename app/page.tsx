"use client"
import { useState, useEffect } from "react";
import CategoryShowcase from "@/components/CategoryShowcase";
import CustomPackage from "@/components/CustomPackage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HealthPackageCurosel from "@/components/HealthPackageCurosel";
import Hero from "@/components/Hero";
import HospitalBanner from "@/components/HospitalBanner";
import PlayStoreCard from "@/components/PlayStoreCard";
import ScanList from "@/components/ScanList";
import ServiceFeatures from "@/components/ServiceFeatures";
import Slider from "@/components/Slider";
import Testimonial from "@/components/Testimonial";
import WomenHealthPackages from "@/components/WomenHealthPackages";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function Home() {
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
      <Header/>
      <Hero/>
      <CategoryShowcase/>
      <HealthPackageCurosel/>
      <ServiceFeatures/>
      <WomenHealthPackages/>
      <CustomPackage/>
      <ScanList/>
      <HospitalBanner/>
      <PlayStoreCard/>
      <Slider/>
      <Testimonial/>
      <Footer/>
      <ProfileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
