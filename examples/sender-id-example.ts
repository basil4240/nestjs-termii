import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { SenderIdService } from '@termii-sdk/sender-id.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import { RequestSenderIdDto } from '@termii-sdk/dtos/sender-id.dto';

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
class SenderIdRunner implements OnModuleInit {
  constructor(
    private readonly senderIdService: SenderIdService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running SenderIdService Examples ---');

    // 1. List Sender IDs
    try {
      console.log('\n--- Listing Sender IDs ---');
      const senderIds = await this.senderIdService.list();
      console.log('Sender IDs:', senderIds);
    } catch (error) {
      console.error('Error listing sender IDs:', error.message);
    }

    // 2. Request Sender ID
    const newSenderId = 'MyTestID'; // Replace with a sender ID you wish to request
    const companyName = 'My Test Company';
    const useCase = 'Transactional Messaging';

    try {
      console.log(`\n--- Requesting Sender ID: ${newSenderId} ---`);
      const requestDto: RequestSenderIdDto = {
        sender_id: newSenderId,
        usecase: useCase,
        company: companyName,
      };
      const requestResult = await this.senderIdService.request(requestDto);
      console.log('Sender ID request result:', requestResult);
    } catch (error) {
      console.error(
        `Error requesting sender ID ${newSenderId}:`,
        error.message,
      );
    }

    console.log('\n--- SenderIdService Examples Finished ---');
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
  providers: [SenderIdRunner],
})
class SenderIdExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    SenderIdExampleModule,
    {
      logger: new CustomLogger(),
    },
  );
  await app.close();
}

bootstrap();
