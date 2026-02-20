import { MigrationInterface, QueryRunner } from "typeorm"

export class AddStoresUser17715459043531771546015465 implements MigrationInterface {
  name = "AddStoresUser17715459043531771546015465"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6"`)
    await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "userId" TO "ownerId"`)
    await queryRunner.query(`CREATE TYPE "public"."store_user_role_enum" AS ENUM('manager', 'staff')`)
    await queryRunner.query(
      `CREATE TABLE "store_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."store_user_role_enum" NOT NULL DEFAULT 'staff', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "storeId" uuid, CONSTRAINT "UQ_dcf9c8068a0fc1e5406e485e32c" UNIQUE ("userId", "storeId"), CONSTRAINT "PK_1bb8bf0dd65b3e8298ef79640b7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "ownerId" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9"`)
    await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "REL_bc7ec2c93335da88571ae84fbe"`)
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_91230ea862c52e2aa78208c7bb8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "store_user" ADD CONSTRAINT "FK_b3f19d5250fc914e774617a7f89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "store_user" ADD CONSTRAINT "FK_1a30fedbf19944300227a05a80c" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9"`)
    await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_1a30fedbf19944300227a05a80c"`)
    await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_b3f19d5250fc914e774617a7f89"`)
    await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_91230ea862c52e2aa78208c7bb8"`)
    await queryRunner.query(`ALTER TABLE "store" ADD CONSTRAINT "REL_bc7ec2c93335da88571ae84fbe" UNIQUE ("businessId")`)
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "ownerId" DROP NOT NULL`)
    await queryRunner.query(`DROP TABLE "store_user"`)
    await queryRunner.query(`DROP TYPE "public"."store_user_role_enum"`)
    await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "ownerId" TO "userId"`)
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
