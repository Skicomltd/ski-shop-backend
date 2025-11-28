import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17643251277871764325156841 implements MigrationInterface {
    name = 'SyncFix17643251277871764325156841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryStatus"`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryNo"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingAddress"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingFee"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "fragile" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."order_item_deliverystatus_enum" AS ENUM('uninitiated', 'pending', 'assigned', 'picked_up', 'in_transit', 'arrived_at_hub', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "deliveryStatus" "public"."order_item_deliverystatus_enum" NOT NULL DEFAULT 'uninitiated'`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "deliveryNo" text`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD "expectedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingInfo" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shippingInfo"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "expectedAt"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "deliveryNo"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "deliveryStatus"`);
        await queryRunner.query(`DROP TYPE "public"."order_item_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "fragile"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingFee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shippingAddress" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryNo" text`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverystatus_enum" AS ENUM('uninitiated', 'pending', 'assigned', 'picked_up', 'in_transit', 'arrived_at_hub', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryStatus" "public"."order_deliverystatus_enum" NOT NULL DEFAULT 'uninitiated'`);
    }

}
