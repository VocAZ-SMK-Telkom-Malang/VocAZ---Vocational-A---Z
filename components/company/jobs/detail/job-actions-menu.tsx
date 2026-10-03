// components/company/jobs/detail/job-actions-menu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MoreVertical,
  Edit,
  Eye,
  Power,
  PowerOff,
  Copy,
  Archive,
  Trash2,
  RotateCcw,
  Share2,
} from 'lucide-react'
import {
  publishJobAction,
  closeJobAction,
  reopenJobAction,
  archiveJobAction,
  duplicateJobAction,
  deleteJobAction,
  restoreJobAction,
} from '@/app/company/jobs/[id]/actions'

type JobActionModalProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  variant: 'default' | 'danger' | 'success'
  loading: boolean
  onConfirm: () => Promise<void>
  onClose: () => void
}

function JobActionModal({
  open,
  title,
  description,
  confirmLabel,
  variant,
  loading,
  onConfirm,
  onClose,
}: JobActionModalProps) {
  if (!open) return null

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-error text-on-error hover:bg-error/90'
      : variant === 'success'
        ? 'bg-success text-on-success hover:bg-success/90'
        : 'bg-primary text-on-primary hover:bg-primary/90'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        <p className="mt-2 text-sm text-on-surface-variant">{description}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm()
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${confirmButtonClass} disabled:opacity-60`}
            disabled={loading}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

type Props = {
  jobId: string
  jobSlug: string
  status: string
  isDeleted: boolean
}

type ModalConfig = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  variant: 'default' | 'danger' | 'success'
  onConfirm: () => Promise<void>
}

const INITIAL_MODAL: ModalConfig = {
  open: false,
  title: '',
  description: '',
  confirmLabel: '',
  variant: 'default',
  onConfirm: async () => {},
}

export function JobActionsMenu({ jobId, jobSlug, status, isDeleted }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<ModalConfig>(INITIAL_MODAL)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setLoading(true)
    try {
      const res = await action()
      if (!res.success) {
        alert(res.error ?? 'Terjadi kesalahan')
        setLoading(false)
        return
      }
      setMenuOpen(false)
      setModal(INITIAL_MODAL)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Gagal')
    } finally {
      setLoading(false)
    }
  }

  function openModal(config: Omit<ModalConfig, 'open'>) {
    setModal({ ...config, open: true })
    setMenuOpen(false)
  }

  // ============================================
  // ACTIONS
  // ============================================

  const handlePublish = () =>
    openModal({
      title: 'Publish Lowongan?',
      description:
        'Lowongan akan tayang di halaman publik dan siswa bisa melamar.',
      confirmLabel: 'Publish Sekarang',
      variant: 'success',
      onConfirm: async () => run(() => publishJobAction(jobId)),
    })

  const handleClose = () =>
    openModal({
      title: 'Tutup Lowongan?',
      description:
        'Lowongan tidak akan menerima lamaran baru. Pelamar yang sudah ada tetap diproses.',
      confirmLabel: 'Tutup Lowongan',
      variant: 'default',
      onConfirm: async () => run(() => closeJobAction(jobId)),
    })

  const handleReopen = () =>
    openModal({
      title: 'Buka Lagi Lowongan?',
      description: 'Lowongan akan aktif kembali dan bisa menerima lamaran.',
      confirmLabel: 'Buka Lagi',
      variant: 'success',
      onConfirm: async () => run(() => reopenJobAction(jobId)),
    })

  const handleArchive = () =>
    openModal({
      title: 'Arsipkan Lowongan?',
      description:
        'Lowongan dipindah ke arsip. Tidak akan muncul di daftar aktif.',
      confirmLabel: 'Arsipkan',
      variant: 'default',
      onConfirm: async () => run(() => archiveJobAction(jobId)),
    })

  const handleDuplicate = () =>
    openModal({
      title: 'Duplikat Lowongan?',
      description:
        'Lowongan baru akan dibuat sebagai draft dengan isi yang sama.',
      confirmLabel: 'Duplikat',
      variant: 'default',
      onConfirm: async () => {
        setLoading(true)
        const res = await duplicateJobAction(jobId)
        setLoading(false)
        setModal(INITIAL_MODAL)
        if (res.success && res.newJobId) {
          router.push(`/company/jobs/${res.newJobId}/edit`)
        } else {
          alert(res.error ?? 'Gagal duplikat')
        }
      },
    })

  const handleDelete = () =>
    openModal({
      title: 'Hapus Lowongan?',
      description:
        'Lowongan akan dihapus. Pelamar yang sudah ada tetap aman. Anda bisa restore dalam 30 hari.',
      confirmLabel: 'Hapus Lowongan',
      variant: 'danger',
      onConfirm: async () => run(() => deleteJobAction(jobId)),
    })

  const handleRestore = () =>
    openModal({
      title: 'Restore Lowongan?',
      description: 'Lowongan akan dikembalikan ke daftar aktif.',
      confirmLabel: 'Restore',
      variant: 'success',
      onConfirm: async () => run(() => restoreJobAction(jobId)),
    })

  const handleShare = async () => {
    const url = `${window.location.origin}/lowongan/${jobSlug}`
    await navigator.clipboard.writeText(url)
    alert('Link disalin ke clipboard')
    setMenuOpen(false)
  }

  // ============================================
  // RENDER MENU ITEMS
  // ============================================

  const items: Array<{
    icon: React.ReactNode
    label: string
    onClick: () => void
    danger?: boolean
    hidden?: boolean
  }> = [
    {
      icon: <Edit className="w-4 h-4" />,
      label: 'Edit Lowongan',
      onClick: () => router.push(`/company/jobs/${jobId}/edit`),
      hidden: isDeleted,
    },
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'Preview Public',
      onClick: () => window.open(`/lowongan/${jobSlug}`, '_blank'),
      hidden: isDeleted,
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      label: 'Salin Link',
      onClick: handleShare,
      hidden: isDeleted,
    },
  ]

  // Status actions
  if (!isDeleted) {
    if (status === 'draft') {
      items.push({
        icon: <Power className="w-4 h-4" />,
        label: 'Publish Sekarang',
        onClick: handlePublish,
      })
    } else if (status === 'active') {
      items.push({
        icon: <PowerOff className="w-4 h-4" />,
        label: 'Tutup Lowongan',
        onClick: handleClose,
      })
    } else if (status === 'closed') {
      items.push({
        icon: <Power className="w-4 h-4" />,
        label: 'Buka Lagi',
        onClick: handleReopen,
      })
    }

    if (status !== 'archived') {
      items.push({
        icon: <Archive className="w-4 h-4" />,
        label: 'Arsipkan',
        onClick: handleArchive,
      })
    }
  }

  items.push({
    icon: <Copy className="w-4 h-4" />,
    label: 'Duplikat',
    onClick: handleDuplicate,
  })

  if (!isDeleted) {
    items.push({
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Hapus',
      onClick: handleDelete,
      danger: true,
    })
  } else {
    items.push({
      icon: <RotateCcw className="w-4 h-4" />,
      label: 'Restore',
      onClick: handleRestore,
    })
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          disabled={loading}
          className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/40 hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors disabled:opacity-50"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden z-20">
            {items
              .filter((it) => !it.hidden)
              .map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                    item.danger
                      ? 'text-error hover:bg-error/5'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <JobActionModal
        open={modal.open}
        title={modal.title}
        description={modal.description}
        confirmLabel={modal.confirmLabel}
        variant={modal.variant}
        loading={loading}
        onConfirm={modal.onConfirm}
        onClose={() => setModal(INITIAL_MODAL)}
      />
    </>
  )
}