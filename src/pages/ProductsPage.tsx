import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { ThemeDropdown, ThemeInput } from '../components/form/FormControls'
import { ThemeSwitch } from '../components/form/ThemeSwitch'
import { CATEGORIES, type Product, type PublishStatus } from '../types'
import { mediaUrl } from '../utils/mediaUrl'
import { formatMoney } from '../utils/formatMoney'
import {
  MAX_COLLECTION_PRODUCTS,
  MAX_FEATURED_PRODUCTS,
} from '../constants/productLimits'

const CATEGORY_OPTIONS = [
  { value: 'All', label: 'All categories' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
]

export function ProductsPage() {
  const { products, deleteProduct, saveProduct } = useCatalog()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<'All' | PublishStatus>('All')
  const [pendingKey, setPendingKey] = useState<string | null>(null)

  const featuredCount = useMemo(
    () => products.filter((p) => p.featured).length,
    [products],
  )
  const collectionCount = useMemo(
    () => products.filter((p) => p.showInCollection).length,
    [products],
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      const matchesCategory = category === 'All' || p.category === category
      const matchesStatus = status === 'All' || p.status === status
      return matchesQuery && matchesCategory && matchesStatus
    })
  }, [products, query, category, status])

  const toggleFlag = (
    product: Product,
    field: 'featured' | 'showInCollection',
    next: boolean,
  ) => {
    if (next) {
      if (field === 'featured' && !product.featured && featuredCount >= MAX_FEATURED_PRODUCTS) {
        window.alert(`Only ${MAX_FEATURED_PRODUCTS} featured products are allowed`)
        return
      }
      if (
        field === 'showInCollection' &&
        !product.showInCollection &&
        collectionCount >= MAX_COLLECTION_PRODUCTS
      ) {
        window.alert(
          `Only ${MAX_COLLECTION_PRODUCTS} collection products are allowed`,
        )
        return
      }
    }
    const key = `${product.id}:${field}`
    setPendingKey(key)
    saveProduct({ ...product, [field]: next })
      .catch((err: unknown) => {
        window.alert(
          err instanceof Error ? err.message : 'Could not update product',
        )
      })
      .finally(() => {
        setPendingKey((current) => (current === key ? null : current))
      })
  }

  return (
    <div>
      <p className="eyebrow">Catalog</p>
      <h1 className="page-title">Products</h1>
      <p className="page-sub">
        Edit pieces that appear on the Yarn storefront. Featured max{' '}
        {MAX_FEATURED_PRODUCTS} ({featuredCount}/{MAX_FEATURED_PRODUCTS}),
        collection max {MAX_COLLECTION_PRODUCTS} ({collectionCount}/
        {MAX_COLLECTION_PRODUCTS}).
      </p>

      <div className="toolbar toolbar--filters">
        <div className="toolbar__filters">
          <ThemeInput
            className="theme-input--pill"
            type="search"
            placeholder="Search pieces…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search pieces"
            style={{ flex: '1 1 160px', minWidth: 140, maxWidth: 220 }}
          />
          <ThemeDropdown
            pill
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={setCategory}
            ariaLabel="Filter by category"
          />
          <div className="chip-group" role="group" aria-label="Publish status">
            {(
              [
                { value: 'All', label: 'All' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ] as const
            ).map((s) => (
              <button
                key={s.value}
                type="button"
                className={`chip${status === s.value ? ' is-active' : ''}`}
                onClick={() => setStatus(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <Link to="/products/new" className="btn btn--primary toolbar__action">
          <Plus size={16} /> New piece
        </Link>
      </div>

      <div className="panel panel--mount">
        {filtered.length === 0 ? (
          <EmptyState title="No pieces found" body="Try another filter or add a new piece." />
        ) : (
          <div
            className="table-wrap table-wrap--mount"
            key={`${query}-${category}-${status}-${filtered.length}`}
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Piece</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Collection</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, index) => (
                  <tr
                    key={product.id}
                    className="data-table__row"
                    style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
                  >
                    <td>
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                        <img src={mediaUrl(product.image)} alt="" className="thumb" />
                        <div>
                          <strong>{product.name}</strong>
                          <p className="page-sub" style={{ marginTop: 0, fontSize: '0.8rem' }}>
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatMoney(product.price)}</td>
                    <td>
                      <StatusBadge status={product.status} />
                    </td>
                    <td>
                      <ThemeSwitch
                        id={`feat-${product.id}`}
                        checked={product.featured}
                        disabled={
                          pendingKey === `${product.id}:featured` ||
                          (!product.featured &&
                            featuredCount >= MAX_FEATURED_PRODUCTS)
                        }
                        ariaLabel={`Featured for ${product.name}`}
                        onChange={(checked) =>
                          toggleFlag(product, 'featured', checked)
                        }
                      />
                    </td>
                    <td>
                      <ThemeSwitch
                        id={`coll-${product.id}`}
                        checked={product.showInCollection}
                        disabled={
                          pendingKey === `${product.id}:showInCollection` ||
                          (!product.showInCollection &&
                            collectionCount >= MAX_COLLECTION_PRODUCTS)
                        }
                        ariaLabel={`Show ${product.name} in collection`}
                        onChange={(checked) =>
                          toggleFlag(product, 'showInCollection', checked)
                        }
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn--ghost btn--sm"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => {
                            if (window.confirm(`Remove ${product.name}?`)) {
                              deleteProduct(product.id).catch((err: unknown) => {
                                window.alert(
                                  err instanceof Error
                                    ? err.message
                                    : 'Could not delete product',
                                )
                              })
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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
