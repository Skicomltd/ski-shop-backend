import { MigrationInterface, QueryRunner } from "typeorm"

export class AddPhoneNumberVerifiedToUser17639867066821763986780624 implements MigrationInterface {
  name = "AddPhoneNumberVerifiedToUser17639867066821763986780624"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "notifiableId" character varying NOT NULL, "data" jsonb NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "user" ADD "isPhoneNumberVerified" boolean NOT NULL DEFAULT false`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPhoneNumberVerified"`)
    await queryRunner.query(`DROP TABLE "notification"`)
  }
}
