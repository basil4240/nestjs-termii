// src/termii/dtos/token.dto.ts

export type PinType =
  | 'NUMERIC'
  | 'ALPHANUMERIC'
  | 'ALPHANUMERIC_UPPER'
  | 'ALPHANUMERIC_LOWER';
export type TokenChannel = 'dnd' | 'whatsapp' | 'voice';

export class SendTokenDto {
  message_type: 'NUMERIC' | 'ALPHANUMERIC';
  to: string;
  from?: string; // Optional: overrides global senderId
  channel: TokenChannel;
  code?: string; // Custom OTP code
  pin_attempts?: number;
  pin_time_to_live?: number;
  pin_length?: number;
  pin_type?: PinType;
  pin_placeholder?: string;
  message_text: string;
}

export class VerifyTokenDto {
  pin_id: string;
  pin: string;
}

export class InAppTokenDto {
  phone_number: string;
  pin_attempts?: number;
  pin_time_to_live?: number;
  pin_length?: number;
  pin_type?: PinType;
}
