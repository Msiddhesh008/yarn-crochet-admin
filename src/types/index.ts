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
  image?: string
  slug?: string
}

export type PaymentMethod = 'razorpay' | 'cod'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cod_pending'

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
  customerId?: string
  customer: string
  email: string
  address: OrderAddress
  paymentMethod: PaymentMethod | string
  paymentStatus?: PaymentStatus | string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  note: string
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  razorpay: 'Razorpay',
  cod: 'Cash on delivery',
  card: 'Card',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  bank_transfer: 'Bank transfer',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Payment pending',
  paid: 'Paid',
  failed: 'Payment failed',
  cod_pending: 'Pay on delivery',
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

export interface GalleryAsset {
  id: string
  caption: string
  imageUrl: string
  cloudinaryPublicId: string
  sortOrder: number
  createdAt: string
  updatedAt: string
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
