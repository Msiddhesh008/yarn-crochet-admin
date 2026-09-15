import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { EmptyState } from '../components/EmptyState'

export function CustomersPage() {
  const { customers, loading } = useCatalog()

  return (
    <div>
      <p className="eyebrow">Customers</p>
      <h1 className="page-title">Shoppers</h1>
      <p className="page-sub">Accounts that can place and track orders.</p>

      {loading ? <p className="page-sub">Loading customers…</p> : null}

      {!loading && customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          body="When someone registers on the storefront, they’ll appear here."
        />
      ) : (
        <div className="panel" style={{ marginTop: '1.25rem' }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>
                    <td>{customer.orderCount}</td>
                    <td>
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/customers/${customer.id}`}
                        className="btn btn--ghost btn--sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
