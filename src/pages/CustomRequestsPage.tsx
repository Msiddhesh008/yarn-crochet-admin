import { useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import { EmptyState } from '../components/EmptyState'
import { StatusBadge } from '../components/StatusBadge'
import { SelectField } from '../components/form/FormControls'
import type { CustomRequest } from '../types'

const STATUSES: CustomRequest['status'][] = ['new', 'reviewed', 'quoted', 'closed']

export function CustomRequestsPage() {
  const { customRequests, updateCustomRequestStatus, mutating } = useCatalog()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const sorted = [...customRequests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <div>
      <p className="eyebrow">Inbox</p>
      <h1 className="page-title">Custom requests</h1>
      <p className="page-sub">Ideas waiting to become yarn and stitches.</p>

      {sorted.length === 0 ? (
        <div className="panel" style={{ marginTop: '1.25rem' }}>
          <EmptyState
            title="Inbox is quiet"
            body="Custom order ideas from the storefront will show up here."
          />
        </div>
      ) : null}

      <div className="stack" style={{ marginTop: '1.25rem' }}>
        {sorted.map((req) => (
          <article key={req.id} className="panel">
            <div className="toolbar" style={{ marginTop: 0 }}>
              <div>
                <p className="eyebrow">{req.id}</p>
                <h2 className="page-title" style={{ fontSize: '1.45rem' }}>
                  {req.name}
                </h2>
                <p className="page-sub">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={req.status} />
            </div>
            <div className="detail-list">
              <div>
                <span>Idea</span>
                <strong>{req.idea}</strong>
              </div>
              <div>
                <span>Colours</span>
                <strong>{req.colours}</strong>
              </div>
              <div>
                <span>Message</span>
                <strong>{req.message || '—'}</strong>
              </div>
            </div>
            <SelectField
              id={`status-${req.id}`}
              label="Update status"
              value={req.status}
              disabled={updatingId === req.id || mutating}
              hint={updatingId === req.id ? 'Updating…' : undefined}
              fieldStyle={{ marginTop: '1rem' }}
              onChange={(next) => {
                setUpdatingId(req.id)
                updateCustomRequestStatus(
                  req.id,
                  next as CustomRequest['status'],
                )
                  .catch((err: unknown) => {
                    window.alert(
                      err instanceof Error
                        ? err.message
                        : 'Could not update status',
                    )
                  })
                  .finally(() => setUpdatingId(null))
              }}
              options={STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </article>
        ))}
      </div>
    </div>
  )
}
