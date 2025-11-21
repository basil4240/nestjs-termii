import { Injectable, Inject } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import {
  SendMessageDto,
  SendBulkMessageDto,
  SendTemplateMessageDto,
  MessageType,
  MessageChannel,
} from './dtos/messaging.dto';
import {
  SendMessageResponse,
  SendBulkMessageResponse,
  SendTemplateMessageResponse,
} from './responses/messaging.response';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';

@Injectable()
export class MessagingService {
  constructor(
    private readonly httpService: TermiiHttpService,
    @Inject(TERmii_MODULE_OPTIONS)
    private readonly options: TermiiModuleOptions,
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponse> {
    const payload = {
      ...sendMessageDto,
      from: sendMessageDto.from || this.options.senderId,
      type: sendMessageDto.type || 'plain',
      channel: sendMessageDto.channel || 'generic',
    };
    return this.httpService.post<any, SendMessageResponse>(
      'api/sms/send',
      payload,
    );
  }

  async sendBulkMessage(
    sendBulkMessageDto: SendBulkMessageDto,
  ): Promise<SendBulkMessageResponse> {
    const payload = {
      ...sendBulkMessageDto,
      to: sendBulkMessageDto.to.join(','), // Termii bulk API expects comma-separated numbers
      from: sendBulkMessageDto.from || this.options.senderId,
      type: sendBulkMessageDto.type || 'plain',
      channel: sendBulkMessageDto.channel || 'generic',
    };
    return this.httpService.post<any, SendBulkMessageResponse>(
      'api/sms/send/bulk',
      payload,
    );
  }

  async sendWithTemplate(
    sendTemplateMessageDto: SendTemplateMessageDto,
  ): Promise<SendTemplateMessageResponse> {
    const payload = {
      ...sendTemplateMessageDto,
      from: sendTemplateMessageDto.from || this.options.senderId,
      channel: 'whatsapp', // Templates are typically for WhatsApp, forcing this for now
    };
    // Assuming a placeholder endpoint for generic template messages
    // This will need to be adjusted based on the actual Termii API for templates.
    return this.httpService.post<any, SendTemplateMessageResponse>(
      'api/send/template',
      payload,
    );
  }
}
