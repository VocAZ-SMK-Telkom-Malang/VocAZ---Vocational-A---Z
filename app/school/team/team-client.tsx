// app/school/team/team-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Crown,
  Shield,
  User as UserIcon,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  X,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react'
import {
  generateInviteTokenAction,
  toggleInviteActiveAction,
  removeMemberAction,
  updateMemberRoleAction,
} from './actions'

type Member = {
  id: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
  fullName: string | null
  email: string
  avatarUrl: string | null
  jobTitle: string | null
  isOwner: boolean
  isCurrentUser: boolean
}

type Props = {
  members: Member[]
  stats: {
    total: number
    owner: number
    admins: number
    members: number
    seatQuota: number
  }
  school: {
    name: string
    inviteToken: string | null
    inviteActive: boolean
  }
  currentUserRole: 'owner' | 'admin' | 'member'
}

const ROLE_CONFIG: Record<
  string,
  { label: string; icon: any; style: string; desc: string }
> = {
  owner: {
    label: 'Owner',
    icon: Crown,
    style: 'bg-amber-100 text-amber-700',
    desc: 'Akses penuh & tidak bisa di-remove',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    style: 'bg-primary/10 text-primary',
    desc: 'Bisa kelola siswa, partner, career',
  },
  member: {
    label: 'Member',
    icon: UserIcon,
    style: 'bg-slate-100 text-slate-700',
    desc: 'Akses read-only',
  },
}

