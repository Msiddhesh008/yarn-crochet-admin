import logo from '../assets/logo-transparent.png'

interface AdminLoaderProps {
  variant?: 'overlay' | 'inline'
  label?: string
}

/** Brand animated loader — overlay for page loads, inline for buttons. */
export function AdminLoader({
  variant = 'overlay',
  label = 'Loading…',
}: AdminLoaderProps) {
  if (variant === 'inline') {
    return (
      <span className="admin-loader admin-loader--inline" aria-hidden>
        <span className="admin-loader__spinner" />
      </span>
    )
  }

  return (
    <div
      className="admin-loader admin-loader--overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="admin-loader__card">
        <div className="admin-loader__mark">
          <span className="admin-loader__ring" aria-hidden />
          <img src={logo} alt="" className="admin-loader__logo" />
        </div>
        <p className="admin-loader__label">{label}</p>
      </div>
    </div>
  )
}
