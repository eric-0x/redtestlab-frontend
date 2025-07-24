'use client'

import { ReactNode, useState } from 'react'
import Sidebar from '@/components/ServiceSidebar'
import Navbar from '@/components/ServiceNavbar'

export default function ServiceLayoutWrapper({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-16 lg:pl-[280px] transition-all duration-300">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
