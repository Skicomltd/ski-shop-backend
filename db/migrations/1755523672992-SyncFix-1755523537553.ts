import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17555235375531755523672992 implements MigrationInterface {
    name = 'SyncFix17555235375531755523672992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionFee"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionFee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionValue"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionValue" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionValue"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionValue" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionFee"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionFee" integer NOT NULL`);
    }

}
