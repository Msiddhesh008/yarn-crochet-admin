import { Link } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { useCatalog } from '../context/CatalogContext'

export function OverviewPage() {
  const { products, orders, customRequests, resetSeed } = useCatalog()
  const published = products.filter((p) => p.status === 'published').length
  const openOrders = orders.filter(
    (o) => o.status === 'new' || o.status === 'in_progress',
  ).length
  const recent = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="page-title">Good day in the studio</h1>
      <p className="page-sub">A quiet look at pieces, orders, and requests.</p>

      <div className="stats">
        <StatCard label="Products" value={products.length} />
        <StatCard label="Published" value={published} />
        <StatCard label="Open orders" value={openOrders} />
        <StatCard label="Custom requests" value={customRequests.length} />
      </div>

      <div className="grid-2">
        <section className="panel">
          <div className="toolbar" style={{ marginTop: 0 }}>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
              Recent orders
            </h2>
            <Link to="/orders" className="btn btn--ghost btn--sm">
              View all
            </Link>
          </div>
          <div className="table-wrap">
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
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.customer}</td>
                    <td>${order.total}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="toolbar" style={{ marginTop: 0 }}>
            <h2 className="page-title" style={{ fontSize: '1.5rem' }}>
              Featured pieces
            </h2>
            <Link to="/products" className="btn btn--ghost btn--sm">
              Manage
            </Link>
          </div>
          <div className="stack">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
              >
                <img src={product.image} alt="" className="thumb" />
                <div>
                  <strong>{product.name}</strong>
                  <p className="page-sub" style={{ marginTop: 0 }}>
                    ${product.price} · {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ marginTop: '1.25rem' }}
            onClick={resetSeed}
          >
            Reset mock data
          </button>
        </section>
      </div>
    </div>
  )
}
