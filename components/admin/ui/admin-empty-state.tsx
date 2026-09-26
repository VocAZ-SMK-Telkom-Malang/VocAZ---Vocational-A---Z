type AdminEmptyStateProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export function AdminEmptyState({
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
      <h3 className="font-display text-lg font-bold text-on-surface mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-on-surface-variant mb-4">{description}</p>
      )}
      {action}
    </div>
  )
}