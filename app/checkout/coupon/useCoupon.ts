'use client'

import { useMemo, useState } from 'react'
import { evaluateCoupon, finalTotalAfterDiscount } from '@/utils/coupon'

export interface UseCouponResult {
  couponDraft: string
  onCouponDraftChange: (value: string) => void
  appliedCouponNormalized: string | null
  couponError: string | null
  applyCoupon: () => void
  removeCoupon: () => void
  discountCents: number
  checkoutTotal: number
}

export function useCoupon(subtotalCents: number): UseCouponResult {
  const [couponDraft, setCouponDraft] = useState('')
  const [appliedCouponNormalized, setAppliedCouponNormalized] = useState<
    string | null
  >(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const discountCents = useMemo(() => {
    if (!appliedCouponNormalized) return 0
    const appliedResult = evaluateCoupon(appliedCouponNormalized, subtotalCents)
    return appliedResult.ok ? appliedResult.discountCents : 0
  }, [appliedCouponNormalized, subtotalCents])

  const checkoutTotal = useMemo(
    () => finalTotalAfterDiscount(subtotalCents, discountCents),
    [subtotalCents, discountCents]
  )

  const onCouponDraftChange = (value: string) => {
    setCouponDraft(value)
    setCouponError(null)
  }

  const applyCoupon = () => {
    setCouponError(null)
    const result = evaluateCoupon(couponDraft, subtotalCents)
    if (result.ok) {
      setAppliedCouponNormalized(result.normalizedCode)
      setCouponDraft(result.normalizedCode)
      return
    }
    setAppliedCouponNormalized(null)
    setCouponError(result.error)
  }

  const removeCoupon = () => {
    setAppliedCouponNormalized(null)
    setCouponError(null)
  }

  return {
    couponDraft,
    onCouponDraftChange,
    appliedCouponNormalized,
    couponError,
    applyCoupon,
    removeCoupon,
    discountCents,
    checkoutTotal,
  }
}
