import { Injectable, Inject } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import { SendTokenDto, VerifyTokenDto, InAppTokenDto } from './dtos/token.dto';
import {
  SendTokenResponse,
  VerifyTokenResponse,
  InAppTokenResponse,
} from './responses/token.response';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly httpService: TermiiHttpService,
    @Inject(TERmii_MODULE_OPTIONS)
    private readonly options: TermiiModuleOptions,
  ) {}

  async sendToken(sendTokenDto: SendTokenDto): Promise<SendTokenResponse> {
    const endpoint = this.getTokenSendEndpoint(sendTokenDto.channel);
    const payload = {
      ...sendTokenDto,
      from: sendTokenDto.from || this.options.senderId,
      pin_time_to_live: sendTokenDto.pin_time_to_live,
      pin_type: sendTokenDto.pin_type || sendTokenDto.message_type,
      pin_placeholder: sendTokenDto.pin_placeholder,
      message_text: sendTokenDto.message_text,
    };
    return this.httpService.post<any, SendTokenResponse>(endpoint, payload);
  }

  async verifyToken(
    verifyTokenDto: VerifyTokenDto,
  ): Promise<VerifyTokenResponse> {
    const payload = {
      pin_id: verifyTokenDto.pin_id,
      pin: verifyTokenDto.pin,
    };
    return this.httpService.post<any, VerifyTokenResponse>(
      'api/sms/otp/verify',
      payload,
    );
  }

  async inAppToken(inAppTokenDto?: InAppTokenDto): Promise<InAppTokenResponse> {
    const payload = {
      ...inAppTokenDto,
      pin_type: inAppTokenDto?.pin_type || 'NUMERIC', // Default to NUMERIC if not provided
      // api_key is handled by TermiiHttpService
    };
    return this.httpService.post<any, InAppTokenResponse>(
      'api/sms/otp/generate', // Corrected endpoint
      payload,
    );
  }

  private getTokenSendEndpoint(channel: string): string {
    switch (channel) {
      case 'dnd':
      case 'sms': // DND and SMS usually share the same endpoint
        return 'api/sms/otp/send';
      case 'whatsapp':
        return 'api/whatsapp/otp/send';
      case 'voice':
        return 'api/voice/otp/call';
      default:
        throw new Error(`Unsupported token channel: ${channel}`);
    }
  }
}
