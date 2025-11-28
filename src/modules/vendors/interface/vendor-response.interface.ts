import { KYC_ENUM_STATUS } from "@/modules/business/enum/kyc-status-enum"

export interface IVendorResponse {
  user: {
    id: string
    fullName: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    createdAt: string
  }
  business: {
    id: string
    type: string
    name: string
    country: string
    state: string
    address: string
    kycStatus: KYC_ENUM_STATUS
  }
  store: {
    id: string
    name: string
    description: string
    logo: string
    isStarSeller: boolean
  }
}
