import { MigrationInterface, QueryRunner } from "typeorm"

export class SyncFix17540624388701754062472315 implements MigrationInterface {
  name = "SyncFix17540624388701754062472315"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "accountName" character varying NOT NULL, "code" character varying NOT NULL, "recipientCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_90c0c48a76481f77c68569ab627" UNIQUE ("accountNumber"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "business" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "name" text NOT NULL DEFAULT '', "businessRegNumber" text, "contactNumber" character varying NOT NULL, "address" character varying NOT NULL, "country" character varying NOT NULL, "state" character varying NOT NULL, "kycVerificationType" character varying NOT NULL, "identificationNumber" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_dba98cd5cf972f69e1e066b398a" UNIQUE ("businessRegNumber"), CONSTRAINT "UQ_8778888f4b7f4185a24db2c823b" UNIQUE ("identificationNumber"), CONSTRAINT "REL_ac8ad696f6731c86b52c058c0c" UNIQUE ("userId"), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "withdrawal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "bankId" uuid NOT NULL, "status" "public"."withdrawal_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "payoutId" uuid, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "payout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" double precision NOT NULL DEFAULT '0', "available" double precision NOT NULL DEFAULT '0', "pending" double precision NOT NULL DEFAULT '0', "withdrawn" double precision NOT NULL DEFAULT '0', "storeId" character varying NOT NULL, CONSTRAINT "PK_1cb73ce021dc6618a3818b0a474" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."promotion_type_enum" NOT NULL DEFAULT 'featured', "duration" integer NOT NULL, "amount" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "ads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duration" integer NOT NULL, "vendorId" uuid NOT NULL, "productId" uuid NOT NULL, "storeId" uuid NOT NULL, "type" "public"."ads_type_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "public"."ads_status_enum" NOT NULL DEFAULT 'inactive', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7af7d1998037a97076f758fc23" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "logo" character varying NOT NULL, "isStarSeller" boolean NOT NULL DEFAULT false, "type" "public"."store_type_enum" NOT NULL DEFAULT 'basic', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "businessId" uuid, "payoutId" uuid, CONSTRAINT "REL_bc7ec2c93335da88571ae84fbe" UNIQUE ("businessId"), CONSTRAINT "REL_780e516e3a34d53e9510b43d3e" UNIQUE ("payoutId"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "saved_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "productId" uuid NOT NULL, "isLiked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c99eb1342e10ffb1eb6ced77230" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reviewerId" uuid NOT NULL, "productId" uuid NOT NULL, "comment" text NOT NULL, "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "category" "public"."product_category_enum" NOT NULL, "description" character varying NOT NULL, "price" double precision NOT NULL, "discountPrice" double precision, "stockCount" integer NOT NULL, "images" text array NOT NULL, "status" "public"."product_status_enum" NOT NULL DEFAULT 'draft', "storeId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "productId" uuid, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "storeId" character varying NOT NULL, "quantity" integer NOT NULL, "unitPrice" double precision NOT NULL, "orderId" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "deliveryStatus" "public"."order_deliverystatus_enum" NOT NULL DEFAULT 'uninitiated', "paymentMethod" "public"."order_paymentmethod_enum" NOT NULL, "buyerId" uuid NOT NULL, "paidAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "vendorId" uuid NOT NULL, "reference" character varying, "planCode" character varying NOT NULL, "subscriptionCode" character varying NOT NULL DEFAULT '', "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "planType" character varying NOT NULL, "status" "public"."subscription_status_enum" NOT NULL DEFAULT 'inactive', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'customer', "email" character varying NOT NULL, "phoneNumber" text NOT NULL DEFAULT '', "isEmailVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planCode" character varying NOT NULL, "interval" "public"."plan_interval_enum" NOT NULL, "name" character varying NOT NULL, "amount" integer NOT NULL, "savingPercentage" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "code" character varying NOT NULL, "expireAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_463cf01e0ea83ad57391fd4e1d7" UNIQUE ("email"), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "bank" ADD CONSTRAINT "FK_f023abe054fcf7b1d67cd4c8a13" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_190820cd3165dcc6a6ec7df3581" FOREIGN KEY ("bankId") REFERENCES "bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_1faf92688af9203dd496f97c59d" FOREIGN KEY ("payoutId") REFERENCES "payout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ads" ADD CONSTRAINT "FK_785465fab68fcd1364f60a000c2" FOREIGN KEY ("vendorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ads" ADD CONSTRAINT "FK_fb8e40a6953f03ba4157caa6959" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "ads" ADD CONSTRAINT "FK_051d6245f04a02c2279231de3c9" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "store" ADD CONSTRAINT "FK_780e516e3a34d53e9510b43d3ef" FOREIGN KEY ("payoutId") REFERENCES "payout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "saved_product" ADD CONSTRAINT "FK_1061738a62220d693224bfc9f94" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "saved_product" ADD CONSTRAINT "FK_2c14b49dad251492928b265942c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_34413365b39e3bf5bea866569b4" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_32eaa54ad96b26459158464379a" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_371eb56ecc4104c2644711fa85f" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "subscription" ADD CONSTRAINT "FK_a1777ea88d7ed6774d2d6167395" FOREIGN KEY ("vendorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_a1777ea88d7ed6774d2d6167395"`)
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`)
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`)
    await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`)
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_371eb56ecc4104c2644711fa85f"`)
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`)
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`)
    await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_32eaa54ad96b26459158464379a"`)
    await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_34413365b39e3bf5bea866569b4"`)
    await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`)
    await queryRunner.query(`ALTER TABLE "saved_product" DROP CONSTRAINT "FK_2c14b49dad251492928b265942c"`)
    await queryRunner.query(`ALTER TABLE "saved_product" DROP CONSTRAINT "FK_1061738a62220d693224bfc9f94"`)
    await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_780e516e3a34d53e9510b43d3ef"`)
    await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_bc7ec2c93335da88571ae84fbe9"`)
    await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_051d6245f04a02c2279231de3c9"`)
    await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_fb8e40a6953f03ba4157caa6959"`)
    await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_785465fab68fcd1364f60a000c2"`)
    await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_1faf92688af9203dd496f97c59d"`)
    await queryRunner.query(`ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_190820cd3165dcc6a6ec7df3581"`)
    await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6"`)
    await queryRunner.query(`ALTER TABLE "bank" DROP CONSTRAINT "FK_f023abe054fcf7b1d67cd4c8a13"`)
    await queryRunner.query(`DROP TABLE "otp"`)
    await queryRunner.query(`DROP TABLE "plan"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "subscription"`)
    await queryRunner.query(`DROP TABLE "order"`)
    await queryRunner.query(`DROP TABLE "order_item"`)
    await queryRunner.query(`DROP TABLE "cart"`)
    await queryRunner.query(`DROP TABLE "product"`)
    await queryRunner.query(`DROP TABLE "review"`)
    await queryRunner.query(`DROP TABLE "saved_product"`)
    await queryRunner.query(`DROP TABLE "store"`)
    await queryRunner.query(`DROP TABLE "ads"`)
    await queryRunner.query(`DROP TABLE "promotion"`)
    await queryRunner.query(`DROP TABLE "payout"`)
    await queryRunner.query(`DROP TABLE "withdrawal"`)
    await queryRunner.query(`DROP TABLE "business"`)
    await queryRunner.query(`DROP TABLE "bank"`)
  }
}
