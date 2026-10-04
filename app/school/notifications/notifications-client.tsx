// app/school/notifications/notifications-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Loader2,
  Trash2,
  ExternalLink,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  clearAllReadAction,
} from './actions'

type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  actionUrl: string | null
  isRead: boolean
  createdAt: string
  createdAtRelative: string
}

type Props = {
  notifications: Notification[]
  pagination: { page: number; totalPages: number; total: number }
  filter: 'all' | 'unread' | 'read'
  unreadCount: number
}

const TYPE_STYLE: Record<string, { color: string; bg: string }> = {
  application: { color: 'text-blue-700', bg: 'bg-blue-100' },
  message: { color: 'text-purple-700', bg: 'bg-purple-100' },
  verification: { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  student: { color: 'text-amber-700', bg: 'bg-amber-100' },
  partner: { color: 'text-pink-700', bg: 'bg-pink-100' },
  career: { color: 'text-cyan-700', bg: 'bg-cyan-100' },
  system: { color: 'text-slate-700', bg: 'bg-slate-100' },
}

export function SchoolNotificationsClient({
  notifications,
  pagination,
  filter,
  unreadCount,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [clearing, setClearing] = useState(false)

  function goToFilter(newFilter: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (newFilter && newFilter !== 'all') params.set('filter', newFilter)
    else params.delete('filter')
    params.delete('page')
    startTransition(() => {
      router.push(`/school/notifications?${params.toString()}`)
    })
  }

  async function handleMarkRead(id: string) {
    setBusyId(id)
    try {
      await markAsReadAction(id)
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function handleMarkAll() {
    setMarkingAll(true)
    try {
      await markAllAsReadAction()
      router.refresh()
    } finally {
      setMarkingAll(false)
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    try {
      await deleteNotificationAction(id)
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function handleClearRead() {
    if (!confirm('Hapus semua notifikasi yang sudah dibaca?')) return
    setClearing(true)
    try {
      await clearAllReadAction()
      router.refresh()
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
            Notifikasi
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={markingAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {markingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              Tandai Semua Dibaca
            </button>
          )}

          {filter === 'read' && notifications.length > 0 && (
            <button
              type="button"
              onClick={handleClearRead}
              disabled={clearing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
            >
              {clearing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 w-fit">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'unread', label: `Belum Dibaca${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
          { id: 'read', label: 'Sudah Dibaca' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => goToFilter(t.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
              ${
                filter === t.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      )}

      {!isPending && notifications.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              busy={busyId === n.id}
              onMarkRead={() => handleMarkRead(n.id)}
              onDelete={() => handleDelete(n.id)}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4">
          <span className="text-xs text-on-surface-variant">
            Halaman {pagination.page} dari {pagination.totalPages} ·{' '}
            {pagination.total} total
          </span>

          <div className="flex items-center gap-2">
            <PaginationBtn
              href={buildPageUrl(searchParams, pagination.page - 1)}
              disabled={pagination.page <= 1}
              icon={ChevronLeft}
            />
            <PaginationBtn
              href={buildPageUrl(searchParams, pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              icon={ChevronRight}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationRow({
  notification,
  busy,
  onMarkRead,
  onDelete,
}: {
  notification: Notification
  busy: boolean
  onMarkRead: () => void
  onDelete: () => void
}) {
  const cfg = TYPE_STYLE[notification.type] ?? TYPE_STYLE.system

  const content = (
    <div className="flex items-start gap-3 p-4">
      <div
        className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}
      >
        <Bell className={`w-5 h-5 ${cfg.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3
            className={`text-sm ${
              notification.isRead
                ? 'font-semibold text-on-surface-variant'
                : 'font-black text-on-surface'
            }`}
          >
            {notification.title}
          </h3>
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>

        {notification.body && (
          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
            {notification.body}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-on-surface-variant font-mono">
            {notification.createdAtRelative}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}
          >
            {notification.type}
          </span>
        </div>
      </div>

      {notification.actionUrl && (
        <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant shrink-0 mt-1" />
      )}
    </div>
  )

  return (
    <div
      className={`
        group relative flex items-center gap-2 rounded-2xl border transition-colors
        ${
          notification.isRead
            ? 'bg-surface-container-lowest border-outline-variant/30'
            : 'bg-primary/[0.02] border-primary/20'
        }
        hover:border-primary/40
      `}
    >
      {notification.actionUrl ? (
        <Link
          href={notification.actionUrl}
          className="flex-1 min-w-0"
          onClick={() => {
            if (!notification.isRead) onMarkRead()
          }}
        >
          {content}
        </Link>
      ) : (
        <div className="flex-1 min-w-0">{content}</div>
      )}

      <div className="flex items-center gap-1 pr-3 shrink-0">
        {!notification.isRead && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onMarkRead()
            }}
            disabled={busy}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
            title="Tandai dibaca"
          >
            {busy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          disabled={busy}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
          title="Hapus"
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  )
}

function EmptyState({ filter }: { filter: string }) {
  const Icon = filter === 'unread' ? BellOff : Inbox
  const title =
    filter === 'unread'
      ? 'Tidak ada notifikasi belum dibaca'
      : filter === 'read'
        ? 'Belum ada notifikasi yang dibaca'
        : 'Belum ada notifikasi'
  const desc =
    filter === 'unread'
      ? 'Semua notifikasi kamu sudah dibaca.'
      : 'Notifikasi akan muncul saat ada aktivitas di BKK sekolah kamu.'

  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
        {desc}
      </p>
    </div>
  )
}

function buildPageUrl(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params.toString())
  if (page <= 1) next.delete('page')
  else next.set('page', String(page))
  return `/school/notifications?${next.toString()}`
}

function PaginationBtn({
  href,
  disabled,
  icon: Icon,
}: {
  href: string
  disabled: boolean
  icon: any
}) {
  if (disabled) {
    return (
      <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant/40 cursor-not-allowed">
        <Icon className="w-4 h-4" />
      </span>
    )
  }

  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
    >
      <Icon className="w-4 h-4" />
    </Link>
  )
}