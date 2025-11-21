// src/termii/dtos/messaging.dto.ts

export type MessageType = 'plain' | 'unicode';
export type MessageChannel = 'dnd' | 'whatsapp' | 'generic';

export class SendMessageDto {
  to: string;
  from?: string; // Optional: overrides global senderId
  sms: string;
  type?: MessageType;
  channel?: MessageChannel;
}

export class SendBulkMessageDto {
  to: string[];
  from?: string; // Optional: overrides global senderId
  sms: string;
  type?: MessageType;
  channel?: MessageChannel;
}

export class SendTemplateMessageDto {
  to: string;
  from?: string; // Optional: overrides global senderId
  template_id: string;
  data: Record<string, any>; // Dynamic data for the template
  channel: 'whatsapp'; // Templates are typically for WhatsApp Business API
}
