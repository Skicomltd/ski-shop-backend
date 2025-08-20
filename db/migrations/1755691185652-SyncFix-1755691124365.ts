import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17556911243651755691185652 implements MigrationInterface {
    name = 'SyncFix17556911243651755691185652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commision" DROP CONSTRAINT "FK_fa8def590bf8f20df3cd00e5d7c"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."commision_commisionstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionFee"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "commisionValue"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "orderItemId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD CONSTRAINT "UQ_18184b9efdd9bf313e5aebf4b40" UNIQUE ("orderItemId")`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "value" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD CONSTRAINT "FK_18184b9efdd9bf313e5aebf4b40" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "commision" DROP CONSTRAINT "FK_18184b9efdd9bf313e5aebf4b40"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP CONSTRAINT "UQ_18184b9efdd9bf313e5aebf4b40"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "orderItemId"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionValue" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionFee" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "orderId" uuid NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."commision_commisionstatus_enum" AS ENUM('unpaid', 'pain')`);
        await queryRunner.query(`ALTER TABLE "commision" ADD "commisionStatus" "public"."commision_commisionstatus_enum" NOT NULL DEFAULT 'unpaid'`);
        await queryRunner.query(`ALTER TABLE "commision" ADD CONSTRAINT "FK_fa8def590bf8f20df3cd00e5d7c" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
