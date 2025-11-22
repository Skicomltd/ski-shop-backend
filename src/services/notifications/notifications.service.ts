import { Subject } from "rxjs"
import { Inject, Injectable, Optional } from "@nestjs/common"
import { OnEvent, EventEmitter2 } from "@nestjs/event-emitter"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyOptions, Repository } from "typeorm"

import { Notification } from "./entities/notification.entity"
import { IQueryFilter } from "./interfaces/query-filter.interface"
import { INotificationPayload } from "./interfaces/notification.interface"
import { NotificationContract } from "./contracts/notification.contract"
import { MailService } from "../mail/mail.service"
import { PushService } from "../push/push.service"
import { NOTIFICATION_CONFIG_OPTION, NOTIFICATION_EVENT } from "./entities/config"
import { NotificationModuleOptions } from "./interfaces/config.interface"

@Injectable()
export class NotificationsService {
  private streams = new Map<string, Subject<INotificationPayload>>()

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @Inject(NOTIFICATION_CONFIG_OPTION) protected options: NotificationModuleOptions,
    @Optional() private readonly pushService?: PushService,
    @Optional() private readonly mailService?: MailService
  ) {}

  // ---------- PUBLIC API (only these are exported) ----------
  public subscribe(topic: string) {
    if (!this.streams.has(topic)) {
      this.streams.set(topic, new Subject<INotificationPayload>())
    }
    return this.streams.get(topic).asObservable()
  }

  public async find({ notifiableId, type, isRead = false }: IQueryFilter) {
    const whereConditions: FindManyOptions<Notification>["where"] = {}

    if (type) {
      whereConditions.type = type
    }

    if (isRead) {
      whereConditions.isRead = isRead
    }

    if (notifiableId) {
      whereConditions.notifiableId = notifiableId
    }

    return await this.notificationRepository.find({ where: whereConditions })
  }

  public notify(event: NotificationContract) {
    this.eventEmitter.emit(NOTIFICATION_EVENT, event)
  }

  // ---------- READ / MARK FUNCTIONALITIES ----------

  public async markAsRead(notificationId: string, notifiableId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, notifiableId }
    })

    if (!notification) return null

    if (!notification.isRead) {
      notification.isRead = true
      await this.notificationRepository.save(notification)
    }

    return notification
  }

  public async markAsUnread(notificationId: string, notifiableId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, notifiableId }
    })

    if (!notification) return null

    if (notification.isRead) {
      notification.isRead = false
      await this.notificationRepository.save(notification)
    }

    return notification
  }

  // ---------- BULK MARK ----------

  public async markAllAsRead(notifiableId: string) {
    await this.notificationRepository.update({ notifiableId, isRead: false }, { isRead: true })

    return { success: true }
  }

  public async markAllAsUnread(notifiableId: string) {
    await this.notificationRepository.update({ notifiableId, isRead: true }, { isRead: false })

    return { success: true }
  }

  // ---------- INTERNAL EVENT LISTENER (encapsulated) ----------
  @OnEvent(NOTIFICATION_EVENT, { async: true })
  protected async onCreateNotification(event: NotificationContract) {
    if (event.via().includes("database")) {
      this.database(event)
    }
    if (event.via().includes("broadcast")) {
      this.broadcast(event)
    }
    if (event.via().includes("mail") && this.mailService) {
      this.mail(event)
    }
    if (event.via().includes("sms")) {
      this.sms(event)
    }
    if (event.via().includes("push") && this.pushService) {
      this.push(event)
    }
  }

  // ---------- PRIVATE CHANNEL HANDLERS ----------
  private async broadcast(event: NotificationContract) {
    const { topic = event.notifiable.id, data } = event.toBroadCast()

    const payload: INotificationPayload = {
      id: "",
      type: event.type,
      data,
      timestamp: new Date().toISOString()
    }

    if (!this.streams.has(topic)) {
      this.streams.set(topic, new Subject<INotificationPayload>())
    }
    this.streams.get(topic).next(payload)
  }

  private async database(event: NotificationContract) {
    const notification = this.notificationRepository.create({
      type: event.type,
      data: event.toDatabase(),
      notifiableId: event.notifiable.id
    })
    await this.notificationRepository.save(notification)
  }

  private async mail(event: NotificationContract) {
    const mailable = event.toMail()
    const transporter = mailable.client ?? this.options.mail.default

    if (event.isQueued()) {
      await this.mailService?.getTransporter(transporter).queue(mailable)
    } else {
      await this.mailService?.getTransporter(transporter).send(mailable)
    }
  }

  private async sms(event: NotificationContract) {
    // eslint-disable-next-line no-console
    console.log(event.toSms())
  }

  private async push(event: NotificationContract) {
    if (event.isQueued()) {
      this.pushService.queue(event.toPush())
    } else {
      await this.pushService.send(event.toPush())
    }
  }
}
