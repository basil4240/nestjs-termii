// src/termii/responses/token.response.ts

export interface SendTokenResponse {
  pinId: string;
  to: string;
  smsStatus: string;
  // Other fields might be present depending on channel (e.g., voiceStatus, whatsappStatus)
}

export interface VerifyTokenResponse {
  pinId: string;
  verified: boolean;
  msisdn: string;
  attemptsLeft: number;
}

export interface InAppTokenResponse {
  pinId: string;
  otp: string;
  phoneNumber: string;
}
