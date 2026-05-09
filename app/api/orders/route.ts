import { NextRequest, NextResponse } from 'next/server'
import { CreateOrderPayload, Order } from '@/types'

// In-memory store (resets on server restart — intentional for this exercise)
const orders: Order[] = []

export async function POST(request: NextRequest) {
  const body: CreateOrderPayload = await request.json()

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
  }

  if (!body.customerName?.trim()) {
    return NextResponse.json({ error: 'Nome do cliente é obrigatório' }, { status: 400 })
  }

  if (!body.address?.trim()) {
    return NextResponse.json({ error: 'Endereço é obrigatório' }, { status: 400 })
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 600))

  const order: Order = {
    id: `ORD-${Date.now()}`,
    items: body.items,
    subtotal: body.subtotal,
    discount: body.discount,
    total: body.total,
    couponCode: body.couponCode ?? null,
    customerName: body.customerName,
    address: body.address,
    paymentMethod: body.paymentMethod,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  orders.push(order)

  return NextResponse.json(order, { status: 201 })
}

export async function GET() {
  return NextResponse.json(orders)
}
