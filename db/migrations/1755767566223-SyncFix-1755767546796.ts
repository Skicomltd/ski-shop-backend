import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17557675467961755767566223 implements MigrationInterface {
    name = 'SyncFix17557675467961755767566223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "general_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "settingId" character varying NOT NULL, "purchaseEmailNotification" boolean NOT NULL DEFAULT true, "newsAndUpdateEmailNotification" boolean NOT NULL DEFAULT false, "productCreationEmailNotification" boolean NOT NULL DEFAULT true, "payoutEmailNotification" boolean NOT NULL DEFAULT true, "contactEmail" character varying NOT NULL DEFAULT 'info@skishop.com', "alternativeContactEmail" character varying, CONSTRAINT "PK_9e1d3b326073c4b091a424d40d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "emailPayout"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "emailPurchase"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "emailProductCreation"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "alternativeEmail"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "emailNewsUpdates"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "accountEmail"`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "generalSettingId" uuid`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "UQ_2e6052f77c508d3712d1e333c35" UNIQUE ("generalSettingId")`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_2e6052f77c508d3712d1e333c35" FOREIGN KEY ("generalSettingId") REFERENCES "general_setting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_2e6052f77c508d3712d1e333c35"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "UQ_2e6052f77c508d3712d1e333c35"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "generalSettingId"`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "accountEmail" character varying NOT NULL DEFAULT 'info@skishop.com'`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "emailNewsUpdates" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "alternativeEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "emailProductCreation" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "emailPurchase" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "emailPayout" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`DROP TABLE "general_setting"`);
    }

}
