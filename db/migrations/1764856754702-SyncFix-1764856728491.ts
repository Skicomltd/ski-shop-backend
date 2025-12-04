import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17648567284911764856754702 implements MigrationInterface {
    name = 'SyncFix17648567284911764856754702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'unpaid'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

}
