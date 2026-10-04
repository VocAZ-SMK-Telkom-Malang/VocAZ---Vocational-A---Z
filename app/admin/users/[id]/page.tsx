import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  GraduationCap,
  Building2,
  School,
  Award,
  Shield,
  Power,
  Ban,
} from 'lucide-react'
import { getUserById } from '@/lib/admin/queries'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'
import { AdminBadge } from '@/components/admin/ui/admin-badge'
import { UserDetailActions } from '@/components/admin/users/user-detail-actions'

type Params = Promise<{ id: string }>

export default async function UserDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params
  const user = await getUserById(id)

  if (!user) notFound()

  const roleIcons: Record<string, any> = {
    student: GraduationCap,
    company: Building2,
    school: School,
    certification: Award,
    admin: Shield,
  }
  const RoleIcon = roleIcons[user.role] || Shield

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke User Management
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {(user.fullName || 'A')[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-on-surface truncate">
              {user.fullName || 'Anonim'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
              <AdminBadge
                variant={
                  user.role === 'student'
                    ? 'student'
                    : user.role === 'company'
                    ? 'company'
                    : user.role === 'school'
                    ? 'school'
                    : user.role === 'certification'
                    ? 'certification'
                    : 'admin'
                }
              >
                {user.role}
              </AdminBadge>
              <AdminBadge variant={user.isActive ? 'active' : 'suspended'}>
                {user.isActive ? 'Aktif' : 'Suspended'}
              </AdminBadge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <AdminCardHeader title="Informasi" />
            <dl className="space-y-3">
              <InfoRow label="ID" value={user.id} mono />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Nama Lengkap" value={user.fullName || '-'} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow
                label="Status"
                value={user.isActive ? 'Aktif' : 'Suspended'}
              />
              <InfoRow
                label="Terdaftar"
                value={new Date(user.createdAt).toLocaleString('id-ID')}
              />
              <InfoRow
                label="Login Terakhir"
                value={
                  user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString('id-ID')
                    : 'Belum pernah'
                }
              />
              <InfoRow
                label="Dihapus"
                value={user.deletedAt ? new Date(user.deletedAt).toLocaleString('id-ID') : '-'}
              />
            </dl>
          </AdminCard>

          {/* Role-specific info */}
          {user.studentProfile && (
            <AdminCard>
              <AdminCardHeader
                title="Profil Student"
                description="Informasi profil talenta"
              />
              <dl className="space-y-3">
                <InfoRow
                  label="Headline"
                  value={user.studentProfile.headline || '-'}
                />
                <InfoRow label="NISN" value={user.studentProfile.nisn || '-'} />
                <InfoRow
                  label="Kota"
                  value={user.studentProfile.city || '-'}
                />
                <InfoRow
                  label="Provinsi"
                  value={user.studentProfile.province || '-'}
                />
                <InfoRow
                  label="Open to Work"
                  value={user.studentProfile.isOpenToWork ? 'Ya' : 'Tidak'}
                />
                <InfoRow
                  label="Profile Completion"
                  value={`${user.studentProfile.profileCompletion}%`}
                />
              </dl>

              {user.studentProfile.skills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline-variant/30">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                    Skills ({user.studentProfile.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.studentProfile.skills.map((s: { id: string; skill: { name: string } }) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-semibold"
                      >
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </AdminCard>
          )}

          {user.ownedCompany && (
            <AdminCard>
              <AdminCardHeader title="Profil Perusahaan" />
              <dl className="space-y-3">
                <InfoRow label="Nama" value={user.ownedCompany.name} />
                <InfoRow label="Industri" value={user.ownedCompany.industry || '-'} />
                <InfoRow label="Kota" value={user.ownedCompany.city || '-'} />
                <InfoRow
                  label="Status Verifikasi"
                  value={user.ownedCompany.verificationStatus}
                />
              </dl>
            </AdminCard>
          )}

          {user.ownedSchool && (
            <AdminCard>
              <AdminCardHeader title="Profil Sekolah" />
              <dl className="space-y-3">
                <InfoRow label="Nama" value={user.ownedSchool.name} />
                <InfoRow label="NPSN" value={user.ownedSchool.npsn || '-'} />
                <InfoRow label="Kota" value={user.ownedSchool.city || '-'} />
              </dl>
            </AdminCard>
          )}

          {user.ownedInstitution && (
            <AdminCard>
              <AdminCardHeader title="Profil Lembaga Sertifikasi" />
              <dl className="space-y-3">
                <InfoRow label="Nama" value={user.ownedInstitution.name} />
                <InfoRow label="Tipe" value={user.ownedInstitution.type} />
                <InfoRow
                  label="Status Verifikasi"
                  value={user.ownedInstitution.isApproved ? 'Disetujui' : 'Menunggu'}
                />
              </dl>
            </AdminCard>
          )}
        </div>

        {/* Actions sidebar */}
        <div>
          <UserDetailActions
            userId={user.id}
            isActive={user.isActive}
            isDeleted={!!user.deletedAt}
          />
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider shrink-0">
        {label}
      </dt>
      <dd
        className={`text-sm text-on-surface text-right ${
          mono ? 'font-mono text-xs' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}