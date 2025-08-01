import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17539704297811753970438965 implements MigrationInterface {
    name = 'SyncFix17539704297811753970438965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "earningId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "earningId" character varying NOT NULL`);
    }

}
