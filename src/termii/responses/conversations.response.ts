// src/termii/responses/conversations.response.ts

export interface ConversationItem {
  id: string;
  contact_number: string;
  last_message: string;
  last_message_timestamp: string;
  is_read: boolean;
  // Add other fields based on actual API response
}

export interface ListConversationsResponse {
  data: ConversationItem[];
  // Potentially pagination links/meta
}

export interface ToggleReadStatusResponse {
  message: string;
  conversation_id: string;
  is_read: boolean;
}

export interface SendConversationMessageResponse {
  message: string;
  message_id: string;
}
