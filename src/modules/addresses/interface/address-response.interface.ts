import { address_status } from "./address-status.interface"

export interface IAddressResponse {
    id: string
    name: string
    address: string
    city: string
    state: string
    phoneNumber: string
    status: address_status
}