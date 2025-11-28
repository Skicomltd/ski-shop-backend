import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17643461056741764346225644 implements MigrationInterface {
    name = 'SyncFix17643461056741764346225644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('unpaid', 'paid', 'pending', 'partially_paid')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum_old" AS ENUM('unpaid', 'paid', 'pending')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`);
    }

}
