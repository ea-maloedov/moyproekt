import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './contact.controller';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  private transporter = nodemailer.createTransport({
    host: 'smtp.spaceweb.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async send(dto: ContactDto) {
    const lines = [
      dto.name ? `Имя: ${dto.name}` : null,
      `Email: ${dto.email}`,
      dto.agency_size ? `Агентство: ${dto.agency_size}` : null,
      dto.message ? `\nСообщение:\n${dto.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await this.transporter.sendMail({
        from: `"МойПроект" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `Новая заявка от ${dto.name ?? dto.email}`,
        text: lines,
      });
    } catch (err) {
      this.logger.error('Ошибка отправки письма', err);
      throw new InternalServerErrorException('Не удалось отправить письмо');
    }
  }
}
