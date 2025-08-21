import { Request } from "express"
import { AuthService } from "./auth.service"
import { Public } from "./decorators/public.decorator"
import {
  Controller,
  Post,
  Body,
  HttpCode,
  Patch,
  UseGuards,
  Req,
  UseInterceptors,
  ConflictException,
  UploadedFile,
  Get,
  HttpStatus
} from "@nestjs/common"
import { JoiValidationPipe } from "@/validations/joi.validation"
import { AuthDto, registerSchema, ResendOtpDto, resendOtpSchema, VerifyEmailDto, verifyEmailSchema } from "./dto/auth.dto"
import JwtShortTimeGuard from "./guard/jwt-short-time.guard"
import { PasswordAuthGuard } from "./guard/password-auth.guard"
import { LoginValidationGuard } from "./guard/login-validation.guard"
import { ShortTime } from "./decorators/short-time.decorator"
import { AuthInterceptor } from "./interceptors/auth.interceptor"
import { HelpersService } from "../services/utils/helpers/helpers.service"
import { MailService } from "../services/mail/mail.service"
import { UserService } from "../users/user.service"
import { ConfigService } from "@nestjs/config"
import { IAuth } from "@/config/auth.config"
import { TransactionHelper } from "../services/utils/transactions/transactions.service"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { OnboardBusinessDto, onboardBusinessSchema } from "./dto/onboard-business.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { imageFilter, memoryUpload } from "@/config/multer.config"
import { OnboardStoreDto, onboardStoreSchema } from "./dto/onboard-store.dto"
import { User } from "../users/decorator/user.decorator"
import { FileUploadDto } from "../services/filesystem/interfaces/filesystem.interface"
import { FileSystemService } from "../services/filesystem/filesystem.service"
import { StoreService } from "../stores/store.service"
import { GoogleOAuthGuard } from "./guard/google-oauth.guard"
import { ForgotPasswordDto, forgotPasswordSchema } from "./dto/forgot-password.dto"
import { IApp } from "@/config/app.config"
import { ResetPasswordDto, resetPasswordSchema } from "./dto/reset-password.dto"
import { RefreshDto, refreshSchema } from "./dto/refresh.dto"
import { BusinessService } from "../business/business.service"
import { OnboardBankDto } from "./dto/onboard-bank.dto"
import { BankService } from "../banks/bank.service"
import { bankSchema } from "../banks/dto/create-bank.dto"
import { PaymentsService } from "../services/payments/payments.service"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private helperService: HelpersService,
    private mailService: MailService,
    private userService: UserService,
    private businessService: BusinessService,
    private configService: ConfigService,
    private readonly transactionHelper: TransactionHelper,
    private readonly fileSystemService: FileSystemService,
    private readonly storeService: StoreService,
    private readonly bankService: BankService,
    private readonly paymentsService: PaymentsService
  ) {}

  @Public()
  @Post("/register")
  @HttpCode(201)
  async register(@Body(new JoiValidationPipe(registerSchema)) registerDto: AuthDto) {
    return this.transactionHelper.runInTransaction(async (manager) => {
      const { email, id } = await this.userService.create(registerDto, manager)

      const code = this.helperService.generateOtp(6)

      const otp = await this.authService.saveOtp({ code, email }, manager)

      this.mailService.queue({
        to: registerDto.email,
        subject: "Email Validation",
        text: `Validate with your otp code: ${otp.code}. Your code expires in 10mins`
      })

      const shortTimeToken = await this.helperService.generateToken({ email, id }, this.configService.get<IAuth>("auth").shortTimeJwtSecret, "1h")

      return { token: shortTimeToken }
    })
  }

  @ShortTime()
  @Post("/verifyemail")
  @HttpCode(200)
  @UseGuards(JwtShortTimeGuard)
  async verifyEmail(@Req() req: Request, @Body(new JoiValidationPipe(verifyEmailSchema)) verifyEmailDto: VerifyEmailDto) {
    const isVerified = await this.authService.verifyCode({ email: req.user.email, code: verifyEmailDto.code })
    await this.userService.update(req.user, { isEmailVerified: isVerified, status: "active" })

    const shortTimeToken = await this.helperService.generateToken(
      { email: req.user.email, id: req.user.id },
      this.configService.get<IAuth>("auth").shortTimeJwtSecret,
      "1h"
    )

    return { token: shortTimeToken }
  }

  @ShortTime()
  @UseGuards(JwtShortTimeGuard)
  @Post("/business")
  async onboardBusiness(@Body(new JoiValidationPipe(onboardBusinessSchema)) userBusinessDto: OnboardBusinessDto, @Req() req: Request) {
    const user = req.user

    const business = await this.businessService.findOne({ user: { id: user.id } })
    if (business) throw new ConflictException("User already created a business")

    await this.businessService.create({ ...userBusinessDto, user })

    const payload = { email: user.email, id: user.id }

    const token = await this.helperService.generateToken(payload, this.configService.get<IAuth>("auth").shortTimeJwtSecret, "1h")

    return { token }
  }

  @ShortTime()
  @Post("/store")
  @UseGuards(JwtShortTimeGuard)
  @UseInterceptors(FileInterceptor("logo", { ...memoryUpload, fileFilter: imageFilter }))
  async create(
    @Body(new JoiValidationPipe(onboardStoreSchema)) onboardStoreDto: OnboardStoreDto,
    @UploadedFile() fileUploaded: CustomFile,
    @User("id") userId: string
  ) {
    const business = await this.businessService.findOne({ user: { id: userId } })
    if (!business) throw new NotFoundException("Business does not exist")

    if (await this.storeService.exists({ name: onboardStoreDto.name })) throw new ConflictException("Store name already exist")

    const fileDto: FileUploadDto = {
      destination: `images/${fileUploaded.originalname}-storelogo.${fileUploaded.extension}`,
      mimetype: fileUploaded.mimetype,
      buffer: fileUploaded.buffer,
      filePath: fileUploaded.path
    }

    const url = await this.fileSystemService.upload(fileDto)

    onboardStoreDto = { ...onboardStoreDto, logo: url, business: business }

    await this.storeService.create(onboardStoreDto)

    const payload = { email: business.user.email, id: business.user.id }
    const token = await this.helperService.generateToken(payload, this.configService.get<IAuth>("auth").shortTimeJwtSecret, "1h")

    return { token }
  }

  @ShortTime()
  @UseGuards(JwtShortTimeGuard)
  @Post("/bank")
  async onboardBank(@Body(new JoiValidationPipe(bankSchema)) onboardBankDto: OnboardBankDto, @Req() req: Request) {
    const user = req.user

    const bank = await this.bankService.findOne({ user: { id: user.id } })
    if (bank) throw new ConflictException("User already created a business")

    const { code } = await this.paymentsService.createTransferRecipient({
      name: onboardBankDto.accountName,
      accountNumber: onboardBankDto.accountNumber,
      bankCode: onboardBankDto.code
    })

    await this.bankService.create({ ...onboardBankDto, user, recipientCode: code })

    const payload = { email: user.email, id: user.id }

    const { accessToken: token } = await this.authService.login(payload)
    return { token }
  }

  @Public()
  @Patch("/resendotp")
  async resendOtp(@Body(new JoiValidationPipe(resendOtpSchema)) { email }: ResendOtpDto) {
    const user = await this.userService.findOne({ email })
    if (!user) throw new NotFoundException("user not found")

    const code = this.helperService.generateOtp(6)
    const otp = await this.authService.saveOtp({ code, email })

    await this.mailService.send({
      to: email,
      subject: "Email Validation",
      text: `Validate with your otp code: ${otp.code}. Your code expires in 10mins`
    })

    const shortTimeToken = await this.helperService.generateToken(
      { email, id: user.id },
      this.configService.get<IAuth>("auth").shortTimeJwtSecret,
      "1h"
    )

    return { token: shortTimeToken }
  }

  @Public()
  @Post("/login/password")
  @HttpCode(200)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(LoginValidationGuard, PasswordAuthGuard)
  async passwordLogin(@Req() req: Request) {
    const tokens = await this.authService.login({ email: req.user.email, id: req.user.id })

    return { user: req.user, tokens }
  }

  @Public()
  @Get("/oauth/google/redirect")
  @UseGuards(GoogleOAuthGuard)
  async googleLogin() {}

  @Public()
  @Get("oauth/google/callback")
  @HttpCode(200)
  @UseInterceptors(AuthInterceptor)
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    const tokens = await this.authService.login({ email: req.user.email, id: req.user.id })

    return { user: req.user, tokens }
  }

  @Public()
  @Post("/forgotpassword")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body(new JoiValidationPipe(forgotPasswordSchema)) { email }: ForgotPasswordDto) {
    const user = await this.userService.findOne({ email })

    if (!user) return new NotFoundException("user not found!")

    const token = await this.authService.forgotPassword(user)

    const link = this.configService.get<IApp>("app").clientUrl + `/reset-password?token=${token}`

    await this.mailService.send({
      to: email,
      subject: "Password Reset Link",
      text: `see attached ${link} and it expires in 1 hour`
    })

    return "Password link sent successfully"
  }

  @Public()
  @Post("/resetpassword")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body(new JoiValidationPipe(resetPasswordSchema)) { password, token }: ResetPasswordDto) {
    const userId = await this.authService.validateResetToken(token)
    const user = await this.userService.findById(userId)
    await this.userService.update(user, { password })
    return "Password successfully reset"
  }

  @Public()
  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body(new JoiValidationPipe(refreshSchema)) { refreshToken }: RefreshDto) {
    const userId = await this.authService.validateRefreshToken(refreshToken)

    const user = await this.userService.findById(userId)

    if (!user) throw new NotFoundException("user not found")

    return await this.authService.login(user)
  }
}
