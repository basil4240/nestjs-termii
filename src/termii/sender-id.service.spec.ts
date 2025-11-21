import { Test, TestingModule } from '@nestjs/testing';
import { SenderIdService } from './sender-id.service';
import { TermiiHttpService } from './termii-http.service';
import {
  ListSenderIdsResponse,
  RequestSenderIdResponse,
} from './responses/sender-id.response';
import { RequestSenderIdDto } from './dtos/sender-id.dto';

describe('SenderIdService', () => {
  let service: SenderIdService;
  let httpService: TermiiHttpService;

  const mockTermiiHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SenderIdService,
        {
          provide: TermiiHttpService,
          useValue: mockTermiiHttpService,
        },
      ],
    }).compile();

    service = module.get<SenderIdService>(SenderIdService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of sender IDs', async () => {
      const result: ListSenderIdsResponse = {
        data: [
          { sender_id: 'Termii', status: 'active', created_at: '2023-01-01' },
        ],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.list()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/sender-id');
    });
  });

  describe('request', () => {
    it('should request a new sender ID', async () => {
      const requestSenderIdDto: RequestSenderIdDto = {
        sender_id: 'MyCompany',
        usecase: 'Marketing',
        company: 'My Company Inc.',
      };
      const result: RequestSenderIdResponse = {
        message: 'Sender ID request sent successfully',
        sender_id: 'MyCompany',
        status: 'pending',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.request(requestSenderIdDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sender-id/request',
        requestSenderIdDto,
      );
    });
  });
});
