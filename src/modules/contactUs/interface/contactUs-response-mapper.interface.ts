import { ContactUs } from "../entities/contactUs.entity"
import { IContactUsResponse } from "./contactUs-response.interface"

export abstract class ContactUsResponseMapper implements IInterceptor {
  transform(data: ContactUs): IContactUsResponse {
    return {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      subject: data.subject,
      message: data.message
    }
  }
}
