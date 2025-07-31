import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17539770205881753977097754 implements MigrationInterface {
    name = 'SyncFix17539770205881753977097754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "interval"`);
        await queryRunner.query(`CREATE TYPE "public"."plan_interval_enum" AS ENUM('hourly', 'daily', 'monthly', 'biannually', 'annually')`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "interval" "public"."plan_interval_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "interval"`);
        await queryRunner.query(`DROP TYPE "public"."plan_interval_enum"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "interval" character varying NOT NULL`);
    }

}
