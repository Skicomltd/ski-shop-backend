import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from "@nestjs/common"
import { ReviewsService } from "./reviews.service"
import { CreateReviewDto, CreateReviewSchema } from "./dto/create-review.dto"
import { UpdateReviewDto, UpdateReviewSchema } from "./dto/update-review.dto"
import { IReviewQuery } from "./interface/review-query-filter"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { ReviewsInterceptor } from "./interceptor/reviews.interceptor"
import { ReviewInterceptor } from "./interceptor/review.interceptor"
import { ProductsService } from "../products/products.service"
import { UserService } from "../users/user.service"
import { NotFoundException } from "@/exceptions/notfound.exception"

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private productService: ProductsService,
    private userService: UserService
  ) {}

  @Post()
  async create(@Body(new JoiValidationPipe(CreateReviewSchema)) createReviewDto: CreateReviewDto) {
    const user = await this.userService.findOne({ id: createReviewDto.reviewerId })
    if (!user) throw new NotFoundException("User not found")

    const product = await this.productService.findOne({ id: createReviewDto.productId })

    if (!product) throw new NotFoundException("Product does not exist")

    createReviewDto.product = product
    createReviewDto.user = user

    return await this.reviewsService.create(createReviewDto)
  }

  @UseInterceptors(ReviewsInterceptor)
  @Get()
  async findAll(@Query() query: IReviewQuery) {
    return await this.reviewsService.find(query)
  }

  @UseInterceptors(ReviewInterceptor)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.reviewsService.findOne({ id })
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(UpdateReviewSchema)) updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsService.findById(id)

    if (!review) throw new NotFoundException("Review not found")

    return await this.reviewsService.update(review, updateReviewDto)
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.reviewsService.remove({ id })
  }
}
