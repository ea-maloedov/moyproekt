import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

export class ContactDto {
  name?: string;
  email!: string;
  message?: string;
  agency_size?: string;
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async send(@Body() dto: ContactDto) {
    await this.contactService.send(dto);
    return { ok: true };
  }
}
