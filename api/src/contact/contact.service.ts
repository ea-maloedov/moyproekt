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
    const adminText = [
      dto.name ? `Имя: ${dto.name}` : null,
      `Email: ${dto.email}`,
      dto.agency_size ? `Агентство: ${dto.agency_size}` : null,
      dto.message ? `\nСообщение:\n${dto.message}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const clientHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f0efe9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0efe9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Лого -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <span style="font-size:18px;font-weight:700;color:#0a0a0a;letter-spacing:-0.5px;">
                Мой<span style="color:#2563ff;">Проект</span>
              </span>
            </td>
          </tr>

          <!-- Карточка -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:40px;border:1px solid #e4e3dc;">

              <!-- Иконка -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <div style="width:52px;height:52px;background:#eef2ff;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:26px;line-height:52px;text-align:center;">✓</div>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:22px;font-weight:700;color:#0a0a0a;letter-spacing:-0.5px;padding-bottom:12px;line-height:1.2;">
                    Заявка получена!
                  </td>
                </tr>
                <tr>
                  <td style="font-size:15px;color:#8a8a82;line-height:1.6;padding-bottom:32px;">
                    ${dto.name ? `Привет, ${dto.name}! ` : ''}Мы получили вашу заявку и уже изучаем её.
                    Ответим в течение рабочего дня — расскажем подробнее о МойПроект
                    и обсудим, как он подойдёт именно вашему агентству.
                  </td>
                </tr>

                <!-- Разделитель -->
                <tr>
                  <td style="border-top:1px solid #e4e3dc;padding-bottom:28px;"></td>
                </tr>

                <!-- Что дальше -->
                <tr>
                  <td style="font-size:12px;font-weight:600;color:#8a8a82;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:16px;">
                    Что дальше
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#eef2ff;border-radius:8px;text-align:center;line-height:28px;font-size:13px;color:#2563ff;font-weight:700;vertical-align:top;">1</td>
                        <td style="padding-left:12px;font-size:14px;color:#0a0a0a;vertical-align:top;line-height:1.5;">Мы свяжемся с вами по email в течение рабочего дня</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#eef2ff;border-radius:8px;text-align:center;line-height:28px;font-size:13px;color:#2563ff;font-weight:700;vertical-align:top;">2</td>
                        <td style="padding-left:12px;font-size:14px;color:#0a0a0a;vertical-align:top;line-height:1.5;">Проведём короткую демонстрацию портала</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:32px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;height:28px;background:#eef2ff;border-radius:8px;text-align:center;line-height:28px;font-size:13px;color:#2563ff;font-weight:700;vertical-align:top;">3</td>
                        <td style="padding-left:12px;font-size:14px;color:#0a0a0a;vertical-align:top;line-height:1.5;">Дадим ранний доступ на специальных условиях</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="background:#0a0a0a;border-radius:12px;padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:14px;color:#8a8a82;padding-bottom:4px;">Есть вопросы? Пишите напрямую</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="mailto:hello@moyproek.ru" style="color:#2563ff;font-size:15px;font-weight:600;text-decoration:none;">hello@moyproek.ru</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Футер -->
          <tr>
            <td style="padding:24px 0 0 0;text-align:center;font-size:12px;color:#8a8a82;line-height:1.6;">
              © 2026 МойПроект · <a href="https://moyproek.ru" style="color:#8a8a82;">moyproek.ru</a><br>
              Вы получили это письмо, потому что оставили заявку на сайте.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const [adminResult, clientResult] = await Promise.allSettled([
      // Уведомление себе
      this.transporter.sendMail({
        from: `"МойПроект" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        replyTo: dto.email,
        subject: `Новая заявка от ${dto.name ?? dto.email}`,
        text: adminText,
      }),
      // Подтверждение клиенту
      this.transporter.sendMail({
        from: `"МойПроект" <${process.env.SMTP_USER}>`,
        to: dto.email,
        subject: 'Заявка получена — скоро свяжемся!',
        html: clientHtml,
      }),
    ]);

    if (adminResult.status === 'rejected') {
      this.logger.error('Ошибка отправки письма администратору', adminResult.reason);
      throw new InternalServerErrorException('Не удалось отправить письмо');
    }

    if (clientResult.status === 'rejected') {
      this.logger.warn('Не удалось отправить подтверждение клиенту', clientResult.reason);
    }
  }
}
