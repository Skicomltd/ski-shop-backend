import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17642254824261764225517636 implements MigrationInterface {
    name = 'SyncFix17642254824261764225517636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryAddress" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryNo" text`);
        await queryRunner.query(`ALTER TABLE "pickup" ADD "state" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverystatus_enum" RENAME TO "order_deliverystatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_deliverystatus_enum" AS ENUM('uninitiated', 'pending', 'assigned', 'picked_up', 'in_transit', 'arrived_at_hub', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" TYPE "public"."order_deliverystatus_enum" USING "deliveryStatus"::"text"::"public"."order_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" SET DEFAULT 'uninitiated'`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverystatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_deliverystatus_enum_old" AS ENUM('uninitiated', 'pending', 'delivered')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" TYPE "public"."order_deliverystatus_enum_old" USING "deliveryStatus"::"text"::"public"."order_deliverystatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "deliveryStatus" SET DEFAULT 'uninitiated'`);
        await queryRunner.query(`DROP TYPE "public"."order_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_deliverystatus_enum_old" RENAME TO "order_deliverystatus_enum"`);
        await queryRunner.query(`ALTER TABLE "pickup" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryNo"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryAddress"`);
    }

}
