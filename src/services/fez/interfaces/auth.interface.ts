export type LoginResponse = {
  authDetails: AuthToken
  states: string[]
}

export type AuthToken = {
  authToken: string
  expireToken: string
}
