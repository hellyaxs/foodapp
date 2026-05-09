import type { CartItem } from './cart'
import type { PaymentMethod } from './payment'

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  discount?: number
  total: number
  couponCode?: string | null
  customerName: string
  address: string
  paymentMethod: PaymentMethod
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface CreateOrderPayload {
  items: CartItem[]
  subtotal: number
  discount?: number
  total: number
  couponCode?: string | null
  customerName: string
  address: string
  paymentMethod: PaymentMethod
}
