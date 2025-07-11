import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from "@nestjs/common"
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
import { PolicyReviewGuard } from "../auth/guard/policy-review.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { Review } from "./entities/review.entity"

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private productService: ProductsService,
    private userService: UserService
  ) {}

  @UseGuards(PolicyReviewGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Review))
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
  @UseGuards(PolicyReviewGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Review))
  @Get()
  async findAll(@Query() query: IReviewQuery) {
    return await this.reviewsService.find(query)
  }

  @UseInterceptors(ReviewInterceptor)
  @UseGuards(PolicyReviewGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Review))
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.reviewsService.findOne({ id })
  }

  @UseGuards(PolicyReviewGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Review))
  @Patch(":id")
  async update(@Param("id") id: string, @Body(new JoiValidationPipe(UpdateReviewSchema)) updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsService.findById(id)

    if (!review) throw new NotFoundException("Review not found")

    return await this.reviewsService.update(review, updateReviewDto)
  }

  @UseGuards(PolicyReviewGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Review))
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.reviewsService.remove({ id })
  }
}
