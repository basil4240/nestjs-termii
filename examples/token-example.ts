import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { TokenService } from '@termii-sdk/token.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import {
  SendTokenDto,
  VerifyTokenDto,
  InAppTokenDto,
} from '@termii-sdk/dtos/token.dto';

// Custom Logger for demonstration
class CustomLogger implements LoggerInterface {
  log(message: any, context?: string) {
    console.log(`[CUSTOM LOG] [${context || 'Default'}] ${message}`);
  }
  error(message: any, trace?: string, context?: string) {
    console.error(`[CUSTOM ERROR] [${context || 'Default'}] ${message}`, trace);
  }
  warn(message: any, context?: string) {
    console.warn(`[CUSTOM WARN] [${context || 'Default'}] ${message}`);
  }
  debug(message: any, context?: string) {
    console.debug(`[CUSTOM DEBUG] [${context || 'Default'}] ${message}`);
  }
  verbose(message: any, context?: string) {
    console.log(`[CUSTOM VERBOSE] [${context || 'Default'}] ${message}`);
  }
}

@Injectable()
class TokenRunner implements OnModuleInit {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running TokenService Examples ---');

    const testPhoneNumber = this.configService.get<string>('TEST_PHONE_NUMBER');
    const termiiSenderId = this.configService.get<string>('TERMII_SENDER_ID');

    if (!testPhoneNumber) {
      console.warn(
        'TEST_PHONE_NUMBER not set in .env, skipping token examples.',
      );
      return;
    }

    let pinId: string;

    // 1. Send SMS Token
    try {
      console.log('\n--- Sending SMS Token ---');
      const sendTokenDto: SendTokenDto = {
        message_type: 'NUMERIC',
        to: testPhoneNumber,
        from: termiiSenderId,
        channel: 'dnd',
        pin_length: 6,
        pin_time_to_live: 5, // 5 minutes validity
        pin_attempts: 3,
        pin_placeholder: '< 123456 >', // New field
        message_text: 'Your verification code is < 123456 >', // New field
      };
      const sendResult = await this.tokenService.sendToken(sendTokenDto);
      pinId = sendResult.pinId;
      console.log('SMS Token sent:', sendResult);
      console.log(`Please check your phone (${testPhoneNumber}) for the OTP.`);
    } catch (error) {
      console.error('Error sending SMS Token:', error.message);
    }

    // 2. Verify Token (using a placeholder PIN, replace with actual received PIN)
    if (pinId) {
      const receivedPin = '123456'; // <<< REPLACE WITH THE ACTUAL PIN RECEIVED
      try {
        console.log(`\n--- Verifying Token (PIN: ${receivedPin}) ---`);
        const verifyTokenDto: VerifyTokenDto = {
          pin_id: pinId,
          pin: receivedPin,
        };
        const verifyResult =
          await this.tokenService.verifyToken(verifyTokenDto);
        console.log('Token verification result:', verifyResult);
      } catch (error) {
        console.error('Error verifying Token:', error.message);
      }
    } else {
      console.warn(
        'Skipping token verification example as pinId was not obtained.',
      );
    }

    // 3. Generate In-App Token
    try {
      console.log('\n--- Generating In-App Token ---');
      const inAppTokenDto: InAppTokenDto = {
        phone_number: testPhoneNumber, // Added
        pin_length: 4,
        pin_type: 'ALPHANUMERIC',
        pin_time_to_live: 10,
      };
      const inAppResult = await this.tokenService.inAppToken(inAppTokenDto);
      console.log('In-App Token generated:', inAppResult);
    } catch (error) {
      console.error('Error generating In-App Token:', error.message);
    }

    console.log('\n--- TokenService Examples Finished ---');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TermiiModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('TERMII_API_KEY'),
        senderId: configService.get<string>('TERMII_SENDER_ID'),
        baseUrl: configService.get<string>('TERMII_BASE_URL'),
        timeout: 5000,
        retryAttempts: 2,
        logger: new CustomLogger(),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenRunner],
})
class TokenExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TokenExampleModule, {
    logger: new CustomLogger(),
  });
  await app.close();
}

bootstrap();
