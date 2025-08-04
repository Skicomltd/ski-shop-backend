import { Test, TestingModule } from "@nestjs/testing"
import { RevenuesController } from "./revenues.controller"
import { RevenuesService } from "./revenues.service"

describe("RevenueController", () => {
  let controller: RevenuesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenuesController],
      providers: [RevenuesService]
    }).compile()

    controller = module.get<RevenuesController>(RevenuesController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })
})
