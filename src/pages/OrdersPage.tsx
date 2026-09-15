import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { ThemeInput } from '../components/form/FormControls'
import {
  ORDER_STATUSES,
  PAYMENT_METHOD_LABELS,
  type OrderStatus,
} from '../types'
import { formatMoney } from '../utils/formatMoney'

export function OrdersPage() {
  const { orders } = useCatalog()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'All' | OrderStatus>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...orders]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((o) => {
        const matchesQuery =
          !q ||
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
        const matchesStatus = status === 'All' || o.status === status
        return matchesQuery && matchesStatus
      })
  }, [orders, query, status])

  return (
    <div>
      <p className="eyebrow">Orders</p>
      <h1 className="page-title">Order desk</h1>
      <p className="page-sub">Track every stitch from request to doorstep.</p>

      <div className="toolbar toolbar--filters">
        <div className="toolbar__filters">
          <ThemeInput
            className="theme-input--pill"
            type="search"
            placeholder="Search orders or customers…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search orders"
            style={{ flex: '1 1 180px', minWidth: 160, maxWidth: 280 }}
          />
          <div className="chip-group" role="group" aria-label="Order status">
            <button
              type="button"
              className={`chip${status === 'All' ? ' is-active' : ''}`}
              onClick={() => setStatus('All')}
            >
              All
            </button>
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip${status === s ? ' is-active' : ''}`}
                onClick={() => setStatus(s)}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel panel--mount">
        {filtered.length === 0 ? (
          <EmptyState title="No orders match" body="Try another status or search." />
        ) : (
          <div
            className="table-wrap table-wrap--mount"
            key={`${query}-${status}-${filtered.length}`}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Ship to</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, index) => (
                  <tr
                    key={order.id}
                    className="data-table__row"
                    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                  >
                    <td>
                      <Link to={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>
                      <strong>{order.customer}</strong>
                      <p className="page-sub" style={{ marginTop: 0, fontSize: '0.8rem' }}>
                        {order.email}
                      </p>
                    </td>
                    <td>
                      <span>
                        {order.address.city}, {order.address.state}
                      </span>
                      <p className="page-sub" style={{ marginTop: 0, fontSize: '0.8rem' }}>
                        {order.address.postalCode}
                      </p>
                    </td>
                    <td>
                      {PAYMENT_METHOD_LABELS[
                        order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                      ] ?? order.paymentMethod}
                    </td>
                    <td>{order.items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td>{formatMoney(order.total)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
