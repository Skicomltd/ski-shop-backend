import { Request } from "express"
import { map, Observable } from "rxjs"
import { Controller, Get, MessageEvent, Param, ParseUUIDPipe, Patch, Req, Sse } from "@nestjs/common"

import { NotificationsService } from "@services/notifications/notifications.service"

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse("users/:userId")
  user(@Param("userId", ParseUUIDPipe) userId: string): Observable<MessageEvent> {
    return this.notificationsService.subscribe(userId).pipe(map((notification) => ({ data: notification })))
  }

  @Get("")
  async find(@Req() req: Request) {
    const user = req.user
    return await this.notificationsService.find({ notifiableId: user.id })
  }

  @Patch("read-all")
  async markAllAsRead(@Req() req: Request) {
    return this.notificationsService.markAllAsRead(req.user.id)
  }

  @Patch("unread-all")
  async markAllAsUnread(@Req() req: Request) {
    return this.notificationsService.markAllAsUnread(req.user.id)
  }

  @Patch(":id/read")
  async markAsRead(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.notificationsService.markAsRead(id, req.user.id)
  }

  @Patch(":id/unread")
  async markAsUnread(@Param("id", ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.notificationsService.markAsUnread(id, req.user.id)
  }
}
