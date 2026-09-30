// lib/queries/skills.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// MASTER SKILLS (buat dropdown)
// ============================================

export async function getAllSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })
}

// ============================================
// STUDENT SKILLS
// ============================================

export async function getStudentSkills() {
  const session = await getServerSession()
  if (!session?.user?.id) return []

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) return []

  const skills = await prisma.studentSkill.findMany({
    where: { studentId: user.studentProfile.id },
    include: { skill: true },
    orderBy: [{ skill: { category: 'asc' } }, { skill: { name: 'asc' } }],
  })

  return skills.map((s) => ({
    id: s.id,
    skillId: s.skill.id,
    name: s.skill.name,
    category: s.skill.category,
    proficiency: s.proficiency,
  }))
}

export type StudentSkillItem = Awaited<ReturnType<typeof getStudentSkills>>[number]