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
  Order,
  OrderStatus,
  Product,
  SiteContent,
} from '../types'
import type { ContentSectionKey } from '../types/contentSections'
import { seedContent } from '../data/content'
import { apiRequest, ApiError } from '../services/api'
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
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
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
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<CustomerListItem[]>([])
  const [content, setContent] = useState<SiteContent>(seedContent)
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setProducts([])
      setOrders([])
      setCustomers([])
      setCustomRequests([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [nextProducts, nextContent, nextRequests, nextOrders, nextCustomers] =
        await Promise.all([
          apiRequest<Product[]>('/api/products'),
          apiRequest<SiteContent>('/api/content', { auth: false }),
          apiRequest<CustomRequest[]>('/api/custom-requests'),
          apiRequest<Order[]>('/api/orders'),
          apiRequest<CustomerListItem[]>('/api/customers'),
        ])
      setProducts(nextProducts)
      setContent(nextContent)
      setCustomRequests(nextRequests)
      setOrders(nextOrders)
      setCustomers(nextCustomers)
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
    },
    [products],
  )

  const deleteProduct = useCallback(async (id: string) => {
    await apiRequest<void>(`/api/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      const saved = await apiRequest<Order>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: { status },
      })
      setOrders((prev) => prev.map((o) => (o.id === id ? saved : o)))
    },
    [],
  )

  const saveContentSection = useCallback(
    async (section: ContentSectionKey, next: SiteContent) => {
      if (section === 'handmadeNote') {
        await apiRequest(`/api/content/handmadeNote`, {
          method: 'PUT',
          body: { handmadeNote: next.handmadeNote },
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
    },
    [],
  )

  const saveContent = useCallback(async (next: SiteContent) => {
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
  }, [saveContentSection])

  const updateCustomRequestStatus = useCallback(
    async (id: string, status: CustomRequest['status']) => {
      const saved = await apiRequest<CustomRequest>(
        `/api/custom-requests/${id}`,
        {
          method: 'PATCH',
          body: { status },
        },
      )
      setCustomRequests((prev) =>
        prev.map((r) => (r.id === id ? saved : r)),
      )
    },
    [],
  )

  const value = useMemo(
    () => ({
      products,
      orders,
      customers,
      content,
      customRequests,
      loading,
      error,
      refresh,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      saveContentSection,
      updateCustomRequestStatus,
    }),
    [
      products,
      orders,
      customers,
      content,
      customRequests,
      loading,
      error,
      refresh,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      saveContentSection,
      updateCustomRequestStatus,
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
