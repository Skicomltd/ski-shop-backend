export enum ProductStatusEnum {
  draft = "draft",
  published = "published"
}

export enum ProductCategoriesEnum {
  SalesHotDeals = "Sales / Hot Deals",
  GoldFinds = "Gold Finds",
  Luxury = "Luxury",
  Bottega = "Bottega",
  PerfumeAndOils = "Perfume & Oils",
  SequoiaBathAndBody = "Sequoia (Bath & Body)",
  GymFitness = "Gym/Fitness",
  FurnitureHomeDecor = "Furniture / Home Decor",
  Kitchen = "Kitchen",
  Gadgets = "Gadgets",
  MensFashion = "Men's Fashion",
  WomensFashion = "Women's Fashion",
  Basics = "Basics",
  Jewelry = "Jewelry",
  Art = "Art",
  Kids = "Kids",
  ToolsAndKits = "Tools and Kits",
  HairAndCosmetics = "Hair & Cosmetics",
  Appliances = "Appliances",
  ComputerGaming = "Computer / Gaming",
  WatchAndAccessories = "Watch & Accessories",
  Educational = "Educational",
  PetSupplies = "Pet Supplies",
  Toys = "Toys",
  AutomobilesAndParts = "Automobiles / Parts"
}

export const CategoriesArray = Object.values(ProductCategoriesEnum)

export const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
