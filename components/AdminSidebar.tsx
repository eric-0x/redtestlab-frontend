"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  UserPlus,
  Search,
  TicketPercent,
  Package,
  Pill,
  Stethoscope,
  NotebookTabs,
} from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPath?: string
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentPath }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(3) // This state is not used in the UI, but kept as per original.
  const activePath = currentPath || pathname

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [sidebarOpen])

  useEffect(() => {
    const section = managementSections.find((section) => activePath && activePath.startsWith(section.mainPath))
    if (section) {
      setOpenSection(section.title)
    }
  }, [activePath])

  const managementSections = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} className="text-blue-600" />,
      mainPath: "/admin/dashboard",
      subLinks: [],
    },
    {
      title: "Site Management",
      icon: <Settings size={20} className="text-blue-600" />,
      mainPath: "/admin/site",
      subLinks: [
        { title: "Blog", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/blog" },
        { title: "Meta Tags", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/meta" },
        //{ title: "Doctor", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/doctor" },
        { title: "Career Listing", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/career" },
        {
          title: "Career Booked",
          icon: <Settings size={18} className="text-blue-600" />,
          path: "/admin/site/careerview",
        },
        { title: "User List", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/user" },
        { title: "Banner", icon: <Settings size={18} className="text-blue-600" />, path: "/admin/site/banner" },
      ],
    },
    {
      title: "Coupon Management",
      icon: <TicketPercent size={20} className="text-blue-600" />,
      mainPath: "/admin/coupon",
      subLinks: [
        {
          title: "Generate Coupon",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/coupon/create",
        },
      ],
    },
    {
      title: "Booking Management",
      icon: <TicketPercent size={20} className="text-blue-600" />,
      mainPath: "/admin/booking",
      subLinks: [
        {
          title: "New Booking",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/new",
        },
        {
          title: "Booking Overview",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/monthly",
        },
        {
          title: "Assign Booking",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/assign",
        },
        {
          title: "Booking Results",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/results",
        },
        {
          title: "Report Generation",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/report",
        },
        {
          title: "Email Compose",
          icon: <TicketPercent size={18} className="text-blue-600" />,
          path: "/admin/booking/email",
        },
      ],
    },
    {
      title: "Package Management",
      icon: <Package size={20} className="text-blue-600" />,
      mainPath: "/admin/package",
      subLinks: [
        { title: "List Package", icon: <Package size={18} className="text-blue-600" />, path: "/admin/package/new" },
        { title: "List Test", icon: <Package size={18} className="text-blue-600" />, path: "/admin/package/test" },
        {
          title: "Create Category",
          icon: <Package size={18} className="text-blue-600" />,
          path: "/admin/package/category",
        },
      ],
    },
    {
      title: "Service Provider Management",
      icon: <UserPlus size={20} className="text-blue-600" />,
      mainPath: "/admin/service",
      subLinks: [
        { title: "Add new", icon: <UserPlus size={18} className="text-blue-600" />, path: "/admin/service/new" },
        { title: "Provider List", icon: <UserPlus size={18} className="text-blue-600" />, path: "/admin/service/list" },
      ],
    },
    {
      title: "Prescription Management",
      icon: <Stethoscope size={20} className="text-blue-600" />,
      mainPath: "/admin/prescription",
      subLinks: [
        {
          title: "User Prescription",
          icon: <Pill size={18} className="text-blue-600" />,
          path: "/admin/prescription/new",
        },
        {
          title: "Service Provider Return",
          icon: <Stethoscope size={18} className="text-blue-600" />,
          path: "/admin/prescription/return",
        },
        {
          title: "Payout Requests",
          icon: <NotebookTabs size={18} className="text-blue-600" />,
          path: "/admin/prescription/payouts",
        },
      ],
    },
    {
      title: "Scan Management",
      icon: <Stethoscope size={20} className="text-blue-600" />,
      mainPath: "/admin/scan", // Changed mainPath to match sublink structure
      subLinks: [{ title: "Manage Scan", icon: <Pill size={18} className="text-blue-600" />, path: "/admin/scan/new" }],
    },
    {
      title: "Hospital Management",
      icon: <Stethoscope size={20} className="text-blue-600" />,
      mainPath: "/admin/hospital",
      subLinks: [
        { title: "Manage Doctors", icon: <Pill size={18} className="text-blue-600" />, path: "/admin/hospital/new" },
      ],
    },
  ]

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title)
  }

  const filteredSections = searchQuery
    ? managementSections.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.subLinks.some((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : managementSections

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[280px] transform bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } border-r border-gray-100`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 p-6 pt-14">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-lg">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-bold text-blue-600">Admin Portal</span>
              <span className="text-xs text-gray-500">Premium Dashboard</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 lg:hidden">
            <X size={24} />
            <span className="sr-only">Close Sidebar</span>
          </button>
        </div>
        <div className="border-b border-gray-100 p-4 pb-6 pt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
                <span className="sr-only">Clear Search</span>
              </button>
            )}
          </div>
        </div>
        <nav className="mt-2 h-[calc(100vh-180px)] overflow-y-auto px-4 pb-36 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent lg:pb-36">
          <div className="space-y-1">
            {filteredSections.map((section) => (
              <div key={section.title} className="mb-2">
                {section.subLinks.length === 0 ? (
                  <Link
                    href={section.mainPath}
                    className={`mb-1.5 flex w-full items-center rounded-lg p-2.5 transition-colors lg:mb-2 lg:p-3 ${
                      activePath === section.mainPath
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {section.icon}
                    <span className="ml-3 font-medium">{section.title}</span>
                  </Link>
                ) : (
                  <>
                    <div
                      onClick={() => toggleSection(section.title)}
                      className={`flex w-full cursor-pointer items-center rounded-lg p-2.5 transition-colors lg:p-3 ${
                        activePath && activePath.startsWith(section.mainPath)
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {section.icon}
                      <span className="ml-3 grow font-medium">{section.title}</span>
                      {openSection === section.title ? (
                        <ChevronDown size={18} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={18} className="text-gray-400" />
                      )}
                    </div>
                    {openSection === section.title && (
                      <div className="mt-1 space-y-1 pl-6">
                        {section.subLinks.map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                            className={`flex w-full items-center rounded-lg p-2 transition-colors ${
                              activePath === link.path
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {link.icon}
                            <span className="ml-3 text-sm font-medium">{link.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>
        <div className="fixed bottom-0 left-0 w-[280px] border-t border-gray-100 bg-white">
          <div className="p-4">
            <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="relative flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-medium text-white">
                  A
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">Admin User</p>
                <p className="truncate text-xs text-gray-500">admin@example.com</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/admin")
                  setSidebarOpen(false)
                }}
                className="ml-2 flex-shrink-0 rounded-md p-1.5 text-red-500 hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="sr-only">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
