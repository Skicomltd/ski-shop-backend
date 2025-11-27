import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17642380868251764238132515 implements MigrationInterface {
    name = 'SyncFix17642380868251764238132515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "weight" double precision NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TYPE "public"."order_paymentmethod_enum" RENAME TO "order_paymentmethod_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum" AS ENUM('paystack', 'paymentOnDelivery')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentMethod" TYPE "public"."order_paymentmethod_enum" USING "paymentMethod"::"text"::"public"."order_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum_old" AS ENUM('paystack')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paymentMethod" TYPE "public"."order_paymentmethod_enum_old" USING "paymentMethod"::"text"::"public"."order_paymentmethod_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_paymentmethod_enum_old" RENAME TO "order_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
    }

}
