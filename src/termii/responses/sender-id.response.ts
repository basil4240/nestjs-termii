// src/termii/responses/sender-id.response.ts

export interface SenderIdItem {
  sender_id: string;
  status: string;
  created_at: string;
}

export interface ListSenderIdsResponse {
  data: SenderIdItem[];
}

export interface RequestSenderIdResponse {
  message: string;
  sender_id: string;
  status: string;
}
