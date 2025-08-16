import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17553313982931755331503446 implements MigrationInterface {
  name = "SyncFix17553313982931755331503446"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."voucher_status_enum" AS ENUM('pending', 'redeemed', 'expired')`)
    await queryRunner.query(`CREATE TYPE "public"."voucher_prizetype_enum" AS ENUM('discount', 'amount')`)
    await queryRunner.query(
      `CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'pending', "code" character varying NOT NULL, "dateWon" TIMESTAMP NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "prizeWon" numeric(10,2) NOT NULL, "prizeType" "public"."voucher_prizetype_enum" NOT NULL DEFAULT 'amount', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`CREATE TYPE "public"."coupon_coupontype_enum" AS ENUM('discount', 'amount')`)
    await queryRunner.query(
      `CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying(50) NOT NULL, "quantity" integer NOT NULL, "remainingQuantity" integer NOT NULL, "couponType" "public"."coupon_coupontype_enum" NOT NULL DEFAULT 'amount', "value" numeric(10,2) NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "ad" ADD "reference" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "voucher" ADD CONSTRAINT "FK_80a57d757e0be8225f261c7994f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_80a57d757e0be8225f261c7994f"`)
    await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "reference"`)
    await queryRunner.query(`DROP TABLE "coupon"`)
    await queryRunner.query(`DROP TYPE "public"."coupon_coupontype_enum"`)
    await queryRunner.query(`DROP TABLE "voucher"`)
    await queryRunner.query(`DROP TYPE "public"."voucher_prizetype_enum"`)
    await queryRunner.query(`DROP TYPE "public"."voucher_status_enum"`)
  }
}
