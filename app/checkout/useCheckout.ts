'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { createOrder } from '@/lib/ordersClient'
import type { CartItem, PaymentMethod } from '@/types'
import { useCoupon, type UseCouponResult } from './coupon/useCoupon'

export interface CheckoutFormState {
  customerName: string
  address: string
  paymentMethod: PaymentMethod
}

export interface UseCheckoutResult {
  isEmpty: boolean
  items: CartItem[]
  form: CheckoutFormState
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
  subtotalCents: number
  coupon: UseCouponResult
  submit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  loading: boolean
  error: string | null
}

export function useCheckout(): UseCheckoutResult {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CheckoutFormState>({
    customerName: '',
    address: '',
    paymentMethod: 'pix',
  })

  const isEmpty = items.length === 0
  const subtotalCents = total
  const coupon = useCoupon(subtotalCents)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const order = await createOrder({
        items,
        subtotal: subtotalCents,
        discount: coupon.discountCents,
        total: coupon.checkoutTotal,
        couponCode: coupon.appliedCouponNormalized,
        ...form,
      })
      clearCart()
      router.push(`/order-success?id=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return {
    isEmpty,
    items,
    form,
    handleChange,
    subtotalCents,
    coupon,
    submit,
    loading,
    error,
  }
}
