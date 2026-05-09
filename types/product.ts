export interface Product {
  id: string
  name: string
  description: string
  price: number // in cents (e.g., 2490 = R$24,90)
  category: string
  emoji: string
}
