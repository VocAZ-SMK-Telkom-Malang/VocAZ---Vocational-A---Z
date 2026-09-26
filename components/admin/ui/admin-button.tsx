import Link from 'next/link'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type AdminButtonProps = {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

export function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  disabled,
  loading,
  className = '',
  icon,
  iconRight,
}: AdminButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-container to-[#E03E3E] text-white shadow-[0_4px_16px_rgba(220,38,38,0.22)] hover:brightness-105 active:scale-95',
    secondary:
      'bg-white text-on-surface border border-outline-variant hover:bg-surface-container-low',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container',
    danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span>{children}</span>
      {iconRight}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </button>
  )
}