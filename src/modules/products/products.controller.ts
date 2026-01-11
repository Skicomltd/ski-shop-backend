import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Req,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Res,
  UploadedFile
} from "@nestjs/common"
import { ProductsService } from "./products.service"
import { CreateProductDto, createProductSchema } from "./dto/create-product.dto"
import { UpdateProductDto, updateProductSchema } from "./dto/update-product.dto"
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express"
import { imageFilter, memoryUpload } from "@/config/multer.config"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { Request } from "express"
import { StoreService } from "../stores/store.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { FileSystemService } from "@services/filesystem/filesystem.service"
import { FileUploadDto } from "@services/filesystem/interfaces/filesystem.interface"
import { DtoMapper } from "./interfaces/update-product-mapper.interface"
import { ProductsInterceptor } from "./interceptors/products.interceptor"
import { ProductInterceptor } from "./interceptors/product.interceptor"
import { IProductsQuery } from "./interfaces/query-filter.interface"
import { OwnProductGuard } from "./guard/ownProduct.guard"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "@services/casl/casl-ability.factory"
import { Action } from "@services/casl/actions/action"
import { Product } from "./entities/product.entity"
import { PoliciesGuard } from "../auth/guard/policies-handler.guard"
import { Public } from "../auth/decorators/public.decorator"
import { ProductCategoriesEnum } from "../common/types"
import { SaveProductDto, saveProductSchema } from "./dto/save-product.dto"
import { CsvService } from "@services/utils/csv/csv.service"
import { Response } from "express"
import { OptionalJwtGuard } from "../auth/guard/optional-jwt.guard"
import { OnEvent } from "@nestjs/event-emitter"
import { EventRegistry } from "@/events/events.registry"
import { Order } from "../orders/entities/order.entity"
import { OrderItem } from "../orders/entities/order-item.entity"
import { OrdersService } from "../orders/orders.service"
import { ReplaceImageDto, replaceImageSchema } from "./dto/replace-image.dto"
@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private storeService: StoreService,
    private fileSystem: FileSystemService,
    private dtoMapper: DtoMapper,
    private readonly csvService: CsvService,
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Product))
  @UseInterceptors(FilesInterceptor("images", 5, { ...memoryUpload, fileFilter: imageFilter }), ProductInterceptor)
  async create(
    @Body(new JoiValidationPipe(createProductSchema)) createProductDto: CreateProductDto,
    @UploadedFiles() filesUploaded: Array<CustomFile>,
    @Req() req: Request
  ) {
    // find the store
    const store = await this.storeService.findOne({ id: createProductDto.storeId })
    if (!store) throw new NotFoundException("store not found")

    // handle multiple image upload
    const handleImageUploaded = await Promise.all(
      filesUploaded.map(async (image) => {
        const fileDto: FileUploadDto = {
          destination: `images/products/${image.originalname}.${image.extension}`,
          mimetype: image.mimetype,
          buffer: image.buffer,
          filePath: image.path
        }

        const url = await this.fileSystem.upload(fileDto)
        return url
      })
    )
    const slug = createProductDto.name.toLowerCase().replace(/ /g, "_")
    // attach the arry of string
    createProductDto = { ...createProductDto, images: handleImageUploaded, slug: slug }
    const user = req.user

    return await this.productsService.create({ ...createProductDto, user: user, store: store })
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, Product))
  @Get("downloads")
  async downloads(@Query() query: IProductsQuery, @Res() res: Response) {
    const [products] = await this.productsService.find(query)

    const headers = [
      { key: "productName", header: "Product Name" },
      { key: "category", header: "Category" },
      { key: "price", header: "Price" },
      { key: "stock", header: "Stock" },
      { key: "dateAdded", header: "Date Added" }
    ]

    const records = products.map((product) => {
      return {
        productName: product.name,
        category: product.category,
        price: product.price,
        stock: product.stockCount,
        dateAdded: product.createdAt.toISOString()
      }
    })

    const data = await this.csvService.writeCsvToBuffer({ headers, records })

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=products.csv")
    res.send(data)
  }

  @Post("/saves")
  @UseInterceptors(ProductInterceptor)
  async save(@Body(new JoiValidationPipe(saveProductSchema)) saveProductDto: SaveProductDto, @Req() req: Request) {
    const user = req.user
    const product = await this.productsService.findById(saveProductDto.productId)
    if (!product) throw new NotFoundException("product not found")
    return this.productsService.save({ user, product })
  }

  @Delete("/saves/:productId")
  @UseInterceptors(ProductInterceptor)
  async unsave(@Param("productId", ParseUUIDPipe) productId: string, @Req() req: Request) {
    const user = req.user
    const product = await this.productsService.findById(productId)
    if (!product) throw new NotFoundException("product not found")
    await this.productsService.unsave({ user, product })
    return product
  }

  @Get("")
  @Public()
  @UseInterceptors(ProductsInterceptor)
  async findAll(@Query() query: IProductsQuery) {
    return await this.productsService.find(query)
  }

  @Get("/saves")
  @UseInterceptors(ProductsInterceptor)
  async saved(@Query() query: IProductsQuery, @Req() req: Request) {
    return await this.productsService.saved({ ...query, userId: req.user.id })
  }

  @Public()
  @UseGuards(OptionalJwtGuard)
  @UseInterceptors(ProductsInterceptor)
  @Get("/hand-picked")
  async handPickedProducts(@Req() req: Request) {
    const user = req.user

    // ----------------------------
    // CASE 1: Public (unauthenticated)
    // ----------------------------
    if (!user) {
      return await this.productsService.topSellingProducts({ limit: 5 })
    }

    // ----------------------------
    // CASE 2: Authenticated – personalize
    // ----------------------------
    const categoriesMap = new Map<ProductCategoriesEnum, number>()

    // get the user orders
    const [orders] = await this.ordersService.find({ buyerId: user.id })

    // count category frequency
    for (const order of orders) {
      for (const item of order.items) {
        const category = item.product.category
        categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1)
      }
    }

    // if the user has never purchased anything → fallback
    if (categoriesMap.size === 0) {
      return await this.productsService.topSellingProducts({ limit: 5 })
    }

    // sort categories by frequency, highest first
    const sortedCategories = [...categoriesMap.entries()].sort((a, b) => b[1] - a[1]).map(([cat]) => cat)

    const result: Product[] = []

    // fetch top-selling products from each category
    for (const category of sortedCategories) {
      if (result.length >= 5) break

      const [products] = await this.productsService.topSellingProducts({ limit: 1, category })

      if (products.length > 0) {
        result.push(products[0])
      }
    }

    // If we still don't have 5, fill the rest with global top sellers
    if (result.length < 5) {
      const needed = 5 - result.length
      const [globalTop] = await this.productsService.topSellingProducts({
        limit: needed
      })

      // Ensure no duplicates
      for (const product of globalTop) {
        if (!result.find((p) => p.id === product.id)) {
          result.push(product)
        }
        if (result.length >= 5) break
      }
    }

    const tp = result.slice(0, 5)

    return [tp, 5]
  }

  @Get("/categories")
  @Public()
  async categories() {
    return Object.values(ProductCategoriesEnum)
  }

  @Get(":id")
  @Public()
  @UseInterceptors(ProductInterceptor)
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.findOne({ id: id })
  }

  @Public()
  @Get("/:id/similar")
  @UseInterceptors(ProductsInterceptor)
  async getSimilarProducts(@Param("id", ParseUUIDPipe) productId: string) {
    const product = await this.productsService.findById(productId)
    return await this.productsService.getSimilarProducts(product, 5)
  }

  @Patch(":id")
  @UseGuards(OwnProductGuard)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(ProductInterceptor)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Product))
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(updateProductSchema)) updateProductDto: UpdateProductDto) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException("product not found")
    return await this.productsService.update(product, updateProductDto)
  }

  @Patch(":id/images")
  @UseGuards(OwnProductGuard)
  @UseGuards(PoliciesGuard)
  @UseInterceptors(FileInterceptor("image", { ...memoryUpload, fileFilter: imageFilter }))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, Product))
  async replaceImage(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile() image: CustomFile,
    @Body(new JoiValidationPipe(replaceImageSchema)) replaceImageDto: ReplaceImageDto
  ) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException("product not found")

    const foundImage = product.images.find((image) => image === replaceImageDto.url)
    if (!foundImage) throw new NotFoundException("image not found")

    const fileDto: FileUploadDto = {
      destination: `images/products/${image.originalname}.${image.extension}`,
      mimetype: image.mimetype,
      buffer: image.buffer,
      filePath: image.path
    }

    const newUrl = await this.fileSystem.update(foundImage, fileDto)

    const updatedImages = product.images.map((im) => {
      if (im === replaceImageDto.url) {
        return newUrl
      }

      return im
    })

    await this.productsService.update(product, { images: updatedImages })
    return updatedImages
  }

  @Delete(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Product))
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException("Product does not exist")

    await Promise.all(
      product.images.map(async (image) => {
        await this.fileSystem.delete(image)
      })
    )

    return await this.productsService.remove({ id })
  }

  @Delete(":id/images")
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, Product))
  async removeImage(@Param("id", ParseUUIDPipe) id: string, @Body(new JoiValidationPipe(replaceImageSchema)) replaceImageDto: ReplaceImageDto) {
    const product = await this.productsService.findById(id)
    if (!product) throw new NotFoundException("Product does not exist")
    const images = product.images.filter((image) => image !== replaceImageDto.url)
    await this.productsService.update(product, { images })
    await this.fileSystem.delete(replaceImageDto.url)
    return images
  }

  @OnEvent(EventRegistry.ORDER_PLACED_PAID)
  async handleIncrementOrdersUnitSold(order: Order) {
    for (const item of order.items) {
      await this.productsService.update(item.product, { unitsSold: item.product.unitsSold + item.quantity })
    }
  }

  @OnEvent(EventRegistry.ORDER_PAID_AFTER_DELIVERY)
  async handleIncrementOrderUnitSold(_order: Order, item: OrderItem) {
    await this.productsService.update(item.product, { unitsSold: item.product.unitsSold + item.quantity })
  }
}
