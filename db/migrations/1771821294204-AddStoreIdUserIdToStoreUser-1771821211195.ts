import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreIdUserIdToStoreUser17718212111951771821294204 implements MigrationInterface {
    name = 'AddStoreIdUserIdToStoreUser17718212111951771821294204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_b3f19d5250fc914e774617a7f89"`);
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_1a30fedbf19944300227a05a80c"`);
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "UQ_dcf9c8068a0fc1e5406e485e32c"`);
        await queryRunner.query(`ALTER TABLE "store_user" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_user" ALTER COLUMN "storeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "UQ_dcf9c8068a0fc1e5406e485e32c" UNIQUE ("userId", "storeId")`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "FK_b3f19d5250fc914e774617a7f89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "FK_1a30fedbf19944300227a05a80c" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_1a30fedbf19944300227a05a80c"`);
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "FK_b3f19d5250fc914e774617a7f89"`);
        await queryRunner.query(`ALTER TABLE "store_user" DROP CONSTRAINT "UQ_dcf9c8068a0fc1e5406e485e32c"`);
        await queryRunner.query(`ALTER TABLE "store_user" ALTER COLUMN "storeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_user" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "UQ_dcf9c8068a0fc1e5406e485e32c" UNIQUE ("userId", "storeId")`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "FK_1a30fedbf19944300227a05a80c" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_user" ADD CONSTRAINT "FK_b3f19d5250fc914e774617a7f89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
