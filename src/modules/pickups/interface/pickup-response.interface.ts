import { pickup_status } from "./pickup-status.interface"

export interface IPickupResponse {
  id: string
  name: string
  contactPerson: string
  address: string
  state: string
  phoneNumber: string
  status: pickup_status
}
