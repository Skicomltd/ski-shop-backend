import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17539628246301753962834835 implements MigrationInterface {
  name = "SyncFix17539628246301753962834835"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_6168dad034e04675610a12f27fb"`)
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "earningId" DROP NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_6168dad034e04675610a12f27fb" FOREIGN KEY ("earningId") REFERENCES "earning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_6168dad034e04675610a12f27fb"`)
    await queryRunner.query(`ALTER TABLE "withdrawal" ALTER COLUMN "earningId" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_6168dad034e04675610a12f27fb" FOREIGN KEY ("earningId") REFERENCES "earning"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
