import { Test, TestingModule } from '@nestjs/testing';
import { InsightsService } from './insights.service';
import { TermiiHttpService } from './termii-http.service';
import {
  GetBalanceResponse,
  SearchNumberResponse,
  GetStatusResponse,
  GetHistoryResponse,
} from './responses/insights.response';
import {
  SearchNumberDto,
  GetStatusDto,
  GetHistoryDto,
} from './dtos/insights.dto';
import { TERmii_MODULE_OPTIONS } from './termii.constants';

describe('InsightsService', () => {
  let service: InsightsService;
  let httpService: TermiiHttpService;

  const mockTermiiHttpService = {
    get: jest.fn(),
  };

  const mockTermiiModuleOptions = {
    apiKey: 'test_api_key',
    senderId: 'TestSender',
    baseUrl: 'https://api.test.termii.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsightsService,
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

    service = module.get<InsightsService>(InsightsService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBalance', () => {
    it('should return balance information', async () => {
      const result: GetBalanceResponse = {
        user: { balance: 1000, currency: 'NGN' },
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.getBalance()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/get-balance');
    });
  });

  describe('search', () => {
    it('should search for a phone number', async () => {
      const searchNumberDto: SearchNumberDto = {
        phone_number: '2348012345678',
      };
      const result: SearchNumberResponse = {
        number: '2348012345678',
        network: 'MTN',
        status: 'DND',
        ported: 'false',
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.search(searchNumberDto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith(
        'api/check/dnd',
        searchNumberDto,
      );
    });
  });

  describe('getStatus', () => {
    it('should get message status', async () => {
      const getStatusDto: GetStatusDto = { message_id: 'some_message_id' };
      const result: GetStatusResponse = {
        status: 'delivered',
        message_id: 'some_message_id',
        sender_id: 'Termii',
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.getStatus(getStatusDto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith(
        'api/sms/status',
        getStatusDto,
      );
    });
  });

  describe('getHistory', () => {
    it('should get message history', async () => {
      const getHistoryDto: GetHistoryDto = { page: 1, per_page: 10 };
      const result: GetHistoryResponse = {
        data: [],
        links: { first: '', last: '', prev: null, next: null },
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          path: '',
          per_page: 10,
          to: 10,
          total: 0,
        },
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.getHistory(getHistoryDto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith(
        'api/sms/inbox',
        getHistoryDto,
      );
    });

    it('should get message history without DTO', async () => {
      const result: GetHistoryResponse = {
        data: [],
        links: { first: '', last: '', prev: null, next: null },
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          path: '',
          per_page: 10,
          to: 10,
          total: 0,
        },
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.getHistory()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/sms/inbox', undefined);
    });
  });
});
