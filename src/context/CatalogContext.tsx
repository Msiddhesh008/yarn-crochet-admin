import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  CustomRequest,
  GalleryAsset,
  Order,
  OrderStatus,
  Product,
  SiteContent,
} from '../types'
import type { ContentSectionKey } from '../types/contentSections'
import { seedContent } from '../data/content'
import { apiRequest, ApiError, uploadGalleryDataUrl } from '../services/api'
import { useAuth } from './AuthContext'

export interface CustomerListItem {
  id: string
  email: string
  name: string
  phone: string | null
  createdAt: string
  updatedAt?: string
  orderCount: number
}

interface CatalogContextValue {
  products: Product[]
  orders: Order[]
  customers: CustomerListItem[]
  content: SiteContent
  customRequests: CustomRequest[]
  galleryAssets: GalleryAsset[]
  loading: boolean
  mutating: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshGallery: () => Promise<void>
  saveProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
  saveContent: (content: SiteContent) => Promise<void>
  saveContentSection: (
    section: ContentSectionKey,
    content: SiteContent,
  ) => Promise<void>
  updateCustomRequestStatus: (
    id: string,
    status: CustomRequest['status'],
  ) => Promise<void>
  uploadGalleryAsset: (dataUrl: string, caption?: string) => Promise<GalleryAsset>
  updateGalleryAsset: (
    id: string,
    patch: { caption?: string; sortOrder?: number },
  ) => Promise<void>
  deleteGalleryAsset: (id: string) => Promise<void>
  reorderGalleryAssets: (ids: string[]) => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [content, setContent] = useState<SiteContent>(seedContent)
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([])
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [mutatingCount, setMutatingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const beginMutation = useCallback(() => {
    setMutatingCount((n) => n + 1)
  }, [])

  const endMutation = useCallback(() => {
    setMutatingCount((n) => Math.max(0, n - 1))
  }, [])

  const withMutation = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      beginMutation()
      try {
        return await fn()
      } finally {
        endMutation()
      }
    },
    [beginMutation, endMutation],
  )

  const refreshGallery = useCallback(async () => {
    const assets = await apiRequest<GalleryAsset[]>('/api/gallery', {
      auth: false,
    })
    setGalleryAssets(assets)
  }, [])

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([])
      setOrders([])
      setCustomers([])
      setCustomRequests([])
      setGalleryAssets([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [
        nextProducts,
        nextContent,
        nextRequests,
        nextOrders,
        nextCustomers,
        nextGallery,
      ] = await Promise.all([
        apiRequest<Product[]>('/api/products'),
        apiRequest<SiteContent>('/api/content', { auth: false }),
        apiRequest<CustomRequest[]>('/api/custom-requests'),
        apiRequest<Order[]>('/api/orders'),
        apiRequest<CustomerListItem[]>('/api/customers'),
        apiRequest<GalleryAsset[]>('/api/gallery', { auth: false }),
      ])
      setProducts(nextProducts)
      setContent(nextContent)
      setCustomRequests(nextRequests)
      setOrders(nextOrders)
      setCustomers(nextCustomers)
      setGalleryAssets(nextGallery)
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load studio data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh().catch(console.error)
  }, [refresh])

  const saveProduct = useCallback(
    async (product: Product) => {
      await withMutation(async () => {
        const exists = products.some((p) => p.id === product.id)
        const saved = exists
          ? await apiRequest<Product>(`/api/products/${product.id}`, {
              method: 'PUT',
              body: product,
            })
          : await apiRequest<Product>('/api/products', {
              method: 'POST',
              body: product,
            })
        setProducts((prev) => {
          const has = prev.some((p) => p.id === saved.id)
          return has
            ? prev.map((p) => (p.id === saved.id ? saved : p))
            : [saved, ...prev]
        })
      })
    },
    [products, withMutation],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      await withMutation(async () => {
        await apiRequest<void>(`/api/products/${id}`, { method: 'DELETE' })
        setProducts((prev) => prev.filter((p) => p.id !== id))
      })
    },
    [withMutation],
  )

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      await withMutation(async () => {
        const saved = await apiRequest<Order>(`/api/orders/${id}`, {
          method: 'PATCH',
          body: { status },
        })
        setOrders((prev) => prev.map((o) => (o.id === id ? saved : o)))
      })
    },
    [withMutation],
  )

  const saveContentSection = useCallback(
    async (section: ContentSectionKey, next: SiteContent) => {
      await withMutation(async () => {
        if (section === 'handmadeNote') {
          await apiRequest(`/api/content/handmadeNote`, {
            method: 'PUT',
            body: { handmadeNote: next.handmadeNote },
          })
        } else if (section === 'gallery') {
          const { eyebrow, heading, subheading } = next.gallery
          await apiRequest(`/api/content/gallery`, {
            method: 'PUT',
            body: { eyebrow, heading, subheading },
          })
        } else {
          await apiRequest(`/api/content/${section}`, {
            method: 'PUT',
            body: next[section],
          })
        }
        const saved = await apiRequest<SiteContent>('/api/content', {
          auth: false,
        })
        setContent(saved)
      })
    },
    [withMutation],
  )

  const saveContent = useCallback(
    async (next: SiteContent) => {
      const sections: ContentSectionKey[] = [
        'brand',
        'hero',
        'collection',
        'stitchStory',
        'maker',
        'process',
        'featuredShowcase',
        'customOrder',
        'gallery',
        'testimonials',
        'shopPage',
        'aboutPage',
        'customPage',
        'footer',
        'instagram',
        'handmadeNote',
      ]
      for (const section of sections) {
        await saveContentSection(section, next)
      }
    },
    [saveContentSection],
  )

  const updateCustomRequestStatus = useCallback(
    async (id: string, status: CustomRequest['status']) => {
      await withMutation(async () => {
        const saved = await apiRequest<CustomRequest>(
          `/api/custom-requests/${id}`,
          {
            method: 'PATCH',
            body: { status },
          },
        )
        setCustomRequests((prev) =>
          prev.map((r) => (r.id === saved.id ? saved : r)),
        )
      })
    },
    [withMutation],
  )

  const uploadGalleryAsset = useCallback(
    async (dataUrl: string, caption = '') => {
      return withMutation(async () => {
        const saved = await uploadGalleryDataUrl(dataUrl, caption)
        setGalleryAssets((prev) => [...prev, saved])
        return saved
      })
    },
    [withMutation],
  )

  const updateGalleryAsset = useCallback(
    async (id: string, patch: { caption?: string; sortOrder?: number }) => {
      await withMutation(async () => {
        const saved = await apiRequest<GalleryAsset>(`/api/gallery/${id}`, {
          method: 'PATCH',
          body: patch,
        })
        setGalleryAssets((prev) =>
          prev.map((a) => (a.id === saved.id ? saved : a)),
        )
      })
    },
    [withMutation],
  )

  const deleteGalleryAsset = useCallback(
    async (id: string) => {
      await withMutation(async () => {
        await apiRequest<void>(`/api/gallery/${id}`, { method: 'DELETE' })
        setGalleryAssets((prev) => prev.filter((a) => a.id !== id))
      })
    },
    [withMutation],
  )

  const reorderGalleryAssets = useCallback(
    async (ids: string[]) => {
      await withMutation(async () => {
        const saved = await apiRequest<GalleryAsset[]>('/api/gallery/reorder', {
          method: 'PUT',
          body: { ids },
        })
        setGalleryAssets(saved)
      })
    },
    [withMutation],
  )

  const mutating = mutatingCount > 0

  const value = useMemo(
    () => ({
      products,
      orders,
      customers,
      content,
      customRequests,
      galleryAssets,
      loading,
      mutating,
      error,
      refresh,
      refreshGallery,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      saveContentSection,
      updateCustomRequestStatus,
      uploadGalleryAsset,
      updateGalleryAsset,
      deleteGalleryAsset,
      reorderGalleryAssets,
    }),
    [
      products,
      orders,
      customers,
      content,
      customRequests,
      galleryAssets,
      loading,
      mutating,
      error,
      refresh,
      refreshGallery,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      saveContentSection,
      updateCustomRequestStatus,
      uploadGalleryAsset,
      updateGalleryAsset,
      deleteGalleryAsset,
      reorderGalleryAssets,
    ],
  )

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
