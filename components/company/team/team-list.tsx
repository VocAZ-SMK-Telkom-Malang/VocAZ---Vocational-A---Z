// components/company/team/team-list.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Mail,
  X,
  RotateCw,
  Loader2,
  Clock,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react'
import { TeamMemberCard } from './team-member-card'
import {
  cancelInvitationAction,
  resendInvitationAction,
} from '@/app/company/team/actions'
import type {
  TeamMemberItem,
  PendingInvitationItem,
} from '@/lib/queries/company-team'

const ROLE_LABEL: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  recruiter: 'Recruiter',
  viewer: 'Viewer',
}

type Props = {
  members: TeamMemberItem[]
  invitations: PendingInvitationItem[]
  currentUserId: string
}

export function TeamList({ members, invitations, currentUserId }: Props) {
  return (
    <div className="space-y-6">
      {/* Members */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-on-surface">
            Anggota Aktif
          </h2>
          <span className="font-mono text-[11px] text-on-surface-variant">
            · {members.length}
          </span>
        </div>

        {members.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Belum ada anggota team
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {members.map((m) => (
              <TeamMemberCard
                key={m.id}
                member={m}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-on-surface">
              Undangan Pending
            </h2>
            <span className="font-mono text-[11px] text-on-surface-variant">
              · {invitations.length}
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 divide-y divide-outline-variant/20 overflow-hidden">
            {invitations.map((inv) => (
              <InvitationRow key={inv.id} invitation={inv} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// INVITATION ROW
// ============================================

function InvitationRow({ invitation }: { invitation: PendingInvitationItem }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCopyLink() {
    const url = `${window.location.origin}/company/join/${invitation.token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
      alert('Gagal copy link')
    }
  }

  async function handleCancel() {
    if (!confirm(`Batalkan undangan untuk ${invitation.email}?`)) return
    setLoading('cancel')
    try {
      const res = await cancelInvitationAction(invitation.id)
      if (!res.ok) {
        alert(res.error ?? 'Gagal')
        return
      }
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  async function handleResend() {
    setLoading('resend')
    try {
      const res = await resendInvitationAction(invitation.id)
      if (!res.ok) {
        alert(res.error ?? 'Gagal')
        return
      }
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
        <Mail className="w-5 h-5 text-amber-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-on-surface truncate">
            {invitation.email}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            {ROLE_LABEL[invitation.role]}
          </span>
          {invitation.expired && (
            <span className="px-2 py-0.5 rounded-md bg-error/10 text-error text-[10px] font-bold uppercase tracking-wider">
              Expired
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-on-surface-variant">
          <Clock className="w-3 h-3" />
          Diundang {invitation.invitedAtRelative}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={!!loading}
          className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors ${
            copied
              ? 'bg-emerald-50 text-emerald-600'
              : 'hover:bg-surface-container text-on-surface-variant'
          }`}
          title={copied ? 'Link disalin!' : 'Copy link undangan'}
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
        </button>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResend}
          disabled={!!loading}
          className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50 transition-colors"
          title="Kirim ulang email"
        >
          {loading === 'resend' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCw className="w-4 h-4" />
          )}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          disabled={!!loading}
          className="w-8 h-8 rounded-lg hover:bg-error/10 flex items-center justify-center text-on-surface-variant hover:text-error disabled:opacity-50 transition-colors"
          title="Batalkan undangan"
        >
          {loading === 'cancel' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}