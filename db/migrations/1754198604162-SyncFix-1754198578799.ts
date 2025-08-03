import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17541985787991754198604162 implements MigrationInterface {
    name = 'SyncFix17541985787991754198604162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" DROP CONSTRAINT "FK_a7eb67aa63030172be1ea0a346c"`);
        await queryRunner.query(`ALTER TABLE "ad" RENAME COLUMN "vendorId" TO "promotionId"`);
        await queryRunner.query(`ALTER TABLE "ad" ADD CONSTRAINT "FK_70e20e41dfe1a227fc1a5224c61" FOREIGN KEY ("promotionId") REFERENCES "promotion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ad" DROP CONSTRAINT "FK_70e20e41dfe1a227fc1a5224c61"`);
        await queryRunner.query(`ALTER TABLE "ad" RENAME COLUMN "promotionId" TO "vendorId"`);
        await queryRunner.query(`ALTER TABLE "ad" ADD CONSTRAINT "FK_a7eb67aa63030172be1ea0a346c" FOREIGN KEY ("vendorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
