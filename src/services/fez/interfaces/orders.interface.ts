export interface CreateOrderDto {
  batchId: string // Order ID
  uniqueId: string // Order item ID

  recipientAddress: string
  recipientState: string
  recipientName: string
  recipientPhone: string
  recipientEmail: string

  custToken: string // 4-digit unique code (to be emailed)

  itemDescription: string
  valueOfItem: string // They sent as string; keep same
  weight: number

  pickUpState: string
  pickUpAddress: string
  pickUpDate: string // 2025-11-25T08 (ISO-like)

  isItemCod: boolean //cash on delivery
  cashOnDeliveryAmount?: number // Optional: only if isItemCod = true

  fragile: boolean
}

export interface CreateOrderResponse {
  status: string // e.g. "Success"
  description: string // e.g. "Order Successfully Created"
  orderNos: Record<string, string> // { uniqueId: generatedTrackingNumber }
  duplicateUniqueIds: string[] // array of IDs that already existed
}
