// src/termii/responses/messaging.response.ts

export interface SendMessageResponse {
  message_id: string;
  message: string;
  balance: number;
  user: string;
}

export interface SendBulkMessageResponse {
  message: string;
  message_id: string[]; // Termii might return an array of message_ids
  balance: number;
  user: string;
}

export interface SendTemplateMessageResponse {
  message_id: string;
  message: string;
  balance: number;
  user: string;
}
