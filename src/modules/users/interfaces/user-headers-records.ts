export interface HeadersRecordsInterface {
  headers: {
    key: string
    header: string
  }[]
  records: {
    name: string
    phoneNumber: string
    emailAddress: string
    orders: number
  }[]
}
