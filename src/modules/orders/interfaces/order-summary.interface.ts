export interface OrderSummaryData {
  order: {
    id: string
    dateTime: Date
    totalAmount: number
    paymentStatus: string
  }
  products: Array<{
    name: string
    quantity: number
    price: number
    buyer: string
  }>
}
