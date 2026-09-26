'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminTopbar } from './admin-topbar'

const STORAGE_KEY = 'vocaz.admin.sidebar.collapsed'

type Props = {
  user: {
    fullName: string | null
    email: string
  }
  title?: string
  children: React.ReactNode
}

export function AdminShell({ user, title, children }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'true') setCollapsed(true)
  }, [])

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem(STORAGE_KEY, String(next))
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`
          transition-all duration-300 ease-in-out
          min-h-screen flex flex-col
          ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <AdminTopbar
          user={user}
          title={title}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}