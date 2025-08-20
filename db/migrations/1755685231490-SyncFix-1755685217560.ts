import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncFix17556852175601755685231490 implements MigrationInterface {
    name = 'SyncFix17556852175601755685231490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."commision_commisionstatus_enum" AS ENUM('unpaid', 'pain')`);
        await queryRunner.query(`CREATE TABLE "commision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "commisionFee" double precision NOT NULL, "orderId" uuid NOT NULL, "storeId" uuid NOT NULL, "commisionValue" double precision NOT NULL, "commisionStatus" "public"."commision_commisionstatus_enum" NOT NULL DEFAULT 'unpaid', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ffb6d8ebaaca72c1fcb10bc9f3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."voucher_status_enum" AS ENUM('pending', 'redeemed', 'expired')`);
        await queryRunner.query(`CREATE TYPE "public"."voucher_prizetype_enum" AS ENUM('discount', 'amount')`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'pending', "code" character varying NOT NULL, "orderId" character varying NOT NULL, "dateWon" TIMESTAMP NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "prizeWon" numeric(10,2) NOT NULL, "prizeType" "public"."voucher_prizetype_enum" NOT NULL DEFAULT 'amount', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "revenue_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "settingId" character varying NOT NULL, "minPayoutAmount" integer NOT NULL DEFAULT '10000', "maxPayoutAmount" integer NOT NULL DEFAULT '100000', "maxWithdrawalsPerDay" integer NOT NULL DEFAULT '1', "fulfillmentFeePercentage" integer NOT NULL DEFAULT '10', "gasFee" integer NOT NULL DEFAULT '1000', "monthlySubscriptionFee" integer NOT NULL DEFAULT '10000', "yearlySubscriptionFee" integer NOT NULL DEFAULT '100000', "gracePeriodAfterExpiry" integer NOT NULL DEFAULT '7', "autoExpiryNotification" boolean NOT NULL DEFAULT true, "notifyUserOnApproval" boolean NOT NULL DEFAULT true, "notifyOnSubscriptionExpiry" boolean NOT NULL DEFAULT true, "notifyOnCommissionDeduction" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_90495c774bed200ed83f0bcad2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "promotion_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "settingId" character varying NOT NULL, "defaultDurationDays" integer NOT NULL DEFAULT '7', "maxPromotionsPerDay" integer NOT NULL DEFAULT '3', "bannerPromotion" boolean NOT NULL DEFAULT true, "featuredSectionPromotion" boolean NOT NULL DEFAULT true, "autoApprovePromotions" boolean NOT NULL DEFAULT true, "notifyVendorOnApproval" boolean NOT NULL DEFAULT true, "notifyOnNewRequest" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "UpdatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f639a537a19ea02e007a6228083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "play2win_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "settingId" character varying NOT NULL, "playFrequency" character varying NOT NULL DEFAULT 'Once Every 24 Hours', "redemptionWindowDays" integer NOT NULL DEFAULT '7', "couponRedemptionFrequency" character varying NOT NULL DEFAULT 'Once Every 24 Hours', "drawCycleResetTime" character varying NOT NULL DEFAULT '08:00PM', "loginRequiredToPlay" boolean NOT NULL DEFAULT true, "notifyAdminOnCouponExhaustion" boolean NOT NULL DEFAULT true, "showWinnersNotification" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ef8504918a59052ee1a3fa9e485" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "emailPurchase" boolean NOT NULL DEFAULT true, "emailNewsUpdates" boolean NOT NULL DEFAULT false, "emailProductCreation" boolean NOT NULL DEFAULT true, "emailPayout" boolean NOT NULL DEFAULT true, "accountEmail" character varying NOT NULL DEFAULT 'info@skishop.com', "alternativeEmail" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "revenueSettingId" uuid, "promotionSettingId" uuid, "play2winSettingId" uuid, CONSTRAINT "REL_3a77f9616ac6d231f8d58ce77c" UNIQUE ("revenueSettingId"), CONSTRAINT "REL_cc85295362cbdf0c2e6c45b619" UNIQUE ("promotionSettingId"), CONSTRAINT "REL_83ce3e9f9dc4b6a059df5b33d9" UNIQUE ("play2winSettingId"), CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."coupon_coupontype_enum" AS ENUM('discount', 'amount')`);
        await queryRunner.query(`CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "code" character varying(50) NOT NULL, "quantity" integer NOT NULL, "remainingQuantity" integer NOT NULL, "couponType" "public"."coupon_coupontype_enum" NOT NULL DEFAULT 'amount', "value" numeric(10,2) NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "totalProductRatingSum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "totalProductRatingCount"`);
        await queryRunner.query(`ALTER TABLE "ad" ADD "reference" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "commision" ADD CONSTRAINT "FK_fa8def590bf8f20df3cd00e5d7c" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commision" ADD CONSTRAINT "FK_125c1756ed6bbd2b5f28a380e59" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_80a57d757e0be8225f261c7994f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_3a77f9616ac6d231f8d58ce77c5" FOREIGN KEY ("revenueSettingId") REFERENCES "revenue_setting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_cc85295362cbdf0c2e6c45b619a" FOREIGN KEY ("promotionSettingId") REFERENCES "promotion_setting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "setting" ADD CONSTRAINT "FK_83ce3e9f9dc4b6a059df5b33d9e" FOREIGN KEY ("play2winSettingId") REFERENCES "play2win_setting"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_83ce3e9f9dc4b6a059df5b33d9e"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_cc85295362cbdf0c2e6c45b619a"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP CONSTRAINT "FK_3a77f9616ac6d231f8d58ce77c5"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_80a57d757e0be8225f261c7994f"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP CONSTRAINT "FK_125c1756ed6bbd2b5f28a380e59"`);
        await queryRunner.query(`ALTER TABLE "commision" DROP CONSTRAINT "FK_fa8def590bf8f20df3cd00e5d7c"`);
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "reference"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "totalProductRatingCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "totalProductRatingSum" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP TABLE "coupon"`);
        await queryRunner.query(`DROP TYPE "public"."coupon_coupontype_enum"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "play2win_setting"`);
        await queryRunner.query(`DROP TABLE "promotion_setting"`);
        await queryRunner.query(`DROP TABLE "revenue_setting"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_prizetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_status_enum"`);
        await queryRunner.query(`DROP TABLE "commision"`);
        await queryRunner.query(`DROP TYPE "public"."commision_commisionstatus_enum"`);
    }

}
