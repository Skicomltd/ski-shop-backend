import { MigrationInterface, QueryRunner } from "typeorm";

export class IsStarSellerStore17537945490221753794623811 implements MigrationInterface {
    name = 'IsStarSellerStore17537945490221753794623811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" ADD "isStarSeller" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "isStarSeller"`);
    }

}
