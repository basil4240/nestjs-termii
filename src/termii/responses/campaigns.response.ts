// src/termii/responses/campaigns.response.ts

export interface CampaignItem {
  id: string;
  name: string;
  status: string;
  total_recipients: number;
  date_created: string;
  // Add other fields based on actual API response
}

export interface FetchCampaignsResponse {
  data: CampaignItem[];
  // Potentially pagination links/meta
}

export interface CampaignHistoryItem {
  event: string;
  timestamp: string;
  details: string;
  // Add other fields based on actual API response
}

export interface FetchCampaignHistoryResponse {
  data: CampaignHistoryItem[];
  // Potentially pagination links/meta
}

export interface SendCampaignResponse {
  message: string;
  campaign_id: string;
  status: string;
  // Potentially other details like balance, user
}
