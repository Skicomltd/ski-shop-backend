import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17630517034461763051719165 implements MigrationInterface {
  name = "SyncFix17630517034461763051719165"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."pickup_status_enum" AS ENUM('active', 'inactive')`)
    await queryRunner.query(
      `CREATE TABLE "pickup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "contactPerson" character varying NOT NULL, "address" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "status" "public"."pickup_status_enum" NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c432b21125ffd974cd0b1624f04" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "pickup"`)
    await queryRunner.query(`DROP TYPE "public"."pickup_status_enum"`)
  }
}
