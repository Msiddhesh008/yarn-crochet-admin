import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { ImageField } from '../components/ImageField'
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from '../components/form/FormControls'
import { CATEGORIES, type Product, type ProductCategory, type PublishStatus } from '../types'
import { storageMediaPath } from '../utils/mediaUrl'
import {
  MAX_COLLECTION_PRODUCTS,
  MAX_FEATURED_PRODUCTS,
} from '../constants/productLimits'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProductFormPage() {
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const { products, saveProduct, loading } = useCatalog()
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const existing = useMemo(
    () => (isNew ? undefined : products.find((p) => p.id === id)),
    [isNew, products, id],
  )

  const [name, setName] = useState(existing?.name ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [category, setCategory] = useState<ProductCategory>(
    existing?.category ?? 'Plushies',
  )
  const [price, setPrice] = useState(String(existing?.price ?? 36))
  const [description, setDescription] = useState(existing?.description ?? '')
  const [image, setImage] = useState(
    existing?.image ?? '/uploads/products/sunny-teddy.jpg',
  )
  const [colors, setColors] = useState((existing?.colors ?? ['#c9a9a6']).join(', '))
  const [featured, setFeatured] = useState(existing?.featured ?? false)
  const [showInCollection, setShowInCollection] = useState(() => {
    if (existing) return existing.showInCollection
    const collectionFull =
      products.filter((p) => p.showInCollection).length >= MAX_COLLECTION_PRODUCTS
    return !collectionFull
  })
  const [status, setStatus] = useState<PublishStatus>(existing?.status ?? 'draft')
  const [hydrated, setHydrated] = useState(Boolean(isNew || existing))

  const featuredCountOthers = useMemo(
    () => products.filter((p) => p.featured && p.id !== existing?.id).length,
    [products, existing?.id],
  )
  const collectionCountOthers = useMemo(
    () =>
      products.filter((p) => p.showInCollection && p.id !== existing?.id).length,
    [products, existing?.id],
  )
  const featuredAtLimit =
    !featured && featuredCountOthers >= MAX_FEATURED_PRODUCTS
  const collectionAtLimit =
    !showInCollection && collectionCountOthers >= MAX_COLLECTION_PRODUCTS

  useEffect(() => {
    if (!existing || hydrated) return
    setName(existing.name)
    setSlug(existing.slug)
    setCategory(existing.category)
    setPrice(String(existing.price))
    setDescription(existing.description)
    setImage(existing.image)
    setColors(existing.colors.join(', '))
    setFeatured(existing.featured)
    setShowInCollection(existing.showInCollection)
    setStatus(existing.status)
    setHydrated(true)
  }, [existing, hydrated])

  if (!isNew && loading && !existing) {
    return (
      <div className="panel">
        <p className="page-sub">Loading piece…</p>
      </div>
    )
  }

  if (!isNew && !existing) {
    return (
      <div className="panel">
        <h1 className="page-title">Piece not found</h1>
        <Link to="/products" className="btn btn--ghost" style={{ marginTop: '1rem' }}>
          Back to products
        </Link>
      </div>
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (featured && featuredCountOthers >= MAX_FEATURED_PRODUCTS) {
      setFormError(`Only ${MAX_FEATURED_PRODUCTS} featured products are allowed`)
      return
    }
    if (showInCollection && collectionCountOthers >= MAX_COLLECTION_PRODUCTS) {
      setFormError(
        `Only ${MAX_COLLECTION_PRODUCTS} collection products are allowed`,
      )
      return
    }
    const next: Product = {
      id: existing?.id ?? `p-${Date.now()}`,
      name: name.trim(),
      slug: (slug || slugify(name)).trim(),
      category,
      price: Number(price) || 0,
      description: description.trim(),
      image: storageMediaPath(image.trim()),
      colors: colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      featured,
      showInCollection,
      status,
    }
    setSaving(true)
    setFormError('')
    saveProduct(next)
      .then(() => navigate('/products'))
      .catch((err: unknown) => {
        setFormError(err instanceof Error ? err.message : 'Could not save product')
      })
      .finally(() => setSaving(false))
  }

  return (
    <div>
      <p className="eyebrow">Catalog</p>
      <h1 className="page-title">{isNew ? 'New piece' : 'Edit piece'}</h1>
      <p className="page-sub">Keep details soft, clear, and ready for the shop.</p>

      <form className="panel" onSubmit={onSubmit} style={{ marginTop: '1.25rem' }}>
        <div className="grid-2">
          <div className="stack">
            <TextField
              id="name"
              label="Name"
              required
              value={name}
              onChange={(next) => {
                setName(next)
                if (isNew) setSlug(slugify(next))
              }}
            />
            <TextField
              id="slug"
              label="Slug"
              required
              value={slug}
              onChange={setSlug}
            />
            <SelectField
              id="category"
              label="Category"
              value={category}
              onChange={(next) => setCategory(next as ProductCategory)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
            <TextField
              id="price"
              label="Price (₹)"
              type="number"
              min={0}
              step={1}
              required
              value={price}
              onChange={setPrice}
            />
          </div>
          <div className="stack">
            <ImageField
              id="image"
              label="Product image"
              aspect="product"
              value={image}
              onChange={setImage}
            />
            <TextField
              id="colors"
              label="Colours (comma-separated hex)"
              value={colors}
              onChange={setColors}
            />
            <div className="swatch-row">
              {colors
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean)
                .map((c) => (
                  <span key={c} className="swatch" style={{ background: c }} />
                ))}
            </div>
            <SelectField
              id="status"
              label="Publish status"
              value={status}
              onChange={(next) => setStatus(next as PublishStatus)}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
              ]}
            />
            <CheckboxField
              id="featured"
              label="Featured on storefront"
              checked={featured}
              disabled={featuredAtLimit}
              hint={
                featuredAtLimit
                  ? `Max ${MAX_FEATURED_PRODUCTS} featured pieces`
                  : `${featuredCountOthers + (featured ? 1 : 0)}/${MAX_FEATURED_PRODUCTS} used`
              }
              onChange={setFeatured}
            />
            <CheckboxField
              id="showInCollection"
              label="Show in collection"
              checked={showInCollection}
              disabled={collectionAtLimit}
              hint={
                collectionAtLimit
                  ? `Max ${MAX_COLLECTION_PRODUCTS} collection pieces`
                  : `${collectionCountOthers + (showInCollection ? 1 : 0)}/${MAX_COLLECTION_PRODUCTS} used`
              }
              onChange={setShowInCollection}
            />
          </div>
        </div>
        <TextAreaField
          id="description"
          label="Description"
          required
          value={description}
          onChange={setDescription}
          fieldStyle={{ marginTop: '1rem' }}
        />
        <div className="form-actions">
          {formError ? <p className="login-error">{formError}</p> : null}
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save piece'}
          </button>
          <Link to="/products" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
