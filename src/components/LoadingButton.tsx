import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AdminLoader } from './AdminLoader'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingLabel?: string
  children: ReactNode
}

/** Primary/action button that disables and shows a spinner while an API call runs. */
export function LoadingButton({
  loading = false,
  loadingLabel,
  children,
  className = '',
  disabled,
  type = 'button',
  ...rest
}: LoadingButtonProps) {
  const classes = `btn${loading ? ' is-loading' : ''}${className ? ` ${className}` : ''}`

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <AdminLoader variant="inline" /> : null}
      <span className="btn__label">
        {loading && loadingLabel ? loadingLabel : children}
      </span>
    </button>
  )
}
