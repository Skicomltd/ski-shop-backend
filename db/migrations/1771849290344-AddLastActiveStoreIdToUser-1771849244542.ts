import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastActiveStoreIdToUser17718492445421771849290344 implements MigrationInterface {
    name = 'AddLastActiveStoreIdToUser17718492445421771849290344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveStoreId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveStoreId"`);
    }

}
