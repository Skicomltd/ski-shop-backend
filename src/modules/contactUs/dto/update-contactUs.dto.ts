import { PartialType } from "@nestjs/mapped-types"
import { CreateContactUsDto } from "./create-contactUs.dto"

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {}
