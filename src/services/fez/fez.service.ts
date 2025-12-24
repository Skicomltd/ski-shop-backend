import { HttpService } from "@nestjs/axios"
import { HttpException, Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  CreateOrderDto,
  CreateOrderResponse,
  DeliveryCostResponse,
  DeliveryDetails,
  DeliveryHistory,
  EstimateDelivery,
  EstimateDeliveryResponse,
  GetOrderResponse,
  OrderDetail,
  TrackOrderResponse
} from "./interfaces/orders.interface"
import { AuthToken, LoginResponse } from "./interfaces/auth.interface"
import { FEZ_CONFIG_OPTIONS } from "./entities/config"
import { FezModuleOptions } from "./interfaces/config.interface"
import { CacheManagerService } from "../cachemanager/cacheManager.service"

type Token = {
  token: string
  expiresAt: number
}

@Injectable()
export class FezService {
  private url: string
  private secret: string
  private userId: string
  private password: string
  private readonly TOKEN_CACHE_KEY = "fez:auth:token"

  constructor(
    public readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(FEZ_CONFIG_OPTIONS)
    protected config: FezModuleOptions,
    private readonly cacheManager: CacheManagerService
  ) {
    this.url = config.url
    this.secret = config.secret
    this.userId = config.userId
    this.password = config.password
  }

  public async createOrder(data: CreateOrderDto): Promise<CreateOrderResponse> {
    const headers = await this.getHeaders()

    // eslint-disable-next-line no-console
    console.log("headers", headers)

    try {
      const response = await this.httpService.axiosRef.post<CreateOrderResponse>(`${this.url}/order`, { ...data }, { headers })
      return response.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("create order error: ", error)
      throw new HttpException(error.message, 500)
    }
  }

  public async getOrder(orderNo: string): Promise<OrderDetail> {
    const headers = await this.getHeaders()

    try {
      const response = await this.httpService.axiosRef.get<GetOrderResponse>(`${this.url}/orders/${orderNo}`, { headers })
      return response.data.orderDetails.find((i) => i.orderNo === orderNo)
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  public async trackOrder(orderNo: string): Promise<DeliveryHistory[]> {
    const headers = await this.getHeaders()

    try {
      const response = await this.httpService.axiosRef.get<TrackOrderResponse>(`${this.url}/order/track/${orderNo}`, { headers })
      return response.data.history
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  public getStates(): string[] {
    return this.states
  }

  public async getDeliveryCost(data: DeliveryDetails): Promise<number> {
    const headers = await this.getHeaders()

    try {
      const response = await this.httpService.axiosRef.post<DeliveryCostResponse>(`${this.url}/order/cost`, data, { headers })
      return response.data.Cost.cost
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  public async getDeliveryDateEstimate(data: EstimateDelivery): Promise<string> {
    const headers = await this.getHeaders()

    try {
      const response = await this.httpService.axiosRef.post<EstimateDeliveryResponse>(`${this.url}/delivery-time-estimate`, data, { headers })
      return response.data.data.eta
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
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
    const cachedToken = await this.cacheManager.get<Token>(this.TOKEN_CACHE_KEY)
    // eslint-disable-next-line no-console
    console.log("cached Token: ", cachedToken)
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      return cachedToken.token
    }

    try {
      const response = await this.httpService.axiosRef.post<LoginResponse>(`${this.url}/user/authenticate`, {
        user_id: this.userId,
        password: this.password
      })

      this.setToken(response.data.authDetails)
      return response.data.authDetails.authToken
    } catch (error) {
      throw new HttpException(error.message, 500)
    }
  }

  private async setToken(token: AuthToken): Promise<void> {
    const expiresAt = new Date(token.expireToken).getTime()
    const tokenData: Token = {
      token: token.authToken,
      expiresAt
    }

    // Calculate TTL in seconds (time until expiration)
    const ttl = Math.floor((expiresAt - Date.now()) / 1000)

    // Store token in cache with TTL
    await this.cacheManager.set(this.TOKEN_CACHE_KEY, tokenData, ttl)
  }

  private states = [
    "Kano",
    "Lagos",
    "Kaduna",
    "Katsina",
    "Oyo",
    "Rivers",
    "Bauchi",
    "Jigawa",
    "Benue",
    "Anambra",
    "Borno",
    "Delta",
    "Imo",
    "Niger",
    "Akwa Ibom",
    "Ogun",
    "Sokoto",
    "Ondo",
    "Osun",
    "Kogi",
    "Zamfara",
    "Enugu",
    "Kebbi",
    "Edo",
    "Plateau",
    "Adamawa",
    "Cross River",
    "Abia",
    "Ekiti",
    "Kwara",
    "Gombe",
    "Yobe",
    "Taraba",
    "Ebonyi",
    "Nasarawa",
    "Bayelsa",
    "FCT"
  ]
}
