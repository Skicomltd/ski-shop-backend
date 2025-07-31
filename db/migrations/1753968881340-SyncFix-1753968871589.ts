import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17539688715891753968881340 implements MigrationInterface {
    name = 'SyncFix17539688715891753968881340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_8812aa858f1464d26c327789165"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_6168dad034e04675610a12f27fb"`);
        await queryRunner.query(`ALTER TABLE "store" RENAME COLUMN "earningId" TO "payoutId"`);
        await queryRunner.query(`CREATE TABLE "payout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" double precision NOT NULL DEFAULT '0', "available" double precision NOT NULL DEFAULT '0', "pending" double precision NOT NULL DEFAULT '0', "withdrawn" double precision NOT NULL DEFAULT '0', "storeId" character varying NOT NULL, CONSTRAINT "PK_1cb73ce021dc6618a3818b0a474" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "payoutId" uuid`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "earningId"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "earningId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_780e516e3a34d53e9510b43d3ef" FOREIGN KEY ("payoutId") REFERENCES "payout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_1faf92688af9203dd496f97c59d" FOREIGN KEY ("payoutId") REFERENCES "payout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_1faf92688af9203dd496f97c59d"`);
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_780e516e3a34d53e9510b43d3ef"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "earningId"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD "earningId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "withdrawal" DROP COLUMN "payoutId"`);
        await queryRunner.query(`DROP TABLE "payout"`);
        await queryRunner.query(`ALTER TABLE "store" RENAME COLUMN "payoutId" TO "earningId"`);
        await queryRunner.query(`ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_6168dad034e04675610a12f27fb" FOREIGN KEY ("earningId") REFERENCES "earning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "FK_8812aa858f1464d26c327789165" FOREIGN KEY ("earningId") REFERENCES "earning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
