'use client'

import { useCheckout } from './useCheckout'
import { CheckoutView } from './CheckoutView'

export default function CheckoutPage() {
  const checkout = useCheckout()
  return <CheckoutView {...checkout} />
}
