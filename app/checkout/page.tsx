'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/utils/format'
import { PaymentMethod } from '@/types'

interface CheckoutForm {
  customerName: string
  address: string
  paymentMethod: PaymentMethod
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    address: '',
    paymentMethod: 'pix',
  })

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Seu carrinho está vazio.</p>
        <Link href="/">
          <button className="btn-secondary">Ver cardápio</button>
        </Link>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, subtotal: total, total, ...form }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? 'Erro ao processar pedido')
      }

      const order = await response.json()
      router.push(`/order-success?id=${order.id}`)
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Customer data */}
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

            {/* Payment */}
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
              <div
                style={{
                  background: 'var(--error-bg)',
                  color: 'var(--error)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Order summary */}
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

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Entrega</span>
              <span>Grátis</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
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
