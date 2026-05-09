import type { CreateOrderPayload, Order } from '@/types'

/** Lê mensagem de erro quando a resposta não é 2xx; tolera corpo vazio ou não-JSON. */
export async function readErrorFromResponse(
  response: Response
): Promise<string> {
  try {
    const text = await response.text()
    if (!text.trim()) {
      return response.statusText || `Erro HTTP ${response.status}`
    }
    try {
      const data: unknown = JSON.parse(text)
      if (
        data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof (data as { error: unknown }).error === 'string'
      ) {
        return (data as { error: string }).error
      }
    } catch {
      // corpo não é JSON
    }
    return text.length > 200 ? `${text.slice(0, 200)}…` : text
  } catch {
    return response.statusText || 'Erro na comunicação com o servidor'
  }
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<Order> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await readErrorFromResponse(response)
    throw new Error(message || 'Erro ao processar pedido')
  }

  return response.json() as Promise<Order>
}
