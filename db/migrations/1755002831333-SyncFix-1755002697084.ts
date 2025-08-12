import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17550026970841755002831333 implements MigrationInterface {
  name = "SyncFix17550026970841755002831333"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."coupon_coupontype_enum" AS ENUM('discount', 'amount')`)
    await queryRunner.query(
      `CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying(50) NOT NULL, "quantity" integer NOT NULL, "remainingQuantity" integer NOT NULL, "couponType" "public"."coupon_coupontype_enum" NOT NULL DEFAULT 'amount', "value" numeric(10,2) NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "coupon"`)
    await queryRunner.query(`DROP TYPE "public"."coupon_coupontype_enum"`)
  }
}