export function SchoolTeamClient({
  members,
  stats,
  school,
  currentUserRole,
}: Props) {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin'
  const isOwner = currentUserRole === 'owner'

  const seatUsed = stats.total
  const seatQuota = stats.seatQuota
  const seatFull = seatUsed >= seatQuota

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
            Tim & Akses
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola anggota yang punya akses ke BKK {school.name}.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatPill
          icon={Users}
          label="Total Anggota"
          value={stats.total}
          color="bg-primary/10 text-primary"
        />
        <StatPill
          icon={Crown}
          label="Owner"
          value={stats.owner}
          color="bg-amber-100 text-amber-700"
        />
        <StatPill
          icon={Shield}
          label="Admin"
          value={stats.admins}
          color="bg-blue-100 text-blue-700"
        />
        <StatPill
          icon={UserIcon}
          label="Member"
          value={stats.members}
          color="bg-slate-100 text-slate-700"
        />
      </div>

      {/* Seat quota */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
          <div>
            <h3 className="text-sm font-bold text-on-surface">
              Kuota Admin Seat
            </h3>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Berdasarkan paket subscription sekolah
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
              seatFull
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {seatUsed} / {seatQuota}
          </span>
        </div>
        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              seatFull
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-primary to-primary-container'
            }`}
            style={{
              width: `${Math.min((seatUsed / seatQuota) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Invite link */}
      {canManage && (
        <InviteLinkCard
          token={school.inviteToken}
          active={school.inviteActive}
          seatFull={seatFull}
        />
      )}

      {/* Members list */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <h2 className="text-base font-black text-on-surface mb-4">
          Anggota Tim
        </h2>

        <div className="space-y-2">
          {members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              canManage={canManage}
              isOwner={isOwner}
              currentUserRole={currentUserRole}
              onManage={() => setSelectedMember(m)}
            />
          ))}
        </div>
      </div>

      {/* Manage modal */}
      {selectedMember && (
        <ManageMemberModal
          member={selectedMember}
          isOwner={isOwner}
          currentUserRole={currentUserRole}
          onClose={() => setSelectedMember(null)}
          onSuccess={() => {
            setSelectedMember(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

// ============================================
// INVITE LINK CARD
// ============================================

function InviteLinkCard({
  token,
  active,
  seatFull,
}: {
  token: string | null
  active: boolean
  seatFull: boolean
}) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inviteUrl =
    typeof window !== 'undefined' && token
      ? `${window.location.origin}/school/join/${token}`
      : ''

  async function handleCopy() {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleGenerate() {
    if (token && !confirm('Regenerate invite link? Link lama tidak akan aktif.')) {
      return
    }
    setGenerating(true)
    setError(null)
    try {
      const res = await generateInviteTokenAction()
      if (!res.ok) {
        setError(res.error ?? 'Gagal generate')
        return
      }
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setGenerating(false)
    }
  }

  async function handleToggle() {
    setToggling(true)
    try {
      const res = await toggleInviteActiveAction(!active)
      if (!res.ok) {
        setError(res.error ?? 'Gagal ubah')
        return
      }
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <LinkIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-black text-on-surface">
              Invite Link Admin BKK
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Share link ini ke calon admin BKK.
            </p>
          </div>
        </div>

        {token && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggle}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-700'
              } disabled:opacity-50`}
            >
              {toggling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : active ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              {active ? 'Aktif' : 'Nonaktif'}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || seatFull}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-outline-variant/40 text-xs font-bold text-on-surface hover:border-primary/40 disabled:opacity-50 transition-colors"
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              {token ? 'Regenerate' : 'Generate'}
            </button>
          </div>
        )}
      </div>

      {seatFull ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
          ⚠️ Kuota admin seat penuh. Upgrade paket atau hapus member lama untuk
          invite admin baru.
        </div>
      ) : !token ? (
        <div className="p-4 rounded-xl bg-white border border-primary/20 text-sm text-on-surface-variant">
          Belum ada invite link. Klik <strong>Generate</strong> untuk membuat.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 p-4 rounded-xl bg-white border border-primary/20">
            <code className="flex-1 font-mono text-xs text-on-surface break-all">
              {showToken ? inviteUrl : `${inviteUrl.slice(0, 30)}••••••`}
            </code>

            <button
              type="button"
              onClick={() => setShowToken((v) => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            >
              {showToken ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-on-surface-variant mt-3">
            💡 Siapa aja yang klik link ini + login akan otomatis jadi{' '}
            <strong>Admin</strong> di BKK sekolah kamu.
          </p>
        </>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
        </div>
      )}
    </div>
  )
}

// ============================================
// MEMBER ROW
// ============================================

function MemberRow({
  member,
  canManage,
  isOwner,
  currentUserRole,
  onManage,
}: {
  member: Member
  canManage: boolean
  isOwner: boolean
  currentUserRole: string
  onManage: () => void
}) {
  const cfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.member
  const Icon = cfg.icon

  const initials = (member.fullName ?? member.email)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const canRemoveThis =
    canManage &&
    !member.isOwner &&
    !member.isCurrentUser &&
    (isOwner || member.role === 'member')

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.fullName ?? member.email}
          className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-black">{initials}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-on-surface truncate">
            {member.fullName ?? member.email}
          </span>
          {member.isCurrentUser && (
            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-[9px] font-bold uppercase tracking-wider">
              Kamu
            </span>
          )}
        </div>
        <p className="text-[11px] text-on-surface-variant truncate">
          {member.email}
        </p>
        {member.jobTitle && (
          <p className="text-[10px] text-on-surface-variant/70 truncate">
            {member.jobTitle}
          </p>
        )}
      </div>

      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ${cfg.style}`}
      >
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>

      {canRemoveThis && (
        <button
          type="button"
          onClick={onManage}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// MANAGE MEMBER MODAL
// ============================================

function ManageMemberModal({
  member,
  isOwner,
  currentUserRole,
  onClose,
  onSuccess,
}: {
  member: Member
  isOwner: boolean
  currentUserRole: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [role, setRole] = useState<'admin' | 'member'>(
    member.role === 'owner' ? 'admin' : (member.role as 'admin' | 'member')
  )
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initials = (member.fullName ?? member.email)
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const canChangeRole = isOwner
  const canRemove =
    !member.isOwner &&
    !member.isCurrentUser &&
    (isOwner || member.role === 'member')

  async function handleSaveRole() {
    if (!canChangeRole) return
    setSaving(true)
    setError(null)
    try {
      const res = await updateMemberRoleAction({
        memberId: member.id,
        role,
      })
      if (!res.ok) {
        setError(res.error ?? 'Gagal menyimpan')
        return
      }
      onSuccess()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    if (!confirm(`Hapus ${member.fullName ?? member.email} dari tim?`)) return
    setRemoving(true)
    setError(null)
    try {
      const res = await removeMemberAction(member.id)
      if (!res.ok) {
        setError(res.error ?? 'Gagal hapus')
        return
      }
      onSuccess()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <h2 className="text-base font-black text-on-surface">
            Kelola Anggota
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Member info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.fullName ?? member.email}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="text-sm font-black">{initials}</span>
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-on-surface truncate">
                {member.fullName ?? member.email}
              </div>
              <div className="text-[11px] text-on-surface-variant truncate">
                {member.email}
              </div>
            </div>
          </div>

          {/* Role selector (owner only) */}
          {canChangeRole && !member.isOwner && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['admin', 'member'] as const).map((r) => {
                  const cfg = ROLE_CONFIG[r]
                  const Icon = cfg.icon
                  const isActive = role === r
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`
                        p-3 rounded-xl border-2 text-left transition-all
                        ${
                          isActive
                            ? 'border-primary bg-primary/5'
                            : 'border-outline-variant/40 hover:border-primary/30'
                        }
                      `}
                    >
                      <Icon
                        className={`w-4 h-4 mb-1 ${
                          isActive ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                      />
                      <div
                        className={`text-sm font-bold ${
                          isActive ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {cfg.label}
                      </div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">
                        {cfg.desc}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {member.isOwner && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Owner tidak bisa diubah role atau di-remove dari tim.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-2">
            {canRemove ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
              >
                {removing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Hapus
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Tutup
              </button>
              {canChangeRole && !member.isOwner && (
                <button
                  type="button"
                  onClick={handleSaveRole}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SHARED
// ============================================

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3.5 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-on-surface leading-none">
          {value}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1 truncate">
          {label}
        </div>
      </div>
    </div>
  )
}