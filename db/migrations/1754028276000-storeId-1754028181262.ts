import { MigrationInterface, QueryRunner } from "typeorm"

export class StoreId17540281812621754028276000 implements MigrationInterface {
  name = "StoreId17540281812621754028276000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ads" ADD "storeId" uuid NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "ads" ADD CONSTRAINT "FK_051d6245f04a02c2279231de3c9" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_051d6245f04a02c2279231de3c9"`)
    await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "storeId"`)
  }
}
