import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { useCatalog } from '../context/CatalogContext'
import { mediaUrl } from '../utils/mediaUrl'
import { formatMoney } from '../utils/formatMoney'

const OVERVIEW_STATS = [
  { label: 'Products', key: 'products' as const },
  { label: 'Published', key: 'published' as const },
  { label: 'Open orders', key: 'openOrders' as const },
  { label: 'Customers', key: 'customers' as const },
  { label: 'Custom requests', key: 'customRequests' as const },
]

export function OverviewPage() {
  const { products, orders, customRequests, customers, error, loading } =
    useCatalog()
  const published = products.filter((p) => p.status === 'published').length
  const openOrders = orders.filter(
    (o) => o.status === 'new' || o.status === 'in_progress',
  ).length
  const recent = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
  const featured = products.filter((p) => p.featured).slice(0, 4)

  const statValues = {
    products: products.length,
    published,
    openOrders,
    customers: customers.length,
    customRequests: customRequests.length,
  }

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="page-title">Good day in the studio</h1>
      <p className="page-sub">A quiet look at pieces, orders, and requests.</p>
      {loading ? <p className="page-sub">Loading studio data…</p> : null}
      {error ? <p className="login-error">{error}</p> : null}

      <div className="stats">
        {OVERVIEW_STATS.map((stat, index) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={statValues[stat.key]}
            className="stat-card stat-card--mount"
            style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
          />
        ))}
      </div>

      <div className="grid-2">
        <section className="panel panel--mount">
          <div className="toolbar" style={{ marginTop: 0 }}>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
              Recent orders
            </h2>
            <Link to="/orders" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="table-wrap table-wrap--mount">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order, index) => (
                  <tr
                    key={order.id}
                    className="data-table__row"
                    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                  >
                    <td>
                      <Link to={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.customer}</td>
                    <td>{formatMoney(order.total)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="panel panel--mount"
          style={{ animationDelay: '70ms' }}
        >
          <div className="toolbar" style={{ marginTop: 0 }}>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
              Featured pieces
            </h2>
            <Link to="/products" className="btn btn--ghost btn--sm">
              Manage
            </Link>
          </div>
          <div className="stack">
            {featured.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="mount-item"
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  animationDelay: `${Math.min(index, 12) * 35}ms`,
                }}
              >
                <img src={mediaUrl(product.image)} alt="" className="thumb" />
                <div>
                  <strong>{product.name}</strong>
                  <p className="page-sub" style={{ marginTop: 0 }}>
                    {formatMoney(product.price)} · {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
