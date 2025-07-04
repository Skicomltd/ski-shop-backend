import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { StoreService } from "../stores/store.service"
import { CheckPolicies } from "../auth/decorators/policies-handler.decorator"
import { AppAbility } from "../services/casl/casl-ability.factory"
import { Action } from "../services/casl/actions/action"
import { User } from "../users/entity/user.entity"
import { Request } from "express"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { UserService } from "../users/user.service"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { UpdateProfileDto, updateProfileSchema } from "./dto/update-profile.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { imageFilter, memoryUpload } from "@/config/multer.config"
import { FileSystemService } from "../services/filesystem/filesystem.service"
import { FileUploadDto } from "../services/filesystem/interfaces/filesystem.interface"
import { PoliciesVerifiedUserGuard } from "../auth/guard/policies-handler-verifed-user.guard"
import { PoliciesHasBusinessGuard } from "../auth/guard/policy-has-business.guard"
import { PoliciesHasStoreGuard } from "../auth/guard/policy-has-store.guard"
import { BusinessService } from "../business/business.service"

@Controller("vendors")
export class VendorController {
  constructor(
    private storeService: StoreService,
    private transactionHelper: TransactionHelper,
    private readonly userService: UserService,
    private bussinessService: BusinessService,
    private fileSystemService: FileSystemService
  ) {}

  @Post("/profile")
  @UseGuards(PoliciesVerifiedUserGuard, PoliciesHasBusinessGuard, PoliciesHasStoreGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, User))
  @UseInterceptors(FileInterceptor("logo", { ...memoryUpload, fileFilter: imageFilter }))
  async updateUserProfile(
    @Body(new JoiValidationPipe(updateProfileSchema)) updateUserProfile: UpdateProfileDto,
    @UploadedFile() fileUploaded: CustomFile,
    @Req() req: Request
  ) {
    const user = req.user

    const business = await this.bussinessService.findOne({ user: { id: user.id } })

    if (!business) throw new BadReqException("User currently has no business account")

    const store = await this.storeService.findOne({ business: { id: business.id } })

    if (!store) throw new BadReqException("User currently has no store")

    return this.transactionHelper.runInTransaction(async (manager) => {
      if (fileUploaded) {
        const fileDto: FileUploadDto = {
          destination: `images/${fileUploaded.originalname}-storelogo.${fileUploaded.extension}`,
          mimetype: fileUploaded.mimetype,
          buffer: fileUploaded.buffer,
          filePath: fileUploaded.path
        }

        updateUserProfile.store.logo = await this.fileSystemService.upload(fileDto)
      }

      await this.userService.update(user, updateUserProfile.user, manager)
      await this.bussinessService.update(business, updateUserProfile.business, manager)
      await this.storeService.update(store, updateUserProfile.store, manager)

      return "User profile updated"
    })
  }
}
