import Link from 'next/link'
import { Landmark, Users } from 'lucide-react'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'

type School = {
  id: string
  name: string
  slug: string
  city: string | null
  province: string | null
  logoUrl: string | null
  _count: { students: number }
}

type Props = {
  schools: School[]
}

export function TopSchools({ schools }: Props) {
  if (schools.length === 0) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Top Schools"
          description="SMK dengan siswa terbanyak"
        />
        <p className="text-sm text-on-surface-variant py-6 text-center">
          Belum ada data.
        </p>
      </AdminCard>
    )
  }

  return (
    <AdminCard>
      <AdminCardHeader
        title="Top Schools"
        description="SMK dengan siswa terbanyak"
        action={
          <Link
            href="/admin/users?role=school"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lihat semua
          </Link>
        }
      />

      <div className="space-y-3">
        {schools.map((school, index) => (
          <Link
            key={school.id}
            href={`/admin/users?search=${school.name}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 font-display font-bold text-xs text-on-surface-variant">
              {index + 1}
            </div>

            <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center shrink-0 overflow-hidden">
              {school.logoUrl ? (
                <img
                  src={school.logoUrl}
                  alt={school.name}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <Landmark className="w-4 h-4 text-[#B45309]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {school.name}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {school.city && school.province
                  ? `${school.city}, ${school.province}`
                  : 'Lokasi belum diisi'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 text-xs text-on-surface-variant">
              <Users className="w-3 h-3" />
              {school._count.students}
            </div>
          </Link>
        ))}
      </div>
    </AdminCard>
  )
}