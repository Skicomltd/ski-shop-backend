export interface VendorPerformanceResponse {
  totalProducts: number
  totalPublishedProducts: number
  totalSales: number
  totalOrders: number
  lastOrder: {
    id: string
    date: Date
    totalAmount: number
  } | null
  averageOrderValue: number
}
