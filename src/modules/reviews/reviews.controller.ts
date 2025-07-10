import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common"
import { ReviewsService } from "./reviews.service"
import { CreateReviewDto, CreateReviewSchema } from "./dto/create-review.dto"
import { UpdateReviewDto, UpdateReviewSchema } from "./dto/update-review.dto"
import { IReviewQuery } from "./interface/review-query-filter"
import { JoiValidationPipe } from "@/validations/joi.validation"

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body(new JoiValidationPipe(CreateReviewSchema)) createReviewDto: CreateReviewDto) {
    return await this.reviewsService.create(createReviewDto)
  }

  @Get()
  async findAll(@Query() query: IReviewQuery) {
    return await this.reviewsService.find(query)
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.reviewsService.findOne({ id })
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(UpdateReviewSchema)) updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsService.findById(id)
    return this.reviewsService.update(review, updateReviewDto)
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.reviewsService.remove({ id })
  }
}
