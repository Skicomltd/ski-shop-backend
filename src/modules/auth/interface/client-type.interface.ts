import z from "zod"
import { clientTypeSchema } from "../dto/client-type.dto"

export type ClientType = z.infer<typeof clientTypeSchema>
