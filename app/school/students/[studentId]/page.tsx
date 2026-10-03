// app/school/students/[studentId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import {
  getStudentDetailForSchool,
  getStudentSkills,
  getStudentPortfolio,
  getStudentCertifications,
} from '@/lib/queries/school-student-detail'
import { SchoolStudentDetailClient } from './student-detail-client'

type Props = {
  params: Promise<{ studentId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { studentId } = await params
  const ctx = await getSchoolContext()
  if (!ctx) return { title: 'Siswa — VocAZ BKK' }

  const detail = await getStudentDetailForSchool(ctx.schoolId, studentId)
  return {
    title: detail ? `${detail.fullName} — VocAZ BKK` : 'Siswa — VocAZ BKK',
  }
}

export default async function SchoolStudentDetailPage({ params }: Props) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const { studentId } = await params

  const detail = await getStudentDetailForSchool(ctx.schoolId, studentId)
  if (!detail) notFound()

  const [skills, portfolio, certifications] = await Promise.all([
    getStudentSkills(detail.profileId),
    getStudentPortfolio(detail.profileId),
    getStudentCertifications(detail.profileId),
  ])

  return (
    <SchoolStudentDetailClient
      student={detail}
      skills={skills.map((s) => ({
        id: s.id,
        name: s.skill.name,
        category: s.skill.category,
        proficiency: s.proficiency,
      }))}
      portfolio={portfolio}
      certifications={certifications.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.institution?.name ?? null,
        issueDate: c.issuedDate ? c.issuedDate.toISOString() : null,
        verificationStatus: c.verificationStatus,
      }))}
    />
  )
}