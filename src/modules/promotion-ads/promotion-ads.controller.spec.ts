import { Test, TestingModule } from '@nestjs/testing';
import { PromotionAdsController } from './promotion-ads.controller';
import { PromotionAdsService } from './promotion-ads.service';

describe('PromotionAdsController', () => {
  let controller: PromotionAdsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionAdsController],
      providers: [PromotionAdsService],
    }).compile();

    controller = module.get<PromotionAdsController>(PromotionAdsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
