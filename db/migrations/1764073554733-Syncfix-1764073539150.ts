import { MigrationInterface, QueryRunner } from "typeorm";

export class Syncfix17640735391501764073554733 implements MigrationInterface {
    name = 'Syncfix17640735391501764073554733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "status" TO "default"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "default" TO "status"`);
    }

}
