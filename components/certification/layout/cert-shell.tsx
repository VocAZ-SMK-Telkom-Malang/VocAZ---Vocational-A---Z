// components/certification/layout/cert-shell.tsx
'use client'

import { useState } from 'react'
import { CertSidebar } from './cert-sidebar'
import { CertTopbar } from './cert-topbar'

type Props = {
  children: React.ReactNode
  institutionName: string
  institutionLogo: string | null
  userName: string
  userAvatar: string | null
}

export function CertShell({
  children,
  institutionName,
  institutionLogo,
  userName,
  userAvatar,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface w-full">
      <CertSidebar
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
        <CertTopbar
          institutionName={institutionName}
          institutionLogo={institutionLogo}
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