import { MigrationInterface, QueryRunner } from "typeorm";

export class Ads17538598371931753859871963 implements MigrationInterface {
    name = 'Ads17538598371931753859871963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ads_type_enum" AS ENUM('banner', 'search', 'featured')`);
        await queryRunner.query(`CREATE TYPE "public"."ads_status_enum" AS ENUM('active', 'inactive', 'expired')`);
        await queryRunner.query(`CREATE TABLE "ads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duration" integer NOT NULL, "vendorId" uuid NOT NULL, "productId" uuid NOT NULL, "type" "public"."ads_type_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "public"."ads_status_enum" NOT NULL DEFAULT 'inactive', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7af7d1998037a97076f758fc23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_785465fab68fcd1364f60a000c2" FOREIGN KEY ("vendorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_fb8e40a6953f03ba4157caa6959" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_fb8e40a6953f03ba4157caa6959"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_785465fab68fcd1364f60a000c2"`);
        await queryRunner.query(`DROP TABLE "ads"`);
        await queryRunner.query(`DROP TYPE "public"."ads_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ads_type_enum"`);
    }

}
