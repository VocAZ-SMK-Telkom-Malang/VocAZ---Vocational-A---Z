// components/company/verification/verification-history.tsx
'use client'

import { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import type { VerificationSubmission } from '@/lib/queries/company-verification'

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-100 text-amber-800',
    icon: Clock,
  },
  in_review: {
    label: 'In Review',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle2,
  },
  verified: {
    label: 'Verified',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-rose-100 text-rose-800',
    icon: XCircle,
  },
}

export function VerificationHistory({
  submissions,
}: {
  submissions: VerificationSubmission[]
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (submissions.length === 0) {
    return null
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 lg:p-8">
      <h2 className="text-base font-bold text-on-surface mb-4">
        Riwayat Pengajuan
      </h2>

      <div className="space-y-2">
        {submissions.map((sub) => {
          const config =
            STATUS_CONFIG[sub.status as keyof typeof STATUS_CONFIG] ??
            STATUS_CONFIG.pending
          const Icon = config.icon
          const isExpanded = expandedId === sub.id

          return (
            <div
              key={sub.id}
              className="border border-outline-variant/30 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-on-surface">
                      {sub.submittedAtRelative}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {sub.documents.length} dokumen · Submitted{' '}
                    {new Date(sub.submittedAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-on-surface-variant shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-outline-variant/20 pt-4">
                  {/* Documents */}
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                      Dokumen
                    </div>
                    <div className="space-y-1.5">
                      {sub.documents.length === 0 ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/50 text-xs text-on-surface-variant">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Tidak ada dokumen
                        </div>
                      ) : (
                        sub.documents.map((doc) => (
                          <div
                            key={doc.key}
                            className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low/50"
                          >
                            <FileText className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                            <span className="text-xs text-on-surface flex-1 truncate">
                              {doc.label}
                            </span>
                            {doc.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-primary font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                              >
                                Lihat
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Review Notes */}
                  {sub.reviewNotes && (
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                        Catatan Reviewer
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low/50 text-sm text-on-surface">
                        {sub.reviewNotes}
                      </div>
                    </div>
                  )}

                  {/* Reviewed At */}
                  {sub.reviewedAt && (
                    <div className="text-[11px] text-on-surface-variant font-mono">
                      Direview:{' '}
                      {new Date(sub.reviewedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}