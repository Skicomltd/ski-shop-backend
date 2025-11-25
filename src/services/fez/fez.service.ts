import { HttpService } from "@nestjs/axios"
import { HttpException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CreateOrderDto, CreateOrderResponse } from "./interfaces/orders.interface"

type Token = {
  token: string
  expiresAt: number
}

@Injectable()
export class FezService {
  private url: string
  private ttl = 175 // mins
  private secret: string
  private token: Token
  private userId: string
  private password: string

  constructor(
    public readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  public createOrder(data: CreateOrderDto): CreateOrderResponse {
    // url = /order
  }

  private async getHeaders() {
    const token = await this.getToken()

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "secret-key": this.secret
    }
  }

  private async getToken(): Promise<string> {
    if (this.token.expiresAt > Date.now()) return this.token.token

    try {
      const response = await this.httpService.axiosRef.post(`${this.url}/user/authenticate`, {
        user_id: this.userId,
        password: this.password
      })
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
    return ""
  }

  private setToken(token: string) {
   
  }
}
