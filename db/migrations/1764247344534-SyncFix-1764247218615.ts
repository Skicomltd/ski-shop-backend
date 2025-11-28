import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17642472186151764247344534 implements MigrationInterface {
    name = 'SyncFix17642472186151764247344534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "fcmToken" TO "fcmTokens"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryAddress"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingAddress" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingFee" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingFee"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingAddress"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryAddress" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "fcmTokens" TO "fcmToken"`);
    }

}
