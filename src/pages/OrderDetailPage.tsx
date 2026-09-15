import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { StatusBadge } from '../components/StatusBadge'
import { SelectField } from '../components/form/FormControls'
import {
  ORDER_STATUSES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
} from '../types'
import { mediaUrl } from '../utils/mediaUrl'
import { formatMoney } from '../utils/formatMoney'

function formatAddress(order: {
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}) {
  const { line1, line2, city, state, postalCode, country } = order.address
  return [line1, line2, `${city}, ${state} ${postalCode}`, country]
    .filter(Boolean)
    .join('\n')
}

export function OrderDetailPage() {
  const { id } = useParams()
  const { orders, updateOrderStatus } = useCatalog()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="panel">
        <h1 className="page-title">Order not found</h1>
        <Link to="/orders" className="btn btn--ghost" style={{ marginTop: '1rem' }}>
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="eyebrow">Orders</p>
      <h1 className="page-title">{order.id}</h1>
      <p className="page-sub">
        {order.customerId ? (
          <Link to={`/customers/${order.customerId}`}>{order.customer}</Link>
        ) : (
          order.customer
        )}{' '}
        · {order.email}
      </p>

      <div className="grid-2" style={{ marginTop: '1.25rem' }}>
        <section className="panel">
          <h2 className="page-title" style={{ fontSize: '1.45rem' }}>
            Line items
          </h2>
          <div className="table-wrap" style={{ marginTop: '0.75rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Piece</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Colour</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${item.productId}-${item.name}`}>
                    <td>
                      {item.image ? (
                        <img
                          src={mediaUrl(item.image)}
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatMoney(item.price)}</td>
                    <td>
                      {item.color ? (
                        <span className="swatch" style={{ background: item.color }} />
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
            Total {formatMoney(order.total)}
          </p>
        </section>

        <section className="panel">
          <h2 className="page-title" style={{ fontSize: '1.45rem' }}>
            Fulfilment
          </h2>
          <div className="detail-list">
            <div>
              <span>Status</span>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <span>Placed</span>
              <strong>{new Date(order.createdAt).toLocaleString()}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>
                {PAYMENT_METHOD_LABELS[order.paymentMethod] ??
                  order.paymentMethod}
                {order.paymentStatus
                  ? ` · ${
                      PAYMENT_STATUS_LABELS[order.paymentStatus] ??
                      order.paymentStatus
                    }`
                  : ''}
              </strong>
            </div>
            <div className="detail-list__block">
              <span>Ship to</span>
              <strong style={{ whiteSpace: 'pre-line', textAlign: 'right' }}>
                {formatAddress(order)}
              </strong>
            </div>
            <div>
              <span>Note</span>
              <strong>{order.note || '—'}</strong>
            </div>
          </div>
          <SelectField
            id="status"
            label="Update status"
            value={order.status}
            fieldStyle={{ marginTop: '1.25rem' }}
            onChange={(next) => {
              updateOrderStatus(order.id, next as OrderStatus).catch(
                (err: unknown) => {
                  window.alert(
                    err instanceof Error
                      ? err.message
                      : 'Could not update status',
                  )
                },
              )
            }}
            options={ORDER_STATUSES.map((s) => ({
              value: s,
              label: s.replace('_', ' '),
            }))}
          />
          <Link to="/orders" className="btn btn--ghost" style={{ marginTop: '0.75rem' }}>
            Back to orders
          </Link>
        </section>
      </div>
    </div>
  )
}
