export interface MonthlySalesData {
  year: number
  month: number
  total: number
}

export interface MonthlySalesQuery {
  startDate: Date
  endDate: Date
  status: string
}
