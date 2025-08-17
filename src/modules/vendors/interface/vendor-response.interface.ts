export interface IVendorResponse {
  user: {
    fullName: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  business: {
    type: string
    name: string
    country: string
    state: string
    address: string
  }
  store: {
    name: string
    description: string
    logo: string
  }
}
