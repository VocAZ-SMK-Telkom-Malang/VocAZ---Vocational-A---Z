// app/school/profile/page.tsx
import { redirect } from 'next/navigation'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { getSchoolProfile } from '@/lib/queries/school-profile'
import { ensureSchoolToken } from '@/lib/school/token'
import { SchoolProfileClient } from './profile-client'

export const metadata = {
  title: 'Profil Sekolah — VocAZ BKK',
}

export default async function SchoolProfilePage() {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  let profile = await getSchoolProfile(ctx.schoolId)
  if (!profile) redirect('/auth/sign-in')

  // Kalau token belum ada, generate sekarang
  if (!profile.enrollmentToken) {
    const newToken = await ensureSchoolToken(ctx.schoolId)
    if (newToken) {
      profile = { ...profile, enrollmentToken: newToken }
    }
  }

  return <SchoolProfileClient profile={profile} userRole={ctx.role} />
}