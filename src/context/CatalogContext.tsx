import {
  createContext,
  useCallback,
  useContext,
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
import { seedProducts } from '../data/products'
import { seedOrders } from '../data/orders'
import { seedContent, seedCustomRequests } from '../data/content'
import { loadJson, saveJson } from '../services/storage'

interface CatalogContextValue {
  products: Product[]
  orders: Order[]
  content: SiteContent
  customRequests: CustomRequest[]
  saveProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  saveContent: (content: SiteContent) => void
  updateCustomRequestStatus: (
    id: string,
    status: CustomRequest['status'],
  ) => void
  resetSeed: () => void
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadJson('products-v2', seedProducts),
  )
  const [orders, setOrders] = useState<Order[]>(() =>
    loadJson('orders-v2', seedOrders),
  )
  const [content, setContent] = useState<SiteContent>(() =>
    loadJson('content-v3', seedContent),
  )
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>(() =>
    loadJson('custom-requests', seedCustomRequests),
  )

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      const next = exists
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev]
      saveJson('products-v2', next)
      return next
    })
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id)
      saveJson('products-v2', next)
      return next
    })
  }, [])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? { ...o, status } : o))
      saveJson('orders-v2', next)
      return next
    })
  }, [])

  const saveContent = useCallback((next: SiteContent) => {
    setContent(next)
    saveJson('content-v3', next)
  }, [])

  const updateCustomRequestStatus = useCallback(
    (id: string, status: CustomRequest['status']) => {
      setCustomRequests((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, status } : r))
        saveJson('custom-requests', next)
        return next
      })
    },
    [],
  )

  const resetSeed = useCallback(() => {
    setProducts(seedProducts)
    setOrders(seedOrders)
    setContent(seedContent)
    setCustomRequests(seedCustomRequests)
    saveJson('products-v2', seedProducts)
    saveJson('orders-v2', seedOrders)
    saveJson('content-v3', seedContent)
    saveJson('custom-requests', seedCustomRequests)
  }, [])

  const value = useMemo(
    () => ({
      products,
      orders,
      content,
      customRequests,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      updateCustomRequestStatus,
      resetSeed,
    }),
    [
      products,
      orders,
      content,
      customRequests,
      saveProduct,
      deleteProduct,
      updateOrderStatus,
      saveContent,
      updateCustomRequestStatus,
      resetSeed,
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
