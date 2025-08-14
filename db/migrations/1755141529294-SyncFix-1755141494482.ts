import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17551414944821755141529294 implements MigrationInterface {
    name = 'SyncFix17551414944821755141529294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "prizeWon"`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD "prizeWon" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP COLUMN "prizeWon"`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD "prizeWon" integer NOT NULL`);
    }

}
