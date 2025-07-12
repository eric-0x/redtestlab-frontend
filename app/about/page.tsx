"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import {
  Award,
  ChevronRight,
  Clock,
  Home,
  Microscope,
  Users,
  Target,
  Zap,
  Globe,
  Shield,
  TrendingUp,
  ArrowRight,
  Check,
  Star,
} from "lucide-react"
import CountUp from "react-countup"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"
import Image from "next/image"
import Link from "next/link"

export default function PremiumAboutUs() {
  const [activeTab, setActiveTab] = useState(0)
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const statsRef = useRef(null)
  const timelineRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)

  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(heroScrollY, [0, 1], [1, 0])
  const heroScale = useTransform(heroScrollY, [0, 1], [1, 0.8])
  const heroY = useTransform(heroScrollY, [0, 1], [0, 100])

  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 })
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const timelineItems = [
    {
      year: "2018",
      title: "Foundation",
      description: "Established with a mission to democratize healthcare diagnostics across India.",
      icon: <Globe className="text-blue-500" size={24} />,
    },
    {
      year: "2019",
      title: "First Lab Network",
      description: "Expanded to 10 cities with state-of-the-art diagnostic facilities.",
      icon: <Microscope className="text-blue-500" size={24} />,
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched our digital platform for seamless test booking and report access.",
      icon: <Zap className="text-blue-500" size={24} />,
    },
    {
      year: "2021",
      title: "Home Collection Launch",
      description: "Pioneered 1-hour home sample collection service across major cities.",
      icon: <Home className="text-blue-500" size={24} />,
    },
    {
      year: "2022",
      title: "Advanced Testing",
      description: "Introduced genetic testing and specialized diagnostic services.",
      icon: <Shield className="text-blue-500" size={24} />,
    },
    {
      year: "2023",
      title: "National Expansion",
      description: "Reached 100+ cities, making quality diagnostics accessible nationwide.",
      icon: <TrendingUp className="text-blue-500" size={24} />,
    },
  ]

  const teamMembers = [
    {
      name: "Dr. Aisha Sharma",
      role: "Chief Medical Officer",
      image: "/images/doctor-1.jpg",
      bio: "With over 15 years of experience in laboratory medicine, Dr. Sharma leads our medical operations and quality control initiatives.",
    },
    {
      name: "Dr. Rajiv Mehta",
      role: "Head of Diagnostics",
      image: "/images/doctor-2.jpg",
      bio: "A pioneer in molecular diagnostics with numerous research publications, Dr. Mehta oversees our advanced testing methodologies.",
    },
    {
      name: "Priya Desai",
      role: "Chief Technology Officer",
      image: "/images/executive-1.jpg",
      bio: "Former tech leader at healthcare startups, Priya drives our digital transformation and technological innovation.",
    },
    {
      name: "Vikram Reddy",
      role: "Chief Executive Officer",
      image: "/images/executive-2.jpg",
      bio: "With a background in healthcare management, Vikram is passionate about making quality diagnostics accessible to all Indians.",
    },
  ]

  const testimonials = [
    {
      quote:
        "The home collection service was incredibly convenient. The phlebotomist was professional, and I received my reports within 24 hours. Excellent service!",
      name: "Ananya Patel",
      location: "Mumbai",
      image: "/images/testimonial-1.jpg",
    },
    {
      quote:
        "As someone with a busy schedule, their digital reports and easy booking system have made health monitoring so much easier. The accuracy and speed are impressive.",
      name: "Rahul Sharma",
      location: "Delhi",
      image: "/images/testimonial-2.jpg",
    },
    {
      quote:
        "The genetic testing services provided valuable insights for our family's health planning. The counseling support was exceptional and helped us understand the results.",
      name: "Dr. Meera Krishnan",
      location: "Bangalore",
      image: "/images/testimonial-3.jpg",
    },
  ]

  const awards = [
    {
      title: "Healthcare Innovation Award",
      year: "2023",
      organization: "Indian Medical Association",
    },
    {
      title: "Best Diagnostic Chain",
      year: "2022",
      organization: "Healthcare Excellence Awards",
    },
    {
      title: "Customer Service Excellence",
      year: "2021",
      organization: "National Quality Forum",
    },
  ]

  const tabContent = [
    {
      title: "Our Mission",
      content:
        "We're on a mission to democratize access to quality healthcare diagnostics across India. By combining cutting-edge technology with medical expertise, we aim to make accurate testing available to everyone, regardless of location or economic status.",
    },
    {
      title: "Our Vision",
      content:
        "We envision a future where preventive healthcare is the norm, not the exception. A world where every Indian has access to timely, accurate diagnostics that can detect health issues before they become critical, leading to longer, healthier lives.",
    },
    {
      title: "Our Promise",
      content:
        "We promise unwavering commitment to quality, accessibility, and affordability. Every test we conduct meets the highest standards of accuracy, delivered with compassion and respect for the individual behind each sample.",
    },
  ]

  useEffect(() => {
    // Add cursor effect
    const cursor = document.createElement("div")
    cursor.classList.add("custom-cursor")
    document.body.appendChild(cursor)

    const moveCursor = (e: any) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor)
      }
    }
  }, [])

  return (
    <div className="bg-white overflow-hidden">
      {/* Our Story Section with Tabs */}
      <section id="our-story" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50 clip-path-diagonal z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              className="lg:w-1/2"
              ref={missionRef}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <span className="inline-block py-1 px-3 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6">
                OUR STORY
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                A Vision for <span className="text-blue-600">Healthier India</span>
              </h2>
              <div className="mb-10">
                <div className="py-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg text-gray-700 leading-relaxed"
                    >
                      {tabContent[activeTab].content}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#our-impact"
                  className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  See our impact
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#our-team"
                  className="group inline-flex items-center text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                  Meet our team
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply" />
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply" />
                <div className="relative z-10">
                  <Image
                    src="/images/lab.webp"
                    alt="Our laboratory team"
                    width={600}
                    height={500}
                    className="rounded-xl shadow-2xl object-cover w-full h-[500px]"
                  />
                  <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-xl shadow-xl max-w-xs">
                    <div className="flex items-center mb-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                            <Image
                              src="/images/doc3.webp"
                              alt="Team member"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Our Team</div>
                        <div className="text-xs text-gray-500">50+ Medical Experts</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <div className="ml-2 text-sm text-gray-600">4.9 (2.5k+ reviews)</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section
        id="our-impact"
        ref={statsRef}
        className="py-24 md:py-32 bg-gradient-to-r from-blue-900 to-blue-800 text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 left-0 w-full h-20 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 0)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-20 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 border border-blue-400 text-blue-200 text-sm font-medium rounded-full mb-6">
              OUR IMPACT
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Making a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Difference
              </span>
            </h2>
            <p className="text-xl text-blue-100">
              Numbers tell the story of our commitment to revolutionizing healthcare diagnostics in India.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/15 transition-colors"
              variants={fadeIn}
            >
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {statsInView && <CountUp end={7} suffix="M+" duration={2.5} />}
              </div>
              <div className="text-lg font-medium mb-4">Lives Touched</div>
              <p className="text-blue-200">Patients served across India with quality diagnostic services</p>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/15 transition-colors"
              variants={fadeIn}
            >
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {statsInView && <CountUp end={100} suffix="+" duration={2.5} />}
              </div>
              <div className="text-lg font-medium mb-4">Cities Covered</div>
              <p className="text-blue-200">Bringing quality diagnostics to urban and rural India</p>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/15 transition-colors"
              variants={fadeIn}
            >
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {statsInView && <CountUp end={500} suffix="+" duration={2.5} />}
              </div>
              <div className="text-lg font-medium mb-4">Test Types</div>
              <p className="text-blue-200">Comprehensive test menu from routine to specialized diagnostics</p>
            </motion.div>
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/15 transition-colors"
              variants={fadeIn}
            >
              <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {statsInView && <CountUp end={99.8} suffix="%" decimals={1} duration={2.5} />}
              </div>
              <div className="text-lg font-medium mb-4">Accuracy Rate</div>
              <p className="text-blue-200">Maintaining the highest standards of diagnostic precision</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="our-journey" ref={timelineRef} className="py-24 md:py-32 bg-white relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6">
              OUR JOURNEY
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              From Vision to <span className="text-blue-600">Reality</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our journey of transforming healthcare diagnostics in India, one milestone at a time.
            </p>
          </motion.div>
          <div className="relative">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              initial="hidden"
              animate={timelineInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              {timelineItems.map((item, index) => (
                <motion.div key={index} className="relative" variants={fadeIn}>
                  <div className="absolute top-0 -mt-2 w-full flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center z-10">
                      {item.icon}
                    </div>
                  </div>
                  <div className="pt-14 pb-8 px-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100">
                    <div className="text-blue-600 font-bold text-xl mb-2">{item.year}</div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section with Parallax */}
      <section
        id="our-services"
        className="py-24 md:py-32 bg-gradient-to-r from-blue-800 to-blue-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lab-equipment-advanced.jpg"
            alt="Advanced laboratory equipment"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 border border-blue-400 text-blue-200 text-sm font-medium rounded-full mb-6">
              GLUCOSE TO GENETICS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Diagnostic Solutions
              </span>
            </h2>
            <p className="text-xl text-blue-100">
              At our labs, we've built a comprehensive portfolio approach with both routine and specialized test menus
              with advanced testing labs all over India.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300"
              variants={fadeIn}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Zap size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Digital-first approach</h3>
              <p className="text-blue-100 mb-6">
                Leveraging cutting-edge technology to make diagnostics more accessible, efficient, and user-friendly for
                all our patients.
              </p>
              <Link href="#" className="inline-flex items-center text-blue-300 hover:text-white transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
            <motion.div
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300"
              variants={fadeIn}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Clock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Accurate Reports within 24 Hrs</h3>
              <p className="text-blue-100 mb-6">
                Quick turnaround times without compromising on quality, ensuring you get results when you need them
                most.
              </p>
              <Link href="#" className="inline-flex items-center text-blue-300 hover:text-white transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
            <motion.div
              className="group bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all hover:-translate-y-1 duration-300"
              variants={fadeIn}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Home size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">On-demand 1-hour home collection</h3>
              <p className="text-blue-100 mb-6">
                Convenience at your doorstep with our quick response home collection service, making healthcare truly
                accessible.
              </p>
              <Link href="#" className="inline-flex items-center text-blue-300 hover:text-white transition-colors">
                Learn more <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="mt-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Link
              href="/services"
              className="inline-flex items-center bg-white text-blue-800 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-colors"
            >
              View All Services
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="our-values" ref={valuesRef} className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full opacity-70" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full opacity-70" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-3 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-6">
              OUR CORE VALUES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Principles that <span className="text-blue-600">Guide Us</span>
            </h2>
            <p className="text-xl text-gray-600">
              Our values define who we are and how we approach our mission of revolutionizing healthcare diagnostics.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              variants={fadeIn}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-blue-800">CUSTOMER FIRST</h3>
                <div className="text-blue-600">
                  <Users size={32} />
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Design for Customer</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Commit to Quality</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Exceed Expectations</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              variants={fadeIn}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-blue-800">THINK LIKE AN OWNER</h3>
                <div className="text-blue-600">
                  <Award size={32} />
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Be Result Oriented</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Take Accountability</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Be Entrepreneurial</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
              variants={fadeIn}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-blue-800">BUILD A LASTING INSTITUTION</h3>
                <div className="text-blue-600">
                  <Target size={32} />
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Think Bigger Picture</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Uphold Integrity</span>
                </li>
                <li className="flex items-start">
                  <Check size={20} className="text-blue-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Lead by Example</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-10 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-3xl p-8 md:p-16 text-white max-w-6xl mx-auto relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 -translate-x-1/3 translate-y-1/3" />
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Join Us in Our Mission to Revolutionize Healthcare Diagnostics
                </h2>
                <p className="text-xl text-blue-100 mb-10">
                  Whether you're looking for quality diagnostics or want to partner with us, we're here to make a
                  difference together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="bg-white text-blue-800 px-8 py-4 rounded-full font-medium hover:bg-blue-50 transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/locations"
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors"
                  >
                    Find a Lab Near You
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom cursor styles */}
      <style jsx>{`
        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid #1a5df7;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9999;
          transition: transform 0.1s ease;
          mix-blend-mode: difference;
        }
        .clip-path-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 100%);
        }
        .clip-path-diagonal-reverse {
          clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
        }
        .testimonial-swiper .swiper-button-next,
        .testimonial-swiper .swiper-button-prev {
          color: #1a5df7;
        }
        .testimonial-swiper .swiper-button-next:after,
        .testimonial-swiper .swiper-button-prev:after {
          font-size: 24px;
        }
      `}</style>
    </div>
  )
}
