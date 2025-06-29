import { ProductCategoriesEnum, ProductStatusEnum } from "@/modules/common/types"

export interface IProductResponse {
  id: string
  name: string
  categories: ProductCategoriesEnum[]
  description: string
  price: number
  slug: string
  discountPrice: number
  stockCount: number
  images: string[]
  status: ProductStatusEnum
  store: IdName
  user: IdName
  createdAt: Date
  updateAt: Date
}
