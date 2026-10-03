// app/company/team/team-client.tsx
'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { TeamHeader } from '@/components/company/team/team-header'
import { TeamList } from '@/components/company/team/team-list'
import { InviteMemberModal } from '@/components/company/team/invite-member-modal'
import type {
  TeamMemberItem,
  PendingInvitationItem,
  TeamStats,
} from '@/lib/queries/company-team'

type Props = {
  members: TeamMemberItem[]
  invitations: PendingInvitationItem[]
  stats: TeamStats
  currentUserId: string
  canManage: boolean
}

export function CompanyTeamClient({
  members,
  invitations,
  stats,
  currentUserId,
  canManage,
}: Props) {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      <TeamHeader stats={stats} />

      {canManage && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Undang Anggota Baru
          </button>
        </div>
      )}

      <TeamList
        members={members}
        invitations={invitations}
        currentUserId={currentUserId}
      />

      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  )
}