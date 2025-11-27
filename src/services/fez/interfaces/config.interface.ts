import { ModuleMetadata } from "@nestjs/common"

export type FezModuleOptions = {
  url: string
  secret: string
  userId: string
  password: string
}

export interface FezModuleAsynOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => Promise<FezModuleOptions> | FezModuleOptions
  inject?: any[]
}
