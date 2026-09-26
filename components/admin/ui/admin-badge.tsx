type BadgeVariant =
  | 'admin'
  | 'student'
  | 'company'
  | 'school'
  | 'certification'
  | 'verified'
  | 'pending'
  | 'rejected'
  | 'active'
  | 'suspended'
  | 'draft'
  | 'closed'

type AdminBadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
}

export function AdminBadge({ children, variant = 'active' }: AdminBadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    admin: 'bg-purple-100 text-purple-700',
    student: 'bg-blue-100 text-blue-700',
    company: 'bg-emerald-100 text-emerald-700',
    school: 'bg-amber-100 text-amber-700',
    certification: 'bg-pink-100 text-pink-700',
    verified: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-gray-200 text-gray-700',
    draft: 'bg-gray-100 text-gray-600',
    closed: 'bg-red-100 text-red-700',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  )
}