// lib/queries/company-team.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type TeamMemberItem = {
  id: string
  userId: string
  fullName: string
  email: string
  avatarUrl: string | null
  initials: string
  role: 'owner' | 'admin' | 'recruiter' | 'viewer'
  isOwner: boolean
  joinedAt: string
  joinedAtRelative: string
}

export type PendingInvitationItem = {
  id: string
  email: string
  role: 'owner' | 'admin' | 'recruiter' | 'viewer'
  status: string
  token: string                       // ✅ TAMBAH
  invitedBy: string
  invitedAt: string
  invitedAtRelative: string
  expiresAt: string
  expired: boolean
}

export type TeamStats = {
  totalMembers: number
  pendingInvites: number
  admins: number
  recruiters: number
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string | null): string {
  if (!name) return '??'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================
// GET TEAM MEMBERS
// ============================================

export async function getCompanyTeam(companyId: string) {
  const members = await prisma.companyMember.findMany({
    where: { companyId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
  })

  const owner = await prisma.company.findUnique({
    where: { id: companyId },
    select: { ownerUserId: true },
  })

  const mapped: TeamMemberItem[] = members.map((m) => ({
    id: m.id,
    userId: m.userId,
    fullName: m.user.fullName ?? 'User',
    email: m.user.email,
    avatarUrl: m.user.avatarUrl,
    initials: getInitials(m.user.fullName),
    role: m.role as any,
    isOwner: m.userId === owner?.ownerUserId,
    joinedAt: m.createdAt.toISOString(),
    joinedAtRelative: relativeTime(m.createdAt),
  }))

  // Owner duluan
  mapped.sort((a, b) => {
    if (a.isOwner) return -1
    if (b.isOwner) return 1
    return 0
  })

  return mapped
}

// ============================================
// GET PENDING INVITATIONS
// ============================================

export async function getPendingInvitations(
  companyId: string
): Promise<PendingInvitationItem[]> {
  const invites = await prisma.companyInvitation.findMany({
    where: {
      companyId,
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
  })

  return invites.map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role as any,
    status: i.status,
    token: i.token,                    // ✅ TAMBAH
    invitedBy: i.invitedBy,
    invitedAt: i.createdAt.toISOString(),
    invitedAtRelative: relativeTime(i.createdAt),
    expiresAt: i.expiresAt.toISOString(),
    expired: i.expiresAt.getTime() < Date.now(),
  }))
}

// ============================================
// GET TEAM STATS
// ============================================

export async function getTeamStats(companyId: string): Promise<TeamStats> {
  const [totalMembers, pendingInvites, admins, recruiters] =
    await Promise.all([
      prisma.companyMember.count({ where: { companyId } }),
      prisma.companyInvitation.count({
        where: { companyId, status: 'pending' },
      }),
      prisma.companyMember.count({
        where: { companyId, role: { in: ['owner', 'admin'] } },
      }),
      prisma.companyMember.count({ where: { companyId, role: 'recruiter' } }),
    ])

  return { totalMembers, pendingInvites, admins, recruiters }
}   