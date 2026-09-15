import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest, ApiError } from '../services/api'
import { StatusBadge } from '../components/StatusBadge'
import {
  PAYMENT_METHOD_LABELS,
  type Order,
} from '../types'
import { formatMoney } from '../utils/formatMoney'

interface CustomerDetail {
  id: string
  email: string
  name: string
  phone: string | null
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
  orderCount: number
  orders: Order[]
}

export function CustomerDetailPage() {
  const { id } = useParams()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    apiRequest<CustomerDetail>(`/api/customers/${id}`)
      .then(setCustomer)
      .catch((err: unknown) => {
        setError(
          err instanceof ApiError ? err.message : 'Could not load customer',
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="panel">
        <p className="page-sub">Loading customer…</p>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="panel">
        <h1 className="page-title">Customer not found</h1>
        <p className="page-sub">{error}</p>
        <Link to="/customers" className="btn btn--ghost" style={{ marginTop: '1rem' }}>
          Back to customers
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="eyebrow">Customers</p>
      <h1 className="page-title">{customer.name}</h1>
      <p className="page-sub">{customer.email}</p>

      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        <section className="panel">
          <h2 className="page-title" style={{ fontSize: '1.45rem' }}>
            Profile
          </h2>
          <div className="detail-list" style={{ marginTop: '0.75rem' }}>
            <div>
              <span>Customer ID</span>
              <strong style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                {customer.id}
              </strong>
            </div>
            <div>
              <span>Name</span>
              <strong>{customer.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{customer.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{customer.phone || '—'}</strong>
            </div>
            <div className="detail-list__block">
              <span>Default address</span>
              <strong style={{ whiteSpace: 'pre-line', textAlign: 'right' }}>
                {customer.address
                  ? [
                      customer.address.line1,
                      customer.address.line2,
                      `${customer.address.city}, ${customer.address.state} ${customer.address.postalCode}`,
                      customer.address.country,
                    ]
                      .filter(Boolean)
                      .join('\n') || '—'
                  : '—'}
              </strong>
            </div>
            <div>
              <span>Joined</span>
              <strong>{new Date(customer.createdAt).toLocaleString()}</strong>
            </div>
            <div>
              <span>Last updated</span>
              <strong>{new Date(customer.updatedAt).toLocaleString()}</strong>
            </div>
            <div>
              <span>Orders</span>
              <strong>{customer.orderCount}</strong>
            </div>
          </div>
          <Link to="/customers" className="btn btn--ghost" style={{ marginTop: '1.25rem' }}>
            Back to customers
          </Link>
        </section>

        <section className="panel">
          <h2 className="page-title" style={{ fontSize: '1.45rem' }}>
            Order history
          </h2>
          {customer.orders.length === 0 ? (
            <p className="page-sub" style={{ marginTop: '0.75rem' }}>
              No orders yet.
            </p>
          ) : (
            <div className="table-wrap" style={{ marginTop: '0.75rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link to={`/orders/${order.id}`}>{order.id.slice(0, 10)}…</Link>
                      </td>
                      <td>{formatMoney(order.total)}</td>
                      <td>
                        {PAYMENT_METHOD_LABELS[
                          order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                        ] ?? order.paymentMethod}
                      </td>
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
        </section>
      </div>
    </div>
  )
}
