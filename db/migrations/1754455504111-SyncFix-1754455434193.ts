import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17544554341931754455504111 implements MigrationInterface {
  name = "SyncFix17544554341931754455504111"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."business_kycstatus_enum" AS ENUM('pending', 'verified')`)
    await queryRunner.query(`ALTER TABLE "business" ADD "kycStatus" "public"."business_kycstatus_enum" NOT NULL DEFAULT 'pending'`)
    await queryRunner.query(`ALTER TABLE "store" ADD "totalStoreRatingSum" integer NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "store" ADD "totalStoreRatingCount" integer NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "ad" ALTER COLUMN "startDate" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "ad" ALTER COLUMN "endDate" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "startDate" DROP NOT NULL`)
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "endDate" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "endDate" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "subscription" ALTER COLUMN "startDate" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "ad" ALTER COLUMN "endDate" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "ad" ALTER COLUMN "startDate" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "totalStoreRatingCount"`)
    await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "totalStoreRatingSum"`)
    await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "kycStatus"`)
    await queryRunner.query(`DROP TYPE "public"."business_kycstatus_enum"`)
  }
}
