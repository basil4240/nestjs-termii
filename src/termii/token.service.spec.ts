import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { TermiiHttpService } from './termii-http.service';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';
import { SendTokenDto, VerifyTokenDto, InAppTokenDto } from './dtos/token.dto';
import {
  SendTokenResponse,
  VerifyTokenResponse,
  InAppTokenResponse,
} from './responses/token.response';

describe('TokenService', () => {
  let service: TokenService;
  let httpService: TermiiHttpService;
  let options: TermiiModuleOptions;

  const mockTermiiHttpService = {
    post: jest.fn(),
  };

  const mockTermiiModuleOptions: TermiiModuleOptions = {
    apiKey: 'test_api_key',
    senderId: 'GLOBAL_SENDER',
    baseUrl: 'https://api.test.termii.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: TermiiHttpService,
          useValue: mockTermiiHttpService,
        },
        {
          provide: TERmii_MODULE_OPTIONS,
          useValue: mockTermiiModuleOptions,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
    options = module.get<TermiiModuleOptions>(TERmii_MODULE_OPTIONS);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendToken', () => {
    it('should send an SMS token with default senderId', async () => {
      const sendTokenDto: SendTokenDto = {
        message_type: 'NUMERIC',
        to: '2348012345678',
        channel: 'dnd',
        pin_length: 6,
        pin_time_to_live: 5,
        pin_placeholder: '< 123456 >',
        message_text: 'Your OTP is < 123456 >',
      };
      const expectedPayload = {
        ...sendTokenDto,
        from: options.senderId,
        pin_type: sendTokenDto.message_type,
      };
      const result: SendTokenResponse = {
        pinId: 'some_pin_id',
        to: '2348012345678',
        smsStatus: 'Message sent',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendToken(sendTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/otp/send',
        expectedPayload,
      );
    });

    it('should send a WhatsApp token with custom senderId', async () => {
      const sendTokenDto: SendTokenDto = {
        message_type: 'ALPHANUMERIC',
        to: '2348012345678',
        channel: 'whatsapp',
        from: 'CustomSender',
        pin_length: 6,
        pin_time_to_live: 5,
        pin_placeholder: '< OTP >',
        message_text: 'Your OTP is < OTP >',
      };
      const expectedPayload = {
        ...sendTokenDto,
        from: sendTokenDto.from,
        pin_type: sendTokenDto.message_type,
      };
      const result: SendTokenResponse = {
        pinId: 'some_whatsapp_pin_id',
        to: '2348012345678',
        smsStatus: 'Message sent to whatsapp',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendToken(sendTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/whatsapp/otp/send',
        expectedPayload,
      );
    });

    it('should send a voice token', async () => {
      const sendTokenDto: SendTokenDto = {
        message_type: 'NUMERIC',
        to: '2348012345678',
        channel: 'voice',
        pin_length: 4,
        pin_time_to_live: 5,
        pin_placeholder: '{{code}}',
        message_text: 'Your voice OTP is {{code}}',
      };
      const expectedPayload = {
        ...sendTokenDto,
        from: options.senderId,
        pin_type: sendTokenDto.message_type,
      };
      const result: SendTokenResponse = {
        pinId: 'some_voice_pin_id',
        to: '2348012345678',
        smsStatus: 'Call initiated',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.sendToken(sendTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/voice/otp/call',
        expectedPayload,
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const verifyTokenDto: VerifyTokenDto = {
        pin_id: 'some_pin_id',
        pin: '123456',
      };
      const result: VerifyTokenResponse = {
        pinId: 'some_pin_id',
        verified: true,
        msisdn: '2348012345678',
        attemptsLeft: 2,
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.verifyToken(verifyTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/otp/verify',
        verifyTokenDto,
      );
    });
  });

  describe('inAppToken', () => {
    it('should generate an in-app token', async () => {
      const inAppTokenDto: InAppTokenDto = {
        phone_number: '2348012345678', // Added
        pin_length: 6,
        pin_time_to_live: 10,
        pin_type: 'ALPHANUMERIC', // Added
      };
      const expectedPayload = {
        ...inAppTokenDto,
        pin_type: inAppTokenDto.pin_type || 'NUMERIC',
      };
      const result: InAppTokenResponse = {
        pinId: 'in_app_pin_id',
        otp: '654321',
        phoneNumber: '2348012345678',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.inAppToken(inAppTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/otp/generate', // Corrected endpoint
        expectedPayload,
      );
    });

    it('should generate an in-app token without optional DTO properties', async () => {
      const inAppTokenDto: InAppTokenDto = {
        phone_number: '2348012345678', // Added
      };
      const expectedPayload = {
        ...inAppTokenDto,
        pin_type: 'NUMERIC', // Defaulted
      };
      const result: InAppTokenResponse = {
        pinId: 'in_app_pin_id_default',
        otp: '112233',
        phoneNumber: '2348012345678',
      };
      mockTermiiHttpService.post.mockResolvedValue(result);

      expect(await service.inAppToken(inAppTokenDto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith(
        'api/sms/otp/generate', // Corrected endpoint
        expectedPayload,
      );
    });
  });
});
