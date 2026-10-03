// lib/queries/company-applicant-detail.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type ApplicantDetail = {
  application: {
    id: string
    status: string
    coverLetter: string | null
    resumeUrl: string | null
    resumeKey: string | null
    matchScore: number | null
    matchScoreBreakdown: any
    appliedAt: string
    updatedAt: string
    nextStep: string | null
    interviewDate: string | null
    recruiterName: string | null
    notes: string | null
  }
  job: {
    id: string
    title: string
    slug: string
    employmentType: string
    workMode: string
    location: string | null
    city: string | null
    province: string | null
  }
  student: {
    id: string
    userId: string
    fullName: string
    avatarUrl: string | null
    headline: string | null
    bio: string | null
    city: string | null
    province: string | null
    phone: string | null
    email: string
    isOpenToWork: boolean
    followerCount: number
    followingCount: number
    coverImageUrl: string | null
    school: {
      id: string
      name: string
      slug: string
      city: string | null
      province: string | null
    } | null
    educations: Array<{
      id: string
      schoolName: string
      major: string | null
      degree: string | null
      startYear: number | null
      endYear: number | null
      gpa: number | null
      description: string | null
    }>
    experiences: Array<{
      id: string
      title: string
      companyName: string | null
      employmentType: string | null
      location: string | null
      startDate: string | null
      endDate: string | null
      isCurrent: boolean
      description: string | null
    }>
    skills: Array<{
      id: string
      name: string
      category: string | null
      proficiency: string
    }>
    achievements: Array<{
      id: string
      title: string
      issuer: string | null
      level: string | null
      dateAchieved: string | null
      description: string | null
      certificateUrl: string | null
    }>
    portfolios: Array<{
      id: string
      title: string
      description: string | null
      projectUrl: string | null
      thumbnailUrl: string | null
      startDate: string | null
      endDate: string | null
      media: Array<{ id: string; url: string; type: string }>
    }>
    certificates: Array<{
      id: string
      title: string
      certificateNumber: string | null
      issuedDate: string | null
      expiredDate: string | null
      documentUrl: string | null
      badgeType: string
      verificationStatus: string
      institutionName: string | null
    }>
    showcaseVideos: Array<{
      id: string
      title: string
      thumbnailUrl: string | null
      videoUrl: string
      videoSource: string
      viewCount: number
      likeCount: number
      publishedAt: string | null
    }>
  }
  timeline: Array<{
    id: string
    status: string
    notes: string | null
    createdAt: string
  }>


    aiInterview: {
    id: string
    status: string
    invitedAt: string
    completedAt: string | null
    expiresAt: string | null
    answers: Array<{
      id: string
      questionIndex: number
      question: string
      answer: string | null
      answeredAt: string | null
    }>
  } | null
}




// ============================================
// GET APPLICANT DETAIL
// ============================================

