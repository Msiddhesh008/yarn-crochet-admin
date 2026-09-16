import { useCallback, useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Table2 } from 'lucide-react'
import { API_HEALTH_PROBES } from '../data/apiHealthProbes'
import { getApiBaseUrl } from '../services/api'
import {
  probeApiEndpoint,
  type ApiProbeResult,
} from '../utils/probeApi'
import { LoadingButton } from '../components/LoadingButton'

type ViewMode = 'table' | 'graph'

export function ApiHealthPage() {
  const [results, setResults] = useState<ApiProbeResult[]>([])
  const [checking, setChecking] = useState(false)
  const [checkedAt, setCheckedAt] = useState<Date | null>(null)
  const [view, setView] = useState<ViewMode>('table')
  const apiBase = getApiBaseUrl()

  const runChecks = useCallback(async () => {
    setChecking(true)
    const next: ApiProbeResult[] = []
    for (const probe of API_HEALTH_PROBES) {
      next.push(await probeApiEndpoint(probe))
      setResults([...next])
    }
    setCheckedAt(new Date())
    setChecking(false)
  }, [])

  useEffect(() => {
    runChecks().catch(console.error)
  }, [runChecks])

  const summary = useMemo(() => {
    const total = results.length
    const ok = results.filter((r) => r.ok).length
    const down = results.filter((r) => !r.ok).length
    const avgMs =
      total === 0
        ? 0
        : Math.round(results.reduce((sum, r) => sum + r.ms, 0) / total)
    const maxMs = results.reduce((max, r) => Math.max(max, r.ms), 1)
    return { total, ok, down, avgMs, maxMs }
  }, [results])

  const overall =
    checking && results.length === 0
      ? 'checking'
      : summary.total > 0 && summary.down === 0
        ? 'healthy'
        : summary.ok > 0
          ? 'partial'
          : 'down'

  const overallLabel =
    overall === 'checking'
      ? 'Checking…'
      : overall === 'healthy'
        ? 'All working'
        : overall === 'partial'
          ? 'Some failing'
          : 'Not working'

  const overallClass =
    overall === 'healthy'
      ? 'is-ok'
      : overall === 'partial'
        ? 'is-checking'
        : overall === 'down'
          ? 'is-down'
          : 'is-checking'

  return (
    <div>
      <p className="eyebrow">System</p>
      <h1 className="page-title">API Health</h1>
      <p className="page-sub">
        Live checks for Yarn API routes ({apiBase}) — not this Admin app.
      </p>

      <div className="api-health-toolbar">
        <span className={`api-health-status ${overallClass}`}>{overallLabel}</span>
        <div className="api-health-toolbar__meta">
          <span>
            {summary.ok}/{summary.total || API_HEALTH_PROBES.length} ok
            {summary.total > 0 ? ` · avg ${summary.avgMs}ms` : ''}
          </span>
          <span>
            Last checked:{' '}
            {checkedAt ? checkedAt.toLocaleString() : '—'}
          </span>
        </div>
        <div className="api-health-toolbar__actions">
          <div className="api-health-view-toggle" role="group" aria-label="View">
            <button
              type="button"
              className={`chip${view === 'table' ? ' is-active' : ''}`}
              onClick={() => setView('table')}
            >
              <Table2 size={14} aria-hidden /> Table
            </button>
            <button
              type="button"
              className={`chip${view === 'graph' ? ' is-active' : ''}`}
              onClick={() => setView('graph')}
            >
              <LayoutGrid size={14} aria-hidden /> Graph
            </button>
          </div>
          <LoadingButton
            type="button"
            className="btn--primary btn--sm"
            onClick={() => {
              runChecks().catch(console.error)
            }}
            loading={checking}
            loadingLabel="Checking…"
          >
            Check again
          </LoadingButton>
        </div>
      </div>

      {view === 'table' ? (
        <section
          key={view}
          className="panel panel--mount"
          style={{ marginTop: '1rem', overflowX: 'auto' }}
        >
          <div className="table-wrap table-wrap--mount">
            <table className="data-table api-health-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {(results.length > 0 ? results : API_HEALTH_PROBES.map((p) => ({
                  id: p.id,
                  group: p.group,
                  method: p.method,
                  path: p.path,
                  description: p.description,
                  status: 0,
                  ok: false,
                  ms: 0,
                  error: checking ? 'Checking…' : '—',
                }))).map((row, index) => (
                  <tr
                    key={row.id}
                    className="data-table__row"
                    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                  >
                  <td>{row.group}</td>
                  <td>
                    <code>{row.path}</code>
                    <div className="api-health-table__desc">{row.description}</div>
                  </td>
                  <td>{row.method}</td>
                  <td>{row.status || '—'}</td>
                  <td>{row.ms ? `${row.ms} ms` : '—'}</td>
                  <td>
                    <span
                      className={`api-health-status ${
                        row.error === 'Checking…'
                          ? 'is-checking'
                          : row.ok
                            ? 'is-ok'
                            : 'is-down'
                      }`}
                    >
                      {row.error === 'Checking…'
                        ? 'Checking…'
                        : row.ok
                          ? 'Working'
                          : row.error || 'Down'}
                    </span>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section
          key={view}
          className="panel panel--mount api-health-graph"
          style={{ marginTop: '1rem' }}
        >
          <div className="api-health-graph__summary">
            <div className="api-health-graph__stat">
              <strong>{summary.ok}</strong>
              <span>Working</span>
            </div>
            <div className="api-health-graph__stat">
              <strong>{summary.down}</strong>
              <span>Failing</span>
            </div>
            <div className="api-health-graph__stat">
              <strong>{summary.avgMs}ms</strong>
              <span>Avg latency</span>
            </div>
          </div>

          <div className="api-health-bars" role="img" aria-label="Latency by endpoint">
            {results.map((row) => {
              const width = Math.max(
                4,
                Math.round((row.ms / summary.maxMs) * 100),
              )
              return (
                <div key={row.id} className="api-health-bar">
                  <div className="api-health-bar__label">
                    <code>{row.path}</code>
                    <span>{row.ms} ms</span>
                  </div>
                  <div className="api-health-bar__track">
                    <div
                      className={`api-health-bar__fill${row.ok ? ' is-ok' : ' is-down'}`}
                      style={{ width: `${width}%` }}
                      title={`${row.path}: ${row.ms}ms`}
                    />
                  </div>
                </div>
              )
            })}
            {results.length === 0 ? (
              <p className="page-sub">Run a check to see the latency graph.</p>
            ) : null}
          </div>

          <div className="api-health-donut" aria-hidden={summary.total === 0}>
            <div
              className="api-health-donut__ring"
              style={{
                background:
                  summary.total === 0
                    ? 'var(--color-line)'
                    : `conic-gradient(
                        #3d7a5a 0 ${
                          (summary.ok / summary.total) * 100
                        }%,
                        #b76e79 ${
                          (summary.ok / summary.total) * 100
                        }% 100%
                      )`,
              }}
            >
              <div className="api-health-donut__hole">
                <strong>
                  {summary.total
                    ? `${Math.round((summary.ok / summary.total) * 100)}%`
                    : '—'}
                </strong>
                <span>up</span>
              </div>
            </div>
            <ul className="api-health-donut__legend">
              <li>
                <span className="api-health-donut__swatch is-ok" /> Working (
                {summary.ok})
              </li>
              <li>
                <span className="api-health-donut__swatch is-down" /> Failing (
                {summary.down})
              </li>
            </ul>
          </div>
        </section>
      )}

      <p className="page-sub" style={{ marginTop: '1rem' }}>
        Write-only routes (checkout payments, uploads, product mutations) are not
        probed to avoid side effects.
      </p>
    </div>
  )
}
