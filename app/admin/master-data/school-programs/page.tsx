import { getSchoolPrograms } from '@/lib/admin/queries'
import { SchoolProgramsClient } from './school-programs-client'

export default async function SchoolProgramsPage() {
  const programs = await getSchoolPrograms()
  return <SchoolProgramsClient initialPrograms={programs} />
}