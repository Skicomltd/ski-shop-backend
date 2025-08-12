import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17549961071031754996372308 implements MigrationInterface {
  name = "SyncFix17549961071031754996372308"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order" ADD "reference" text NOT NULL DEFAULT ''`)
    await queryRunner.query(`ALTER TABLE "user" ADD "address" text NOT NULL DEFAULT ''`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "reference"`)
  }
}
