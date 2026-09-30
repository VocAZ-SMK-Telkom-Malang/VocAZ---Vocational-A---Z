// components/student/layout/student-shell.tsx
'use client'

import { useState } from 'react'
import { StudentSidebar } from './student-sidebar'
import { StudentTopbar } from './student-topbar'
import { useSidebarState } from './use-sidebar-state'
import { useCommandPalette } from '@/hooks/use-command-palette'
import { CommandPalette } from '@/components/shared/command-palette/command-palette'

type Props = {
  children: React.ReactNode
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export function StudentShell({ children, user }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)   // mobile
  const { collapsed, toggle } = useSidebarState()          // desktop
  const commandPalette = useCommandPalette()

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Sidebar fixed */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggle}
      />

      {/* Main area */}
      <div
        className={`
          flex flex-col min-h-screen
          transition-[padding] duration-300 ease-in-out
          ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}
        `}
      >
        {/* Topbar sticky — full width */}
        <StudentTopbar
          onMenuClick={() => setSidebarOpen(true)}   // mobile
          onToggleCollapse={toggle}                   // desktop
          collapsed={collapsed}                       // state
          onOpenCommandPalette={commandPalette.openPalette}
          user={user}
        />

        {/* Content */}
        <main className="flex-1">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPalette.open}
        onClose={commandPalette.close}
        role="student"
      />
    </div>
  )
}