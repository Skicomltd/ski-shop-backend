import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, UseInterceptors, UseGuards } from "@nestjs/common"
import { ContactUsService } from "./contactUs.service"
import { createContactUsSchema, CreateContactUsDto } from "./dto/create-contactUs.dto"
import { Public } from "../auth/decorators/public.decorator"
import { ContactsUsResponseInterceptor } from "./interceptor/contactsUs.interceptor"
import { ContactUsResponseInterceptor } from "./interceptor/contactUs.interceptor"
import { PolicyContactUsGuard } from "./guard/policy-contactUs.guard"
import { AppAbility } from "@services/casl/casl-ability.factory"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { Action } from "@services/casl/actions/action"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { MailService } from "@/services/mail"
import { ContactUsNotification } from "@/mails"
import { UserService } from "../users/user.service"
import { UserRoleEnum } from "../users/entity/user.entity"

@Controller("contactUs")
export class ContactUsController {
  constructor(
    private readonly contactUsService: ContactUsService,
    private mailerService: MailService,
    private userService: UserService
  ) {}

  @Public()
  @UseInterceptors(ContactUsResponseInterceptor)
  @Post()
  async create(@Body(new JoiValidationPipe(createContactUsSchema)) createContactUsDto: CreateContactUsDto) {
    const contactUs = await this.contactUsService.create(createContactUsDto)
    const adminUsers = await this.userService.find({ role: UserRoleEnum.Admin })
    if (adminUsers[0].length > 0) {
      for (const adminUser of adminUsers[0]) {
        await this.mailerService.send(new ContactUsNotification(adminUser.email))
      }
    }
    return contactUs
  }

  @UseGuards(PolicyContactUsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "CONTACT-US"))
  @UseInterceptors(ContactsUsResponseInterceptor)
  @Get()
  findAll() {
    return this.contactUsService.find()
  }

  @UseGuards(PolicyContactUsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "CONTACT-US"))
  @UseInterceptors(ContactUsResponseInterceptor)
  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.contactUsService.findById(id)
  }

  @UseGuards(PolicyContactUsGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "CONTACT-US"))
  @Delete(":id")
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.contactUsService.remove({ id })
  }
}
