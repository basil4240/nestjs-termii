import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { TermiiHttpService } from './termii-http.service';
import {
  ListConversationsResponse,
  ToggleReadStatusResponse,
  SendConversationMessageResponse,
} from './responses/conversations.response';
import {
  ListConversationsDto,
  ToggleReadStatusDto,
  SendConversationMessageDto,
} from './dtos/conversations.dto';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let httpService: TermiiHttpService;

  const mockTermiiHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        {
          provide: TermiiHttpService,
          useValue: mockTermiiHttpService,
        },
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listConversations', () => {
    it('should return a list of conversations', async () => {
      const result: ListConversationsResponse = {
        data: [
          {
            id: 'conv1',
            contact_number: '23480',
            last_message: 'Hi',
            last_message_timestamp: 'today',
            is_read: true,
          },
        ],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.listConversations()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/conversations', undefined);
    });

    it('should return a list of conversations with pagination', async () => {
      const dto: ListConversationsDto = { page: 1, per_page: 10 };
      const result: ListConversationsResponse = {
        data: [
          {
            id: 'conv1',
            contact_number: '23480',
            last_message: 'Hi',
            last_message_timestamp: 'today',
            is_read: true,
          },
        ],
      };
      mockTermiiHttpService.get.mockResolvedValue(result);

      expect(await service.listConversations(dto)).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/conversations', dto);
    });
  });

  describe('toggleReadStatus', () => {
    it('should toggle the read status of a conversation', async () => {
      const conversationId = 'conv1';
      const dto: ToggleReadStatusDto = { is_read: false };
      const result: ToggleReadStatusResponse = {
        message: 'Status updated',
        conversation_id: 'conv1',
        is_read: false,
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.toggleReadStatus(conversationId, dto)).toEqual(
        result,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        'api/conversations/conv1/toggle-read',
        dto,
      );
    });
  });

  describe('sendConversationMessage', () => {
    it('should send a message within a conversation', async () => {
      const conversationId = 'conv1';
      const dto: SendConversationMessageDto = { message: 'New message' };
      const result: SendConversationMessageResponse = {
        message: 'Message sent',
        message_id: 'msg1',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(
        await service.sendConversationMessage(conversationId, dto),
      ).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/conversations/conv1/messages',
        dto,
      );
    });
  });
});
