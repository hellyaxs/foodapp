'use client'

import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import { CouponSection } from './coupon/CouponSection'
import type { UseCheckoutResult } from './useCheckout'

export function CheckoutView(props: UseCheckoutResult) {
  const {
    isEmpty,
    items,
    form,
    handleChange,
    subtotalCents,
    coupon,
    submit,
    loading,
    error,
  } = props

  if (isEmpty) {
    return (
      <div className="cart-empty">
        <p>Seu carrinho está vazio.</p>
        <Link href="/">
          <button type="button" className="btn-secondary">
            Ver cardápio
          </button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={submit}>
        <div className="checkout-grid">
          <div className="checkout-column">
            <div className="form-card">
              <h2>Dados do cliente</h2>

              <div className="form-group">
                <label htmlFor="customerName">Nome completo</label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Seu nome"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Endereço de entrega</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-card">
              <h2>Pagamento</h2>

              <div className="form-group">
                <label htmlFor="paymentMethod">Forma de pagamento</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="pix">PIX (aprovação imediata)</option>
                  <option value="credit_card">Cartão de crédito</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="form-alert form-alert--error" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="order-summary-card">
            <h2>Resumo do pedido</h2>

            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="summary-item">
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-qty">x{item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}

            <hr className="summary-divider" />

            <CouponSection
              couponDraft={coupon.couponDraft}
              onCouponDraftChange={coupon.onCouponDraftChange}
              appliedCouponNormalized={coupon.appliedCouponNormalized}
              couponError={coupon.couponError}
              applyCoupon={coupon.applyCoupon}
              removeCoupon={coupon.removeCoupon}
              loading={loading}
            />

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalCents)}</span>
            </div>
            {coupon.discountCents > 0 && (
              <div className="cart-summary-row">
                <span>Desconto</span>
                <span>− {formatCurrency(coupon.discountCents)}</span>
              </div>
            )}
            <div className="cart-summary-row">
              <span>Entrega</span>
              <span>Grátis</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span>Total</span>
              <span>{formatCurrency(coupon.checkoutTotal)}</span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processando...' : 'Finalizar pedido'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
