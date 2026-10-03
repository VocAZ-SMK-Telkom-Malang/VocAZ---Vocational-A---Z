// lib/queries/school-student-detail.ts
import { prisma } from '@/lib/prisma'

export type StudentDetail = {
    // School-student link
    linkId: string
    status: string
    enrollmentYear: number | null
    graduationYear: number | null

    // Profile
    profileId: string
    fullName: string
    email: string
    avatarUrl: string | null
    headline: string | null
    bio: string | null
    nisn: string | null
    city: string | null
    province: string | null
    gender: string | null
    dateOfBirth: string | null
    isOpenToWork: boolean
    isPublic: boolean
    profileCompletion: number
    careerReadiness: number

    // Program
    programName: string | null

    // Stats
    skillsCount: number
    portfolioCount: number
    certificationsCount: number
    experiencesCount: number
    achievementsCount: number

    // Career monitoring (kalau ada)
    careerStage: string | null
    careerNotes: string | null
    placementDate: string | null
    placedAt: string | null
}

export async function getStudentDetailForSchool(
    schoolId: string,
    studentProfileId: string
): Promise<StudentDetail | null> {
    const link = await prisma.schoolStudent.findFirst({
        where: {
            schoolId,
            studentId: studentProfileId,
        },
        include: {
            program: { select: { name: true } },
            student: {
                include: {
                    user: {
                        select: {
                            fullName: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
        },
    })

    if (!link) return null

    const studentId = link.student.id

    // Count relasi
    const [
        skillsCount,
        portfolioCount,
        certificationsCount,
        experiencesCount,
        achievementsCount,
    ] = await Promise.all([
        prisma.studentSkill.count({ where: { studentId } }),
        prisma.studentPortfolio.count({ where: { studentId } }),
        prisma.certificate.count({
            where: { studentId, verificationStatus: 'verified' },
        }),
        prisma.studentExperience.count({ where: { studentId } }),
        prisma.studentAchievement.count({ where: { studentId } }),
    ])

    // Career monitoring — latest
    const career = await prisma.careerMonitoring.findFirst({
        where: { schoolId, studentId },
        orderBy: { updatedAt: 'desc' },
    })

    return {
        linkId: link.id,
        status: link.status,
        enrollmentYear: link.enrollmentYear,
        graduationYear: link.graduationYear,

        profileId: link.student.id,
        fullName: link.student.user.fullName ?? 'Siswa',
        email: link.student.user.email,
        avatarUrl: link.student.user.avatarUrl ?? null,
        headline: link.student.headline ?? null,
        bio: link.student.bio ?? null,
        nisn: link.student.nisn ?? null,
        city: link.student.city ?? null,
        province: link.student.province ?? null,
        gender: link.student.gender ?? null,
        dateOfBirth: link.student.dateOfBirth
            ? link.student.dateOfBirth.toISOString()
            : null,
        isOpenToWork: link.student.isOpenToWork,
        isPublic: link.student.isPublic,
        profileCompletion: link.student.profileCompletion,
        careerReadiness: link.student.careerReadiness,

        programName: link.program?.name ?? null,

        skillsCount,
        portfolioCount,
        certificationsCount,
        experiencesCount,
        achievementsCount,

        careerStage: career?.stage ?? null,
        careerNotes: career?.notes ?? null,
        placementDate: career?.placementDate
            ? career.placementDate.toISOString()
            : null,
        placedAt: career?.companyId ?? null,
    }
}

// ============================================
// Skills (untuk tampilan)
// ============================================

export async function getStudentSkills(studentProfileId: string) {
    return prisma.studentSkill.findMany({
        where: { studentId: studentProfileId },
        include: {
            skill: { select: { id: true, name: true, category: true } },
        },
        take: 20,
    })
}

// ============================================
// Portfolio (untuk tampilan)
// ============================================

export async function getStudentPortfolio(studentProfileId: string) {
    return prisma.studentPortfolio.findMany({
        where: { studentId: studentProfileId, isPublic: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            projectUrl: true,
        },
    })
}

// ============================================
// Certifications
// ============================================

export async function getStudentCertifications(studentProfileId: string) {
  return prisma.certificate.findMany({
    where: { studentId: studentProfileId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      issuedDate: true,
      verificationStatus: true,
      institution: { select: { name: true } },
    },
  })
}