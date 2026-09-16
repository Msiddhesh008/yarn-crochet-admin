import type { CSSProperties } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  className?: string
  style?: CSSProperties
}

export function StatCard({ label, value, className, style }: StatCardProps) {
  return (
    <article className={className ?? 'stat-card'} style={style}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </article>
  )
}
