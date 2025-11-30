import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17644501306811764450203035 implements MigrationInterface {
    name = 'SyncFix17644501306811764450203035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "unitsSold" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "unitsSold"`);
    }

}
