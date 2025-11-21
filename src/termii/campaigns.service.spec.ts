import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { TermiiHttpService } from './termii-http.service';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';
import {
  FetchCampaignsResponse,
  FetchCampaignHistoryResponse,
  SendCampaignResponse,
} from './responses/campaigns.response';
import {
  FetchCampaignsDto,
  FetchCampaignHistoryDto,
  SendCampaignDto,
} from './dtos/campaigns.dto';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let httpService: TermiiHttpService;
  let options: TermiiModuleOptions;

  const mockTermiiHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockTermiiModuleOptions: TermiiModuleOptions = {
    apiKey: 'test_api_key',
    senderId: 'GLOBAL_SENDER',
    baseUrl: 'https://api.test.termii.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: TermiiHttpService,
          useValue: mockTermiiHttpService,
        },
        {
          provide: TERmii_MODULE_OPTIONS,
          useValue: mockTermiiModuleOptions,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
    options = module.get<TermiiModuleOptions>(TERmii_MODULE_OPTIONS);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchCampaigns', () => {
    it('should fetch a list of campaigns', async () => {
      const result: FetchCampaignsResponse = {
        data: [{ id: 'c1', name: 'Test Campaign', status: 'sent', total_recipients: 100, date_created: '2023-01-01' }],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.fetchCampaigns()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/campaigns', undefined);
    });

    it('should fetch a list of campaigns with pagination', async () => {
      const dto: FetchCampaignsDto = { page: 1, per_page: 10 };
      const result: FetchCampaignsResponse = {
        data: [{ id: 'c1', name: 'Test Campaign', status: 'sent', total_recipients: 100, date_created: '2023-01-01' }],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.fetchCampaigns(dto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/campaigns', dto);
    });
  });

  describe('fetchCampaignHistory', () => {
    it('should fetch campaign history', async () => {
      const dto: FetchCampaignHistoryDto = { campaign_id: 'c1' };
      const result: FetchCampaignHistoryResponse = {
        data: [{ event: 'sent', timestamp: '2023-01-01', details: 'Message sent' }],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.fetchCampaignHistory(dto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/campaigns/c1/history');
    });
  });

  describe('sendCampaign', () => {
    it('should send a campaign with recipients and default senderId', async () => {
      const sendCampaignDto: SendCampaignDto = {
        campaign_name: 'New Campaign',
        message: 'Hello World',
        recipients: ['2348012345678', '2348012345679'],
        channel: 'generic',
        message_type: 'plain',
      };
      const expectedPayload = {
        campaign_name: sendCampaignDto.campaign_name,
        message: sendCampaignDto.message,
        recipients: '2348012345678,2348012345679',
        channel: sendCampaignDto.channel,
        message_type: sendCampaignDto.message_type,
        sender_id: options.senderId,
      };
      const result: SendCampaignResponse = {
        message: 'Campaign sent',
        campaign_id: 'c2',
        status: 'sent',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendCampaign(sendCampaignDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/campaigns/send',
        expectedPayload,
      );
    });

    it('should send a campaign with phonebook_id and custom senderId', async () => {
      const sendCampaignDto: SendCampaignDto = {
        campaign_name: 'Scheduled Campaign',
        message: 'Scheduled message',
        phonebook_id: 'pb1',
        channel: 'dnd',
        message_type: 'unicode',
        sender_id: 'CustomSender',
        schedule_time: '2023-12-01T10:00:00Z',
      };
      const expectedPayload = {
        campaign_name: sendCampaignDto.campaign_name,
        message: sendCampaignDto.message,
        phonebook_id: sendCampaignDto.phonebook_id,
        channel: sendCampaignDto.channel,
        message_type: sendCampaignDto.message_type,
        sender_id: sendCampaignDto.sender_id,
        schedule_time: sendCampaignDto.schedule_time,
      };
      const result: SendCampaignResponse = {
        message: 'Campaign scheduled',
        campaign_id: 'c3',
        status: 'scheduled',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendCampaign(sendCampaignDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/campaigns/send',
        expectedPayload,
      );
    });
  });
});
