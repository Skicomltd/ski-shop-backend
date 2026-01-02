import { MigrationInterface, QueryRunner } from "typeorm"

export class CategoriesChange17673390171721767339052366 implements MigrationInterface {
  name = "CategoriesChange17673390171721767339052366"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."product_category_enum" RENAME TO "product_category_enum_old"`)
    await queryRunner.query(
      `CREATE TYPE "public"."product_category_enum" AS ENUM('Sales / Hot Deals', 'Gold Finds', 'Luxury', 'Bottega', 'Perfume & Oils', 'Sequoia (Bath & Body)', 'Gym/Fitness', 'Furniture / Home Decor', 'Kitchen', 'Gadgets', 'Men''s Fashion', 'Women''s Fashion', 'Basics', 'Jewelry', 'Art', 'Kids', 'Tools and Kits', 'Hair & Cosmetics', 'Appliances', 'Computer / Gaming', 'Watch & Accessories', 'Educational', 'Pet Supplies', 'Toys', 'Automobiles / Parts')`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "category" TYPE "public"."product_category_enum" USING "category"::"text"::"public"."product_category_enum"`
    )
    await queryRunner.query(`DROP TYPE "public"."product_category_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."product_category_enum_old" AS ENUM('clothings', 'gadgets', 'groceries', 'women', 'bodyCreamAndOil', 'furniture', 'tvAndHomeAppliances', 'watchesAndAccessories')`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "category" TYPE "public"."product_category_enum_old" USING "category"::"text"::"public"."product_category_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "public"."product_category_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."product_category_enum_old" RENAME TO "product_category_enum"`)
  }
}
