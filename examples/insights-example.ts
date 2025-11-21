import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { InsightsService } from '@termii-sdk/insights.service';
import { SearchNumberDto } from '@termii-sdk/dtos/insights.dto';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';

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
class InsightsRunner implements OnModuleInit {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running InsightsService Examples ---');

    // 1. Get Balance
    try {
      const balance = await this.insightsService.getBalance();
      console.log('Balance:', balance);
    } catch (error) {
      console.error('Error getting balance:', error.message);
    }

    // 2. Search Phone Number
    const phoneNumber = this.configService.get<string>('TEST_PHONE_NUMBER');
    if (phoneNumber) {
      try {
        const searchDto: SearchNumberDto = { phone_number: phoneNumber };
        const searchResult = await this.insightsService.search(searchDto);
        console.log(`Search result for ${phoneNumber}:`, searchResult);
      } catch (error) {
        console.error(`Error searching number ${phoneNumber}:`, error.message);
      }
    } else {
      console.warn(
        'TEST_PHONE_NUMBER not set in .env, skipping search example.',
      );
    }

    // 3. Get Status (requires a message_id, hardcoding for example)
    const testMessageId =
      this.configService.get<string>('TEST_MESSAGE_ID') ||
      'some_test_message_id';
    try {
      const statusResult = await this.insightsService.getStatus({
        message_id: testMessageId,
      });
      console.log(`Status for message ID ${testMessageId}:`, statusResult);
    } catch (error) {
      console.error(
        `Error getting status for message ID ${testMessageId}:`,
        error.message,
      );
    }

    // 4. Get History
    try {
      const historyResult = await this.insightsService.getHistory({
        page: 1,
        per_page: 5,
      });
      console.log('History:', historyResult);
    } catch (error) {
      console.error('Error getting history:', error.message);
    }

    console.log('--- InsightsService Examples Finished ---');
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
        logger: new CustomLogger(), // Using custom logger
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [InsightsRunner],
})
class InsightsExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    InsightsExampleModule,
    {
      logger: new CustomLogger(), // Optionally use custom logger for NestJS too
    },
  );
  // Application context will run OnModuleInit hooks then exit if no HTTP server is started
  await app.close();
}

bootstrap();
