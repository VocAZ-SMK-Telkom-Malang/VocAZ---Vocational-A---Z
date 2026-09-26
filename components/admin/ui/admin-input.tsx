type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function AdminInput({
  label,
  error,
  className = '',
  ...props
}: AdminInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg border border-outline-variant/50 bg-white text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition ${className}`}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}