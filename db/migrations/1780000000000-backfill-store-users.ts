import { MigrationInterface, QueryRunner } from "typeorm"

export class BackfillStoreUsers1780000000000 implements MigrationInterface {
  name = "BackfillStoreUsers1780000000000"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "store_user" ("userId", "storeId", "role")
      SELECT b."ownerId", s."id", 'manager'::"store_user_role_enum"
      FROM "business" b
      INNER JOIN "store" s ON s."businessId" = b."id"
      WHERE b."ownerId" IS NOT NULL
      ON CONFLICT ("userId", "storeId") DO NOTHING
    `)
  }

  public async down(): Promise<void> {
    // no-op: data backfill migration
  }
}
