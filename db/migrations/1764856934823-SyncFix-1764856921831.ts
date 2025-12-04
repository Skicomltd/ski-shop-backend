import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17648569218311764856934823 implements MigrationInterface {
    name = 'SyncFix17648569218311764856934823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'unpaid'`);
    }

}
