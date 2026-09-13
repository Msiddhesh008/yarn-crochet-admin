export type ProductCategory =
  | 'Crochet Flowers'
  | 'Crochet Bags'
  | 'Plushies'
  | 'Keychains'
  | 'Handmade Gifts'
  | 'Custom Pieces'

export type PublishStatus = 'draft' | 'published'

export interface Product {
  id: string
  slug: string
  name: string
  category: ProductCategory
  price: number
  description: string
  image: string
  colors: string[]
  featured: boolean
  showInCollection: boolean
  status: PublishStatus
}

export type OrderStatus =
  | 'new'
  | 'in_progress'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  color?: string
}

export type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'bank_transfer'

export interface OrderAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  customer: string
  email: string
  address: OrderAddress
  paymentMethod: PaymentMethod
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  note: string
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  bank_transfer: 'Bank transfer',
}

export interface CustomRequest {
  id: string
  name: string
  idea: string
  colours: string
  message: string
  createdAt: string
  status: 'new' | 'reviewed' | 'quoted' | 'closed'
}

export type {
  SiteContent,
  ProcessVisual,
  StitchStoryStep,
  ProcessStep,
  GalleryContentItem,
  TestimonialItem,
} from './content'

export const CATEGORIES: ProductCategory[] = [
  'Crochet Flowers',
  'Crochet Bags',
  'Plushies',
  'Keychains',
  'Handmade Gifts',
  'Custom Pieces',
]

export const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'in_progress',
  'shipped',
  'completed',
  'cancelled',
]
