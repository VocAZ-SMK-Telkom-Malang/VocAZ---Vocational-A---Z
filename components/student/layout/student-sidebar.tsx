// components/student/layout/student-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { STUDENT_MENU } from './sidebar-data'

type Props = {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
}

export function StudentSidebar({ isOpen, onClose, collapsed }: Props) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/student/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-outline-variant/30 flex flex-col transition-all duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          collapsed ? 'w-64 lg:w-[72px]' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center border-b border-outline-variant/30 shrink-0 ${
            collapsed
              ? 'lg:justify-center lg:px-2 px-5 justify-between'
              : 'justify-between px-5'
          }`}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-white font-display font-extrabold text-sm">
                  V
                </span>
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Voc<span className="text-primary">AZ</span>
              </span>
            </Link>
          )}

          {collapsed && (
            <Link
              href="/"
              className="hidden lg:flex w-8 h-8 rounded-lg bg-primary items-center justify-center"
              title="VocAZ"
            >
              <span className="text-white font-display font-extrabold text-sm">
                V
              </span>
            </Link>
          )}

          {/* Mobile close button — HANYA ini yang ada di sidebar */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav
          className={`flex-1 overflow-y-auto py-4 space-y-6 ${
            collapsed ? 'lg:px-2 px-3' : 'px-3'
          }`}
        >
          {STUDENT_MENU.map((group, gi) => (
            <div key={gi}>
              {group.title && (
                <p
                  className={`px-3 mb-2 font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/70 ${
                    collapsed ? 'lg:hidden' : ''
                  }`}
                >
                  {group.title}
                </p>
              )}

              {group.title && collapsed && (
                <div className="hidden lg:block mx-auto w-6 h-px bg-outline-variant/30 mb-2" />
              )}

              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors ${
                          collapsed
                            ? 'lg:justify-center lg:p-2.5 px-3 py-2 gap-3'
                            : 'px-3 py-2 gap-3'
                        } ${
                          active
                            ? 'bg-primary/10 text-primary'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active ? 'text-primary' : ''
                          }`}
                        />

                        <span
                          className={`truncate ${
                            collapsed ? 'lg:hidden' : ''
                          }`}
                        >
                          {item.label}
                        </span>

                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold ${
                              collapsed ? 'lg:hidden' : ''
                            }`}
                          >
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}

                        {/* Tooltip saat collapsed */}
                        {collapsed && (
                          <span className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 rounded-md bg-on-surface text-white text-xs font-medium whitespace-nowrap z-50 shadow-lg pointer-events-none">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom badge */}
        <div
          className={`border-t border-outline-variant/30 shrink-0 ${
            collapsed ? 'lg:p-2 p-4' : 'p-4'
          }`}
        >
          <div
            className={`flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 ${
              collapsed ? 'lg:justify-center lg:p-2 p-3' : 'p-3'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-bold">🎓</span>
            </div>
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="text-[11px] font-semibold text-on-surface truncate">
                Siswa & Alumni SMK
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">
                VocAZ Student
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}