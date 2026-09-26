type AdminCardProps = {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export function AdminCard({
  children,
  className = '',
  padding = 'md',
}: AdminCardProps) {
  const paddingClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding]

  return (
    <div
      className={`bg-white rounded-2xl border border-outline-variant/30 shadow-[0_4px_16px_rgba(183,0,17,0.04)] ${paddingClass} ${className}`}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function AdminCardHeader({
  title,
  description,
  action,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h3 className="font-display text-base font-bold text-on-surface">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-on-surface-variant mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}