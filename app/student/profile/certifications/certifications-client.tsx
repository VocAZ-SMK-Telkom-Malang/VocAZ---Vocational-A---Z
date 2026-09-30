// app/student/profile/certifications/page.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileCheck,
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  BadgeCheck,
  Clock,
  XCircle,
  ExternalLink,
  Calendar,
} from 'lucide-react'
import { deleteCertificate } from '@/app/actions/certifications'
import { CertificateModal } from '@/components/student/profile/certificate-modal'

type Certificate = {
  id: string
  title: string
  certificateNumber: string | null
  issuedDate: string | null
  expiredDate: string | null
  documentUrl: string | null
  documentKey: string | null
  badgeType: string
  verificationStatus: string
  institutionName: string | null
}

type Verifier = {
  id: string
  name: string
  slug: string
  type: string
  logoUrl: string | null
}

type Props = {
  certificates: Certificate[]
  verifiers: Verifier[]
  studentProfileId: string
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  verified: {
    label: 'Terverifikasi',
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
    icon: <BadgeCheck className="w-3 h-3" />,
  },
  pending: {
    label: 'Menunggu',
    bg: 'bg-amber-50',
    color: 'text-amber-700',
    icon: <Clock className="w-3 h-3" />,
  },
  rejected: {
    label: 'Ditolak',
    bg: 'bg-rose-50',
    color: 'text-rose-700',
    icon: <XCircle className="w-3 h-3" />,
  },
}

export function CertificationsClient({
  certificates,
  verifiers,
  studentProfileId,
}: Props) {
  const [certs, setCerts] = useState(certificates)
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)

  useEffect(() => {
    setCerts(certificates)
  }, [certificates])

  function handleAdd() {
    setEditing(null)
    setModalOpen(true)
  }

  function handleEdit(c: Certificate) {
    setEditing(c)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus sertifikat ini?')) return

    startTransition(async () => {
      const result = await deleteCertificate(id)
      if (result.ok) {
        setCerts((prev) => prev.filter((c) => c.id !== id))
      } else {
        alert(result.error)
      }
    })
  }

  return (
    <>
      <div className="space-y-6">
        <Link
          href="/student/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Profile
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-3">
                <FileCheck className="w-3 h-3" />
                Sertifikasi
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
                Sertifikat Saya
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
                Upload sertifikat dan dapatkan digital badge terverifikasi dari
                lembaga resmi.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 shrink-0 shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Tambah Sertifikat
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Total" value={certs.length} color="text-primary" />
          <StatBox
            label="Verified"
            value={certs.filter((c) => c.verificationStatus === 'verified').length}
            color="text-emerald-700"
          />
          <StatBox
            label="Pending"
            value={certs.filter((c) => c.verificationStatus === 'pending').length}
            color="text-amber-700"
          />
        </div>

        {/* List */}
        {certs.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-on-surface mb-1">
              Belum ada sertifikat
            </h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Upload sertifikat LSP, industri, atau pelatihan
            </p>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Tambah Sertifikat Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert) => {
              const cfg =
                STATUS_CONFIG[cert.verificationStatus] ?? STATUS_CONFIG.pending
              return (
                <div
                  key={cert.id}
                  className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface line-clamp-2">
                        {cert.title}
                      </p>
                      {cert.institutionName && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {cert.institutionName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleEdit(cert)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    {cert.issuedDate && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-on-surface-variant">
                        <Calendar className="w-3 h-3" />
                        {new Date(cert.issuedDate).toLocaleDateString('id-ID', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {cert.certificateNumber && (
                    <p className="text-[10px] text-on-surface-variant font-mono">
                      No: {cert.certificateNumber}
                    </p>
                  )}

                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
                    >
                      Lihat Dokumen
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <CertificateModal
          existing={editing ?? undefined}
          verifiers={verifiers}
          studentProfileId={studentProfileId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
      <p className="text-2xl font-black text-on-surface leading-none">
        {value}
      </p>
      <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${color}`}>
        {label}
      </p>
    </div>
  )
}