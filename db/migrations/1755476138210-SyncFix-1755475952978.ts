import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17554759529781755476138210 implements MigrationInterface {
  name = "SyncFix17554759529781755476138210"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "totalProductRatingSum"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "totalProductRatingCount"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD "totalProductRatingCount" integer NOT NULL DEFAULT '0'`)
    await queryRunner.query(`ALTER TABLE "product" ADD "totalProductRatingSum" integer NOT NULL DEFAULT '0'`)
  }
}
