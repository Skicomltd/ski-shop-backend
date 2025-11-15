import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17632256585871763225685478 implements MigrationInterface {
    name = 'SyncFix17632256585871763225685478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."address_status_enum" AS ENUM('default', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "userId" uuid NOT NULL, "status" "public"."address_status_enum" NOT NULL DEFAULT 'default', CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TYPE "public"."address_status_enum"`);
    }

}
