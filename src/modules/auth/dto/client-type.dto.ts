import z from "zod"

export const clientTypeSchema = z.enum(["vendor-mobile", "customer-mobile", "web"])
