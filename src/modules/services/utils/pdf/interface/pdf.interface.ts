export interface PdfInterface {
  profile: {
    storeName: string
    email: string
    phoneNumber: string
    kycStatus: string
    subscriptionStatus: string
    dateJoined: Date
    orders: number
  }
  business: {
    businessName: string
    CacRegNo: string
    kycType: string
    kycIdentificationNumber: string
  }
  subscription: {
    status: string
    planType: string
    paymentStatus: string
    startDate: Date
    endDate: Date
  }
  product: {
    totalProduct: number
    totalPublishedProduct: number
    totalSales: number
    averageNumberOfOrder: number
    totalOrders: number
  }
  payout: {
    walletBalance: number
    totalWithdrawal: number
    pendingWithdrawal: number
    lastPayout: Date
  }
  orders: {
    id: string
    dateOrdered: Date
    buyerName: string
    totalAmount: number
    status: string
  }[]
}
