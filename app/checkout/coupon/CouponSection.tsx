'use client'

import type { UseCouponResult } from './useCoupon'

type CouponSectionProps = Pick<
  UseCouponResult,
  | 'couponDraft'
  | 'onCouponDraftChange'
  | 'appliedCouponNormalized'
  | 'couponError'
  | 'applyCoupon'
  | 'removeCoupon'
> & { loading: boolean }

export function CouponSection({
  couponDraft,
  onCouponDraftChange,
  appliedCouponNormalized,
  couponError,
  applyCoupon,
  removeCoupon,
  loading,
}: CouponSectionProps) {
  return (
    <div className="form-group checkout-coupon-group">
      <label htmlFor="coupon">Cupom de desconto</label>
      <div className="checkout-coupon-row">
        <input
          id="coupon"
          name="coupon"
          type="text"
          autoComplete="off"
          placeholder="Ex.: BEMVINDO10"
          value={couponDraft}
          onChange={e => onCouponDraftChange(e.target.value)}
          className="checkout-coupon-input"
        />
        <button
          type="button"
          className="btn-secondary"
          onClick={applyCoupon}
          disabled={loading}
        >
          Aplicar
        </button>
      </div>
      {appliedCouponNormalized && (
        <p className="checkout-coupon-applied">
          Cupom aplicado: <strong>{appliedCouponNormalized}</strong>
          {' · '}
          <button
            type="button"
            className="btn-secondary btn-secondary--compact"
            onClick={removeCoupon}
            disabled={loading}
          >
            Remover
          </button>
        </p>
      )}
      {couponError && <p className="coupon-error-text">{couponError}</p>}
    </div>
  )
}
