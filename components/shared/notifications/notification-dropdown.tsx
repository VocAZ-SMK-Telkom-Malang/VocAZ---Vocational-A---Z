// components/shared/notifications/notification-dropdown.tsx
'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  Trash2,
  FileText,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  Settings as SettingsIcon,
  Inbox,
  X,
} from 'lucide-react'
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/app/actions/notifications'

// ✅ TAMBAH prop notificationsPath
type Props = {
  notificationsPath?: string
}

type NotificationItem = {
  id: string
  type: string
  title: string
  body: string | null
  actionUrl: string | null
  isRead: boolean
  createdAt: string
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  message: { icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
  application_update: {
    icon: FileText,
    color: 'bg-indigo-100 text-indigo-700',
  },
  verification: {
    icon: ShieldCheck,
    color: 'bg-emerald-100 text-emerald-700',
  },
  opportunity: {
    icon: Briefcase,
    color: 'bg-amber-100 text-amber-700',
  },
  system: {
    icon: SettingsIcon,
    color: 'bg-slate-100 text-slate-700',
  },
}

export function NotificationDropdown({
  notificationsPath = '/student/notifications',
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Load notifications tiap buka
  useEffect(() => {
    if (!open) return

    setLoading(true)
    fetchNotifications(15)
      .then((res) => {
        if (res.ok && res.data) {
          setItems(res.data.items)
          setUnreadCount(res.data.unreadCount)
        }
      })
      .finally(() => setLoading(false))
  }, [open])

  // Load unread count pertama kali
  useEffect(() => {
    fetchNotifications(1).then((res) => {
      if (res.ok && res.data) {
        setUnreadCount(res.data.unreadCount)
      }
    })
  }, [])

  function handleMarkRead(id: string) {
    startTransition(async () => {
      const result = await markNotificationAsRead(id)
      if (result.ok) {
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((c) => Math.max(0, c - 1))
      }
    })
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead()
      if (result.ok) {
        setItems((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteNotification(id)
      if (result.ok) {
        const item = items.find((n) => n.id === id)
        setItems((prev) => prev.filter((n) => n.id !== id))
        if (item && !item.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1))
        }
      }
    })
  }

  function handleItemClick(item: NotificationItem) {
    if (!item.isRead) {
      handleMarkRead(item.id)
    }
    setOpen(false)
    if (item.actionUrl) {
      router.push(item.actionUrl)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-surface-container-lowest">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-32px)] bg-surface-container-lowest rounded-2xl shadow-2xl ring-1 ring-outline-variant/30 overflow-hidden z-[100]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-on-surface">
                Notifikasi
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                  {unreadCount} baru
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={isPending}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                  aria-label="Tandai semua dibaca"
                  title="Tandai semua dibaca"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-on-surface-variant/60" />
                </div>
                <p className="text-sm font-bold text-on-surface mb-1">
                  Belum ada notifikasi
                </p>
                <p className="text-xs text-on-surface-variant">
                  Notif tentang lamaran, pesan, dan lowongan bakal muncul di
                  sini
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {items.map((item) => {
                  const config =
                    TYPE_CONFIG[item.type] ?? TYPE_CONFIG.system
                  const Icon = config.icon

                  return (
                    <li key={item.id}>
                      <div
                        className={`
                          group relative flex items-start gap-3 p-3.5 cursor-pointer transition-colors
                          ${
                            item.isRead
                              ? 'hover:bg-surface-container/50'
                              : 'bg-primary/5 hover:bg-primary/10'
                          }
                        `}
                        onClick={() => handleItemClick(item)}
                      >
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p
                              className={`text-sm line-clamp-2 leading-snug ${
                                item.isRead
                                  ? 'font-semibold text-on-surface'
                                  : 'font-black text-on-surface'
                              }`}
                            >
                              {item.title}
                            </p>
                            {!item.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                            )}
                          </div>

                          {item.body && (
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-1">
                              {item.body}
                            </p>
                          )}

                          <p className="text-[10px] text-on-surface-variant/70 font-mono">
                            {formatRelativeTime(item.createdAt)}
                          </p>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!item.isRead && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkRead(item.id)
                              }}
                              disabled={isPending}
                              className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
                              aria-label="Tandai dibaca"
                              title="Tandai dibaca"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            disabled={isPending}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            aria-label="Hapus"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer — ✅ DINAMIS */}
          {items.length > 0 && (
            <div className="px-4 py-2.5 border-t border-outline-variant/30 bg-surface-container-low/50">
              <Link
                href={notificationsPath}
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-bold text-primary hover:underline underline-offset-4"
              >
                Lihat semua notifikasi
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}