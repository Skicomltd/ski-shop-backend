export interface HeadersRecordsInterface {
  headers: Header[]
  records: Record[]
}

type Header = {
  key: string
  header: string
}

type Record = {
  name: string
  phoneNumber: string
  emailAddress: string
  orders: number
}
