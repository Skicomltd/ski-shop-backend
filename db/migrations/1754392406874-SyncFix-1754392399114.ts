import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17543923991141754392406874 implements MigrationInterface {
  name = "SyncFix17543923991141754392406874"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ad" ADD "amount" integer NOT NULL`)
    await queryRunner.query(`ALTER TABLE "subscription" ADD "isPaid" boolean NOT NULL DEFAULT false`)
    await queryRunner.query(`ALTER TABLE "subscription" ADD "amount" integer NOT NULL`)
    await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`)
    await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('customer', 'vendor', 'admin', 'rider')`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'customer'`)
    await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('customer', 'vendor', 'admin')`)
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`
    )
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'customer'`)
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
    await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`)
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "amount"`)
    await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "isPaid"`)
    await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "amount"`)
  }
}
