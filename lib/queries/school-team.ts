// lib/queries/school-team.ts
import { prisma } from '@/lib/prisma'

export type TeamMemberItem = {
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

export type TeamStats = {
  total: number
  owner: number
  admins: number
  members: number
  seatQuota: number
}

export async function getSchoolTeam(
  schoolId: string,
  currentUserId: string
): Promise<TeamMemberItem[]> {
  const [owner, members] = await Promise.all([
    prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        ownerUserId: true,
        owner: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            jobTitle: true,
          },
        },
      },
    }),
    prisma.schoolMember.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            jobTitle: true,
          },
        },
      },
    }),
  ])

  const items: TeamMemberItem[] = []

  // Owner duluan
  if (owner?.owner) {
    items.push({
      id: `owner-${owner.owner.id}`,
      userId: owner.owner.id,
      role: 'owner',
      joinedAt: '',
      fullName: owner.owner.fullName,
      email: owner.owner.email,
      avatarUrl: owner.owner.avatarUrl,
      jobTitle: owner.owner.jobTitle,
      isOwner: true,
      isCurrentUser: owner.owner.id === currentUserId,
    })
  }

  // Member (skip owner kalau duplikat)
  members.forEach((m) => {
    if (m.userId === owner?.ownerUserId) return // skip duplicate owner

    items.push({
      id: m.id,
      userId: m.user.id,
      role: m.role as 'owner' | 'admin' | 'member',
      joinedAt: m.createdAt.toISOString(),
      fullName: m.user.fullName,
      email: m.user.email,
      avatarUrl: m.user.avatarUrl,
      jobTitle: m.user.jobTitle,
      isOwner: false,
      isCurrentUser: m.user.id === currentUserId,
    })
  })

  return items
}

export async function getSchoolTeamStats(
  schoolId: string
): Promise<TeamStats> {
  const [school, admins, members] = await Promise.all([
    prisma.school.findUnique({
      where: { id: schoolId },
      select: { adminSeatQuota: true },
    }),
    prisma.schoolMember.count({
      where: { schoolId, role: 'admin' },
    }),
    prisma.schoolMember.count({
      where: { schoolId, role: 'member' },
    }),
  ])

  return {
    total: admins + members + 1, // +1 owner
    owner: 1,
    admins,
    members,
    seatQuota: school?.adminSeatQuota ?? 1,
  }
}