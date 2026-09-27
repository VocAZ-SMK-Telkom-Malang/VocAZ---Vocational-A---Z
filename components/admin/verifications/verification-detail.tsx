import {
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Users,
  FileText,
  Briefcase,
  User as UserIcon,
} from 'lucide-react'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'

type Verification = {
  id: string
  status: string
  submittedAt: Date
  reviewedAt: Date | null
  reviewNotes: string | null
  supportingDocs: any
  company: {
    id: string
    name: string
    slug: string
    industry: string | null
    companySize: string | null
    foundedYear: number | null
    website: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    province: string | null
    country: string | null
    description: string | null
    logoUrl: string | null
    verificationStatus: string
    createdAt: Date
    owner: {
      id: string
      fullName: string | null
      email: string
      phone: string | null
    } | null
    _count: {
      jobs: number
    }
  }
}

type Props = {
  verification: Verification
}

export function VerificationDetail({ verification }: Props) {
  const c = verification.company

  const companySizeLabels: Record<string, string> = {
    s1_10: '1-10 karyawan',
    s11_50: '11-50 karyawan',
    s51_200: '51-200 karyawan',
    s201_500: '201-500 karyawan',
    s500plus: '500+ karyawan',
  }

  return (
    <div className="space-y-6">
      {/* ============ COMPANY HEADER ============ */}
      <AdminCard>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center shrink-0 overflow-hidden">
            {c.logoUrl ? (
              <img
                src={c.logoUrl}
                alt={c.name}
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-on-surface mb-1">
              {c.name}
            </h2>
            <p className="text-sm text-tertiary font-semibold mb-3">
              {c.industry || 'Industri belum diisi'}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
              {c.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {c.city}
                  {c.province && `, ${c.province}`}
                </span>
              )}
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {c.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {c.email && (
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {c.email}
                </a>
              )}
              {c.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {c.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* ============ COMPANY DETAILS ============ */}
      <AdminCard>
        <AdminCardHeader title="Informasi Perusahaan" />

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <InfoRow
            icon={Users}
            label="Ukuran Perusahaan"
            value={
              c.companySize
                ? companySizeLabels[c.companySize] || c.companySize
                : 'Belum diisi'
            }
          />
          <InfoRow
            icon={Calendar}
            label="Tahun Didirikan"
            value={c.foundedYear ? String(c.foundedYear) : 'Belum diisi'}
          />
          <InfoRow
            icon={MapPin}
            label="Alamat"
            value={c.address || 'Belum diisi'}
            fullWidth
          />
          <InfoRow
            icon={Briefcase}
            label="Lowongan Aktif"
            value={`${c._count.jobs} lowongan`}
          />
          <InfoRow
            icon={Calendar}
            label="Terdaftar pada"
            value={new Date(c.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </dl>

        {c.description && (
          <div className="mt-6 pt-6 border-t border-outline-variant/30">
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Deskripsi
            </h4>
            <p className="text-sm text-on-surface leading-relaxed">
              {c.description}
            </p>
          </div>
        )}
      </AdminCard>

      {/* ============ PIC ============ */}
      {c.owner && (
        <AdminCard>
          <AdminCardHeader title="Penanggung Jawab" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {(c.owner.fullName || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface">
                {c.owner.fullName || 'Anonim'}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {c.owner.email}
                </span>
                {c.owner.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {c.owner.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </AdminCard>
      )}

      {/* ============ DOCUMENTS ============ */}
      <AdminCard>
        <AdminCardHeader
          title="Dokumen Pendukung"
          description="Dokumen yang diunggah perusahaan saat registrasi"
        />

        {verification.supportingDocs ? (
          <div className="space-y-3">
            {Object.entries(verification.supportingDocs).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low"
              >
                <div className="w-10 h-10 rounded-lg bg-white text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {String(value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-on-surface-variant">
            Tidak ada dokumen yang diunggah
          </div>
        )}
      </AdminCard>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function InfoRow({
  icon: Icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </dt>
      <dd className="text-sm text-on-surface leading-relaxed break-words">
        {value}
      </dd>
    </div>
  )
}