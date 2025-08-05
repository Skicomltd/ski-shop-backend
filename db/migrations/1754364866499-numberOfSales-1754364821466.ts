import { MigrationInterface, QueryRunner } from "typeorm"

export class NumberOfSales17543648214661754364866499 implements MigrationInterface {
  name = "NumberOfSales17543648214661754364866499"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "store" ADD "numberOfSales" integer NOT NULL DEFAULT '0'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "numberOfSales"`)
  }
}
