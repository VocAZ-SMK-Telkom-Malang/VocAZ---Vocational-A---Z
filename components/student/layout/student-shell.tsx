// components/student/layout/student-shell.tsx
'use client'

import { useState } from 'react'
import { StudentSidebar } from './student-sidebar'
import { StudentTopbar } from './student-topbar'
import { useSidebarState } from './use-sidebar-state'

type Props = {
  children: React.ReactNode
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export function StudentShell({ children, user }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { collapsed, toggle } = useSidebarState()

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        
      />

      <div className="flex-1 flex flex-col min-w-0">
        <StudentTopbar
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={toggle}
          user={user}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}