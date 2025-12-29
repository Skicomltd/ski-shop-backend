import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { NestExpressApplication } from "@nestjs/platform-express"
import helmet from "helmet"
import * as compression from "compression"
import { join } from "path"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true })
  const configService = app.get(ConfigService)

  app.enableCors({ origin: "*", credentials: true })
  app.setGlobalPrefix("api/v1", { exclude: [""] })
  app.use(helmet())
  app.use(compression())

  app.useStaticAssets(join(__dirname, "..", "public"))
  app.setBaseViewsDir(join(__dirname, "..", "views"))
  app.setViewEngine("hbs")

  await app.listen(configService.get("app.port"))
}
bootstrap()
