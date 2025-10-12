"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  User, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Truck,
  Search,
  X
} from "lucide-react"

interface DeliveryUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: string
  isActive: boolean
  isAvailable: boolean
  totalCollections: number
  rating: number
  totalEarnings: number
  profileImageUrl: string | null
}

interface SidebarLink {
  title: string
  icon: React.ReactNode
  path: string
  subLinks?: SidebarLink[]
}

interface SidebarSection {
  title: string
  icon: React.ReactNode
  mainPath: string
  subLinks: SidebarLink[]
}

const deliverySections: SidebarSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} className="text-orange-600" />,
    mainPath: "/delivery/dashboard",
    subLinks: []
  },
  {
    title: "My Collections",
    icon: <Package size={20} className="text-orange-600" />,
    mainPath: "/delivery/collections",
    subLinks: []
  },
  {
    title: "Profile",
    icon: <User size={20} className="text-orange-600" />,
    mainPath: "/delivery/profile",
    subLinks: []
  }
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPath?: string
}

export default function DeliverySidebar({ sidebarOpen, setSidebarOpen, currentPath }: SidebarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<DeliveryUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("deliveryUser")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title)
  }

  const activePath = currentPath || pathname

  const filteredSections = searchQuery
    ? deliverySections.filter(
        (section) =>
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.subLinks.some((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : deliverySections

  const handleLogout = () => {
    localStorage.removeItem("deliveryToken")
    localStorage.removeItem("deliveryUser")
    router.push("/delivery/login")
    setSidebarOpen(false)
  }

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
          <Link href="/delivery/dashboard" className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 shadow-lg">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex flex-col">
              <span className="text-lg font-bold text-orange-600">Delivery Portal</span>
              <span className="text-xs text-gray-500">RedTestLab</span>
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
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        ? "bg-orange-50 text-orange-600 font-medium"
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
                          ? "bg-orange-50 text-orange-600 font-medium"
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
                                ? "bg-orange-50 text-orange-600 font-medium"
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-medium text-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "D"}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{user?.name || "Delivery Boy"}</p>
                <p className="truncate text-xs text-gray-500">{user?.email || "delivery@redtestlab.com"}</p>
              </div>
              <button
                onClick={handleLogout}
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
