import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17557777491621755777783960 implements MigrationInterface {
    name = 'SyncFix17557777491621755777783960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "orderId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" ALTER COLUMN "orderId" SET NOT NULL`);
    }

}
