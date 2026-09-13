interface EmptyStateProps {
  title: string
  body?: string
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="empty">
      <p className="page-title" style={{ fontSize: '1.6rem' }}>
        {title}
      </p>
      {body ? <p className="page-sub">{body}</p> : null}
    </div>
  )
}
