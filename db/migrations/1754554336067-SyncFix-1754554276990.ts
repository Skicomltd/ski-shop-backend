import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17545542769901754554336067 implements MigrationInterface {
  name = "SyncFix17545542769901754554336067"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "withdrawal" ADD "currentWalletBalance" double precision NOT NULL`)
    await queryRunner.query(`ALTER TYPE "public"."withdrawal_status_enum" RENAME TO "withdrawal_status_enum_old"`)
    await queryRunner.query(`CREATE TYPE "public"."withdrawal_status_enum" AS ENUM('success', 'pending', 'failed', 'rejected')`)
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "status" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ALTER COLUMN "status" TYPE "public"."withdrawal_status_enum" USING "status"::"text"::"public"."withdrawal_status_enum"`
    )
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "status" SET DEFAULT 'pending'`)
    await queryRunner.query(`DROP TYPE "public"."withdrawal_status_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."withdrawal_status_enum_old" AS ENUM('success', 'pending', 'failed')`)
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "status" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ALTER COLUMN "status" TYPE "public"."withdrawal_status_enum_old" USING "status"::"text"::"public"."withdrawal_status_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "status" SET DEFAULT 'pending'`)
    await queryRunner.query(`DROP TYPE "public"."withdrawal_status_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."withdrawal_status_enum_old" RENAME TO "withdrawal_status_enum"`)
    await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "currentWalletBalance"`)
  }
}
