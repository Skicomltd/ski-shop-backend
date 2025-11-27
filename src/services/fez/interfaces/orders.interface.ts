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

export type OrderDetail = {
  id: 25026
  clientAddress: string // Pick up address
  orderNo: string
  delivery_OTP: string
  pickUpDate: string | null
  quantity: number | null
  dispatchDate: string | null
  recipientName: string
  recipientAddress: string
  recipientEmail: string
  recipient_phone: string
  recipientPhone: string
  itemDescription: string
  statusDescription: string | null
  orderStatus: OrderStatus
  deliveryDate: string
  paymentMode: null | string
  paymentStatus: string
  cost: number
  dropZoneName: string
  returnReason: null | string
  returnDate: string
  recievedBySignature: null | string
  additionalNote: null | string
  orderVerified: string
  thirdparty: string
  thirdparty_sendersName: null | string
  thirdparty_sendersPhone: null | string
  recipientState: string
  created_at: string
  recipientAlternatePhone: null | string
  createdBy: string
  OrgRep: string
  orderDate: string
  weight: string
  sub_organization_id: null | string
  manifest: {
    orderNo: string
    requestType: string
    pickUpState: string
    dropOffState: string
    pickUpZone: string
    dropOffZone: string
    displayZone: boolean
    PickUpHub: string
    DropOffHub: string
    recipientName: string
    recipientPhone: string
    recipientAddress: string
    description: string
    sendersName: string
    fragile: boolean
  }
  currency: "NGN"
  currencySymbol: "₦"
  is_item_cod: 1 | 0
  cod_amount: number
  insured: boolean
}

export interface GetOrderResponse {
  status: string
  description: string
  orderDetails: OrderDetail[]
}

export type OrderStatus =
  | "Pending Pick-Up"
  | "Assigned To A Rider"
  | "Picked-Up"
  | "Enroute To Last Mile Hub"
  | "Accepted At Last Mile Hub"
  | "Dispatched"
  | "Delivered"

export interface DeliveryDetails {
  state: string // Destination state
  pickUpState: string
  weight: number
}

export interface DeliveryCostResponse {
  status: string
  description: string
  Cost: {
    state: string
    cost: number
  }
}

export interface TrackOrderResponse {
  status: string
  description: string
  order: {
    orderNo: string
    orderStatus: OrderStatus
    recipientAddress: string
    recipientName: string
    senderAddress: string
    senderName: string
    recipientState: string
    createdAt: "2025-11-22 03:57:32"
    proofOfDelivery: null | string
    insured: boolean
  }
  history: DeliveryHistory[]
}

export interface DeliveryHistory {
  orderStatus: OrderStatus
  statusCreationDate: string
  statusDescription: string
}

export interface EstimateDelivery {
  delivery_type: "local" | "export" | "import"
  pick_up_state: string
  drop_off_state: string
}

export interface EstimateDeliveryResponse {
  status: "Success"
  description: "Request successful"
  data: {
    eta: "3 - 5 day(s)"
  }
}
