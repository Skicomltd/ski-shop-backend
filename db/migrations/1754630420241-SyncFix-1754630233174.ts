import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17546302331741754630420241 implements MigrationInterface {
    name = 'SyncFix17546302331741754630420241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'inactive'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    }

}
