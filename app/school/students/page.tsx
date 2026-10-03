// app/school/students/page.tsx
import { redirect } from 'next/navigation'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import {
    getSchoolStudents,
    getSchoolStudentFilterOptions,
    getSchoolStudentStats,
} from '@/lib/queries/school-students'
import { SchoolStudentsClient } from './students-client'

export const metadata = {
    title: 'Siswa — VocAZ BKK',
}

type SearchParams = Promise<{
    search?: string
    status?: string
    program?: string
    year?: string
    page?: string
}>

export default async function SchoolStudentsPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const ctx = await getSchoolContext()
    if (!ctx) redirect('/auth/sign-in')

    const sp = await searchParams

    const filters = {
        search: sp.search ?? '',
        status: sp.status ?? 'all',
        programId: sp.program ?? undefined,
        year: sp.year ? Number(sp.year) : undefined,
        page: sp.page ? Number(sp.page) : 1,
        pageSize: 20,
    }

    const [data, options, stats] = await Promise.all([
        getSchoolStudents(ctx.schoolId, filters),
        getSchoolStudentFilterOptions(ctx.schoolId),
        getSchoolStudentStats(ctx.schoolId),
    ])

    return (
        <SchoolStudentsClient
            students={data.students}
            pagination={{
                page: data.page,
                totalPages: data.totalPages,
                total: data.total,
            }}
            filters={{
                search: filters.search,
                status: filters.status,
                programId: filters.programId ?? '',
                year: filters.year ? String(filters.year) : '',
            }}
            options={options}
            stats={stats}
        />
    )
}