export async function getApplicantDetail(
  applicationId: string,
  companyId: string
): Promise<ApplicantDetail | null> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          slug: true,
          employmentType: true,
          workMode: true,
          location: true,
          city: true,
          province: true,
          companyId: true,
        },
      },
      student: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
          school: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              province: true,
            },
          },
          educations: { orderBy: { startYear: 'desc' } },
          experiences: { orderBy: { startDate: 'desc' } },
          skills: {
            include: { skill: true },
            orderBy: [{ skill: { category: 'asc' } }, { skill: { name: 'asc' } }],
          },
          achievements: { orderBy: { dateAchieved: 'desc' } },
          portfolios: {
            include: { media: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { startDate: 'desc' },
          },
          certificates: {
            include: { institution: true },
            orderBy: { issuedDate: 'desc' },
          },
          showcaseVideos: {
            where: { status: 'published' },
            orderBy: { publishedAt: 'desc' },
            take: 12,
          },
        },
      },
      history: {
        orderBy: { createdAt: 'desc' },
      },
      aiInterview: {
        include: {
          answers: {
            orderBy: { questionIndex: 'asc' },
          },
        },
      },
    },
  })

  if (!app) return null
  if (app.job.companyId !== companyId) return null

  return {
    application: {
      id: app.id,
      status: app.status,
      coverLetter: app.coverLetter,
      resumeUrl: app.resumeUrl,
      resumeKey: app.resumeKey,
      matchScore: app.matchScore,
      matchScoreBreakdown: null,
      appliedAt: app.appliedAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      nextStep: app.nextStep,
      interviewDate: app.interviewDate?.toISOString() ?? null,
      recruiterName: app.recruiterName,
      notes: app.notes,
    },
    job: {
      id: app.job.id,
      title: app.job.title,
      slug: app.job.slug,
      employmentType: app.job.employmentType,
      workMode: app.job.workMode,
      location: app.job.location,
      city: app.job.city,
      province: app.job.province,
    },
    student: {
      id: app.student.id,
      userId: app.student.user.id,
      fullName: app.student.user.fullName ?? 'Siswa',
      avatarUrl: app.student.user.avatarUrl,
      headline: app.student.headline,
      bio: app.student.bio,
      city: app.student.city,
      province: app.student.province,
      phone: app.student.user.phone,
      email: app.student.user.email,
      isOpenToWork: app.student.isOpenToWork,
      followerCount: app.student.followerCount,
      followingCount: app.student.followingCount,
      coverImageUrl: app.student.coverImageUrl,
      school: app.student.school
        ? {
            id: app.student.school.id,
            name: app.student.school.name,
            slug: app.student.school.slug,
            city: app.student.school.city,
            province: app.student.school.province,
          }
        : null,
      educations: app.student.educations.map((e) => ({
        id: e.id,
        schoolName: e.schoolName,
        major: e.major,
        degree: e.degree,
        startYear: e.startYear,
        endYear: e.endYear,
        gpa: e.gpa ? Number(e.gpa) : null,
        description: e.description,
      })),
      experiences: app.student.experiences.map((e) => ({
        id: e.id,
        title: e.title,
        companyName: e.companyName,
        employmentType: e.employmentType,
        location: e.location,
        startDate: e.startDate?.toISOString() ?? null,
        endDate: e.endDate?.toISOString() ?? null,
        isCurrent: e.isCurrent,
        description: e.description,
      })),
      skills: app.student.skills.map((s) => ({
        id: s.id,
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
      })),
      achievements: app.student.achievements.map((a) => ({
        id: a.id,
        title: a.title,
        issuer: a.issuer,
        level: a.level,
        dateAchieved: a.dateAchieved?.toISOString() ?? null,
        description: a.description,
        certificateUrl: a.certificateUrl,
      })),
      portfolios: app.student.portfolios.map((po) => ({
        id: po.id,
        title: po.title,
        description: po.description,
        projectUrl: po.projectUrl,
        thumbnailUrl: po.thumbnailUrl,
        startDate: po.startDate?.toISOString() ?? null,
        endDate: po.endDate?.toISOString() ?? null,
        media: po.media.map((m) => ({
          id: m.id,
          url: m.url,
          type: m.mediaType,
        })),
      })),
      certificates: app.student.certificates.map((c) => ({
        id: c.id,
        title: c.title,
        certificateNumber: c.certificateNumber,
        issuedDate: c.issuedDate?.toISOString() ?? null,
        expiredDate: c.expiredDate?.toISOString() ?? null,
        documentUrl: c.documentUrl,
        badgeType: c.badgeType,
        verificationStatus: c.verificationStatus,
        institutionName: c.institution?.name ?? null,
      })),
      showcaseVideos: app.student.showcaseVideos.map((v) => ({
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        videoUrl: v.videoUrl,
        videoSource: v.videoSource,
        viewCount: Number(v.viewCount),
        likeCount: v.likeCount,
        publishedAt: v.publishedAt?.toISOString() ?? null,
      })),
    },
    timeline: app.history.map((h) => ({
      id: h.id,
      status: h.status,
      notes: h.notes,
      createdAt: h.createdAt.toISOString(),
    })),
    aiInterview: app.aiInterview
      ? {
          id: app.aiInterview.id,
          status: app.aiInterview.status,
          invitedAt: app.aiInterview.invitedAt.toISOString(),
          completedAt: app.aiInterview.completedAt?.toISOString() ?? null,
          expiresAt: app.aiInterview.expiresAt?.toISOString() ?? null,
          answers: app.aiInterview.answers.map((a) => ({
            id: a.id,
            questionIndex: a.questionIndex,
            question: a.question,
            answer: a.answer,
            answeredAt: a.answeredAt?.toISOString() ?? null,
          })),
        }
      : null,
  }
}