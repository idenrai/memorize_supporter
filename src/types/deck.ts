export type Deck = {
  id: string
  title: string
  description?: string | null
  type: string
  series: string | null
  _count: { cards: number }
  createdAt: Date
  isLocal?: boolean
}

