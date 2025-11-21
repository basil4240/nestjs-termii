import { Injectable } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import {
  ListConversationsDto,
  ToggleReadStatusDto,
  SendConversationMessageDto,
} from './dtos/conversations.dto';
import {
  ListConversationsResponse,
  ToggleReadStatusResponse,
  SendConversationMessageResponse,
} from './responses/conversations.response';

@Injectable()
export class ConversationsService {
  constructor(private readonly httpService: TermiiHttpService) {}

  async listConversations(
    listConversationsDto?: ListConversationsDto,
  ): Promise<ListConversationsResponse> {
    return this.httpService.get<ListConversationsDto, ListConversationsResponse>(
      'api/conversations',
      listConversationsDto,
    );
  }

  async toggleReadStatus(
    conversationId: string,
    toggleReadStatusDto: ToggleReadStatusDto,
  ): Promise<ToggleReadStatusResponse> {
    return this.httpService.post<ToggleReadStatusDto, ToggleReadStatusResponse>(
      `api/conversations/${conversationId}/toggle-read`,
      toggleReadStatusDto,
    );
  }

  async sendConversationMessage(
    conversationId: string,
    sendConversationMessageDto: SendConversationMessageDto,
  ): Promise<SendConversationMessageResponse> {
    return this.httpService.post<
      SendConversationMessageDto,
      SendConversationMessageResponse
    >(`api/conversations/${conversationId}/messages`, sendConversationMessageDto);
  }
}
