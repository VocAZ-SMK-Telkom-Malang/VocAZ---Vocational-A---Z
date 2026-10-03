// components/company/team/team-member-card.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MoreVertical,
  Shield,
  UserCheck,
  Eye,
  Trash2,
  Loader2,
  Crown,
} from 'lucide-react'
import {
  changeMemberRoleAction,
  removeTeamMemberAction,
} from '@/app/company/team/actions'
import type { TeamMemberItem } from '@/lib/queries/company-team'

const ROLE_CONFIG = {
  owner: { label: 'Owner', color: 'bg-amber-100 text-amber-800', icon: Crown },
  admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700', icon: Shield },
  recruiter: { label: 'Recruiter', color: 'bg-blue-100 text-blue-700', icon: UserCheck },
  viewer: { label: 'Viewer', color: 'bg-slate-100 text-slate-700', icon: Eye },
}

type Props = {
  member: TeamMemberItem
  currentUserId: string
}

export function TeamMemberCard({ member, currentUserId }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const config = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.viewer
  const Icon = config.icon
  const isSelf = member.userId === currentUserId
  const canManage = !member.isOwner && !isSelf

  async function handleChangeRole(newRole: 'admin' | 'recruiter' | 'viewer') {
    if (!confirm(`Ubah role ${member.fullName} menjadi ${newRole}?`)) return
    setLoading(true)
    try {
      const res = await changeMemberRoleAction({
        memberId: member.id,
        newRole,
      })
      if (!res.ok) {
        alert(res.error ?? 'Gagal ubah role')
        return
      }
      setMenuOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove() {
    if (!confirm(`Hapus ${member.fullName} dari team?`)) return
    setLoading(true)
    try {
      const res = await removeTeamMemberAction(member.id)
      if (!res.ok) {
        alert(res.error ?? 'Gagal hapus')
        return
      }
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 hover:border-primary/30 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatarUrl}
            alt={member.fullName}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0">
            {member.initials}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-on-surface truncate">
              {member.fullName}
            </h4>
            {isSelf && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                KAMU
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant truncate mt-0.5">
            {member.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.color}`}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            <span className="text-[10px] text-on-surface-variant">
              · Join {member.joinedAtRelative}
            </span>
          </div>
        </div>

        {/* Menu */}
        {canManage && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              disabled={loading}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MoreVertical className="w-4 h-4" />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl overflow-hidden z-20">
                <div className="px-3 py-2 border-b border-outline-variant/30">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    Ubah Role
                  </span>
                </div>
                {(['admin', 'recruiter', 'viewer'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleChangeRole(r)}
                    disabled={member.role === r}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                      member.role === r
                        ? 'bg-primary/5 text-primary font-bold cursor-default'
                        : 'text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {r === 'admin' && <Shield className="w-4 h-4" />}
                    {r === 'recruiter' && <UserCheck className="w-4 h-4" />}
                    {r === 'viewer' && <Eye className="w-4 h-4" />}
                    {ROLE_CONFIG[r].label}
                    {member.role === r && ' ✓'}
                  </button>
                ))}
                <div className="border-t border-outline-variant/30" />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 text-left transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus dari Team
                </button>
              </div>
            )}
          </div>
        )}

        {member.isOwner && (
          <div className="shrink-0">
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
        )}
      </div>
    </div>
  )
}