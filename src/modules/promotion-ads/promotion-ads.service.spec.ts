import { Test, TestingModule } from "@nestjs/testing"
import { PromotionAdsService } from "./promotion-ads.service"

describe("PromotionAdsService", () => {
  let service: PromotionAdsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromotionAdsService]
    }).compile()

    service = module.get<PromotionAdsService>(PromotionAdsService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })
})
