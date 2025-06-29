export enum ProductStatusEnum {
  draft = "draft",
  published = "published"
}

// TODO: MOVE THIS TO STORE OR AN INDEX
export enum ProductCategoriesEnum {
  clothings = "clothings",
  gadgets = "gadgets",
  groceries = "groceries",
  women = "women",
  bodyCreamAndOil = "bodyCreamAndOil",
  furniture = "furniture",
  tvAndHomeAppliances = "tvAndHomeAppliances",
  watchesAndAccessories = "watchesAndAccessories"
}

export const CategoriesArray = Object.values(ProductCategoriesEnum)
