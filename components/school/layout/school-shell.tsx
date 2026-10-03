// components/school/layout/school-shell.tsx
'use client'

import { useState } from 'react'
import { SchoolSidebar } from './school-sidebar'
import { SchoolTopbar } from './school-topbar'

type Props = {
  children: React.ReactNode
  schoolName: string
  schoolLogo: string | null
  userName: string
  userAvatar: string | null
}

export function SchoolShell({
  children,
  schoolName,
  schoolLogo,
  userName,
  userAvatar,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface w-full">
      <SchoolSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div
        className={`
          flex flex-col min-h-screen w-full transition-all duration-300
          ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'}
        `}
      >
        <SchoolTopbar
          schoolName={schoolName}
          schoolLogo={schoolLogo}
          userName={userName}
          userAvatar={userAvatar}
          onOpenSidebar={() => setIsOpen(true)}
        />

        <main className="flex-1 w-full px-4 md:px-6 lg:px-8 py-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}