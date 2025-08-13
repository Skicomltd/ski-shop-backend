import { Controller, Get, Body, Patch, Param, Delete, Query, Req } from "@nestjs/common"
import { VoucherService } from "./voucher.service"
import { UpdateVoucherDto } from "./dto/update-voucher.dto"
import { IVoucherQueryFilter } from "./interface/query-filter"
import { Request } from "express"
import { BadReqException } from "@/exceptions/badRequest.exception"
import { NotFoundException } from "@/exceptions/notfound.exception"
import { VoucherEnum } from "./enum/voucher-enum"

@Controller("voucher")
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  findAll(@Query() query: IVoucherQueryFilter) {
    return this.voucherService.find(query)
  }

  @Get("validate")
  async validateVoucher(@Query() code: string, @Req() req: Request) {
    if (!code) {
      throw new BadReqException("coupon code is required")
    }
    const user = req.user

    const voucher = await this.voucherService.findOne({ userId: user.id, code: code })

    if (!voucher) {
      throw new NotFoundException("Voucher for user currently does not exist")
    }

    if (voucher.status === VoucherEnum.REDEEMED || voucher.status === VoucherEnum.EXPIRED) {
      throw new BadReqException("Voucher already used")
    }

    return "Voucher is valid"
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.voucherService.findOne({ id })
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    const voucher = await this.voucherService.findById(id)
    return this.voucherService.update(voucher, updateVoucherDto)
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.voucherService.remove({ id })
  }
}
