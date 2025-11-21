// src/termii/dtos/campaigns.dto.ts

export class FetchCampaignsDto {
  page?: number;
  per_page?: number;
}

export class FetchCampaignHistoryDto {
  campaign_id: string;
}

export type CampaignMessageChannel = 'dnd' | 'whatsapp' | 'generic';
export type CampaignMessageType = 'plain' | 'unicode';

export class SendCampaignDto {
  campaign_name: string;
  sender_id?: string; // Optional: overrides global senderId
  message: string;
  recipients?: string[]; // Array of phone numbers
  phonebook_id?: string; // Or a phonebook ID
  channel: CampaignMessageChannel;
  message_type: CampaignMessageType;
  schedule_time?: string; // ISO 8601 format for scheduled campaigns
}
