// src/termii/dtos/conversations.dto.ts

export class ListConversationsDto {
  page?: number;
  per_page?: number;
}

export class ToggleReadStatusDto {
  is_read: boolean;
}

export class SendConversationMessageDto {
  message: string;
}
