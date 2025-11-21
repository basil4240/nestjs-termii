import { Injectable, Inject } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import {
  FetchCampaignsDto,
  FetchCampaignHistoryDto,
  SendCampaignDto,
} from './dtos/campaigns.dto';
import {
  FetchCampaignsResponse,
  FetchCampaignHistoryResponse,
  SendCampaignResponse,
} from './responses/campaigns.response';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly httpService: TermiiHttpService,
    @Inject(TERmii_MODULE_OPTIONS)
    private readonly options: TermiiModuleOptions,
  ) {}

  async fetchCampaigns(
    fetchCampaignsDto?: FetchCampaignsDto,
  ): Promise<FetchCampaignsResponse> {
    return this.httpService.get<FetchCampaignsDto, FetchCampaignsResponse>(
      'api/campaigns',
      fetchCampaignsDto,
    );
  }

  async fetchCampaignHistory(
    fetchCampaignHistoryDto: FetchCampaignHistoryDto,
  ): Promise<FetchCampaignHistoryResponse> {
    return this.httpService.get<any, FetchCampaignHistoryResponse>(
      `api/campaigns/${fetchCampaignHistoryDto.campaign_id}/history`,
    );
  }

  async sendCampaign(
    sendCampaignDto: SendCampaignDto,
  ): Promise<SendCampaignResponse> {
    const payload = {
      ...sendCampaignDto,
      sender_id: sendCampaignDto.sender_id || this.options.senderId,
      // Termii API expects recipients as comma-separated string if phone numbers are used directly
      // Or phonebook_id if a phonebook is used.
      // This implementation assumes 'recipients' is an array of strings, or phonebook_id is present.
      recipients: sendCampaignDto.recipients
        ? sendCampaignDto.recipients.join(',')
        : undefined,
      // If phonebook_id is used, `recipients` field should not be sent.
      // Need to adjust this if Termii API needs more complex logic here.
    };

    // Clean up payload to send only relevant fields
    const finalPayload = {
      campaign_name: payload.campaign_name,
      sender_id: payload.sender_id,
      message: payload.message,
      channel: payload.channel,
      message_type: payload.message_type,
      schedule_time: payload.schedule_time,
      ...(payload.recipients ? { recipients: payload.recipients } : {}),
      ...(sendCampaignDto.phonebook_id
        ? { phonebook_id: sendCampaignDto.phonebook_id }
        : {}),
    };

    return this.httpService.post<any, SendCampaignResponse>(
      'api/campaigns/send',
      finalPayload,
    );
  }
}
