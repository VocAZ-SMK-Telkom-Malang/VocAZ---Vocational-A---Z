// components/company/layout/company-shell.tsx
'use client'

import { useState } from 'react'
import { CompanySidebar } from './company-sidebar'
import { CompanyTopbar } from './company-topbar'

type Props = {
  children: React.ReactNode
  companyName: string
  companyLogo: string | null
  userName: string
  userAvatar: string | null
}

export function CompanyShell({
  children,
  companyName,
  companyLogo,
  userName,
  userAvatar,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface w-full">
      <CompanySidebar
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
        <CompanyTopbar
          companyName={companyName}
          companyLogo={companyLogo}
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