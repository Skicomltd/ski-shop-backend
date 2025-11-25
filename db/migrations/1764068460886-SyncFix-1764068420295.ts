import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17640684202951764068460886 implements MigrationInterface {
    name = 'SyncFix17640684202951764068460886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."address_status_enum"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "status" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."address_status_enum" AS ENUM('default', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "address" ADD "status" "public"."address_status_enum" NOT NULL DEFAULT 'default'`);
    }

}
