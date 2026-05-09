/** Cupons suportados: códigos após trim + toUpperCase. Valores monetários em centavos. */

export const COUPON_BEMVINDO10 = 'BEMVINDO10'
export const COUPON_FRETE20 = 'FRETE20'

const FIXED_FRETE20_CENTS = 2000 // R$ 20,00

export type CouponResult =
  | { ok: true; normalizedCode: string; discountCents: number }
  | { ok: false; error: string }

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase()
}

function capDiscountToSubtotal(
  calculatedCents: number,
  subtotalCents: number
): number {
  const raw = Number.isFinite(calculatedCents) ? Math.floor(calculatedCents) : 0
  const sub = Math.max(0, Math.floor(subtotalCents))
  return Math.min(Math.max(raw, 0), sub)
}

/** Desconto em centavos já limitado ao subtotal (nunca negativo nem acima do subtotal). */
export function evaluateCoupon(
  code: string,
  subtotalCents: number
): CouponResult {
  const normalized = normalizeCouponCode(code)
  if (!normalized) {
    return { ok: false, error: 'Informe um cupom.' }
  }

  const sub = Math.max(0, Math.floor(subtotalCents))

  switch (normalized) {
    case COUPON_BEMVINDO10: {
      const discountCents = capDiscountToSubtotal(
        sub * 0.1,
        sub
      )
      return {
        ok: true,
        normalizedCode: normalized,
        discountCents,
      }
    }
    case COUPON_FRETE20: {
      const discountCents = capDiscountToSubtotal(FIXED_FRETE20_CENTS, sub)
      return {
        ok: true,
        normalizedCode: normalized,
        discountCents,
      }
    }
    default:
      return { ok: false, error: 'Cupom inválido.' }
  }
}

/** Total final em centavos após aplicar um desconto já limitado ao subtotal. */
export function finalTotalAfterDiscount(
  subtotalCents: number,
  discountCents: number
): number {
  const sub = Math.max(0, Math.floor(subtotalCents))
  const disc = Math.min(
    Math.max(0, Math.floor(discountCents)),
    sub
  )
  return Math.max(0, sub - disc)
}
