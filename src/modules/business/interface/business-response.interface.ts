export interface IBusinessResponse {
  id: string
  type: string
  name: string
  businessRegNumber: string
  contactNumber: string
  address: string
  country: string
  state: string
  kycVerificationType: string
  identificationNumber: string
  createdAt: Date
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  store: {
    id: string
    name: string
  }
}
