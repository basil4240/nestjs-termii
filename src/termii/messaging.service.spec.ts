import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { TermiiHttpService } from './termii-http.service';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';
import {
  SendMessageDto,
  SendBulkMessageDto,
  SendTemplateMessageDto,
} from './dtos/messaging.dto';
import {
  SendMessageResponse,
  SendBulkMessageResponse,
  SendTemplateMessageResponse,
} from './responses/messaging.response';

describe('MessagingService', () => {
  let service: MessagingService;
  let httpService: TermiiHttpService;
  let options: TermiiModuleOptions;

  const mockTermiiHttpService = {
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
        MessagingService,
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

    service = module.get<MessagingService>(MessagingService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
    options = module.get<TermiiModuleOptions>(TERmii_MODULE_OPTIONS);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a single message with default senderId and type/channel', async () => {
      const sendMessageDto: SendMessageDto = {
        to: '2348012345678',
        sms: 'Hello from Termii!',
      };
      const expectedPayload = {
        ...sendMessageDto,
        from: options.senderId,
        type: 'plain',
        channel: 'generic',
      };
      const result: SendMessageResponse = {
        message_id: 'msg_id_1',
        message: 'Successfully Sent',
        balance: 999,
        user: 'Termii',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendMessage(sendMessageDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/send',
        expectedPayload,
      );
    });

    it('should send a single message with custom senderId, type, and channel', async () => {
      const sendMessageDto: SendMessageDto = {
        to: '2348012345678',
        sms: 'Unicode test!',
        from: 'CUSTOM_SENDER',
        type: 'unicode',
        channel: 'whatsapp',
      };
      const expectedPayload = {
        ...sendMessageDto,
      };
      const result: SendMessageResponse = {
        message_id: 'msg_id_2',
        message: 'Successfully Sent',
        balance: 998,
        user: 'Termii',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendMessage(sendMessageDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/send',
        expectedPayload,
      );
    });
  });

  describe('sendBulkMessage', () => {
    it('should send a bulk message with default senderId and type/channel', async () => {
      const sendBulkMessageDto: SendBulkMessageDto = {
        to: ['2348011111111', '2348022222222'],
        sms: 'Bulk message!',
      };
      const expectedPayload = {
        to: sendBulkMessageDto.to.join(','),
        sms: sendBulkMessageDto.sms,
        from: options.senderId,
        type: 'plain',
        channel: 'generic',
      };
      const result: SendBulkMessageResponse = {
        message: 'Successfully Sent',
        message_id: ['bulk_msg_id_1', 'bulk_msg_id_2'],
        balance: 990,
        user: 'Termii',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendBulkMessage(sendBulkMessageDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/send/bulk',
        expectedPayload,
      );
    });

    it('should send a bulk message with custom senderId, type, and channel', async () => {
      const sendBulkMessageDto: SendBulkMessageDto = {
        to: ['2348011111111', '2348022222222'],
        sms: 'Bulk unicode!',
        from: 'BULK_SENDER',
        type: 'unicode',
        channel: 'dnd',
      };
      const expectedPayload = {
        to: sendBulkMessageDto.to.join(','),
        sms: sendBulkMessageDto.sms,
        from: sendBulkMessageDto.from,
        type: sendBulkMessageDto.type,
        channel: sendBulkMessageDto.channel,
      };
      const result: SendBulkMessageResponse = {
        message: 'Successfully Sent',
        message_id: ['bulk_msg_id_3', 'bulk_msg_id_4'],
        balance: 980,
        user: 'Termii',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendBulkMessage(sendBulkMessageDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/send/bulk',
        expectedPayload,
      );
    });
  });

  describe('sendWithTemplate', () => {
    it('should send a template message', async () => {
      const sendTemplateMessageDto: SendTemplateMessageDto = {
        to: '2348012345678',
        template_id: 'template_123',
        data: { name: 'John Doe', otp: '12345' },
        channel: 'whatsapp',
      };
      const expectedPayload = {
        ...sendTemplateMessageDto,
        from: options.senderId,
      };
      const result: SendTemplateMessageResponse = {
        message_id: 'template_msg_id_1',
        message: 'Successfully Sent',
        balance: 970,
        user: 'Termii',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendWithTemplate(sendTemplateMessageDto)).toEqual(
        result,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'api/send/template',
        expectedPayload,
      );
    });
  });
});
