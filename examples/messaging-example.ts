import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { MessagingService } from '@termii-sdk/messaging.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import {
  SendMessageDto,
  SendBulkMessageDto,
  SendTemplateMessageDto,
} from '@termii-sdk/dtos/messaging.dto';

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
class MessagingRunner implements OnModuleInit {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running MessagingService Examples ---');

    const testPhoneNumber = this.configService.get<string>('TEST_PHONE_NUMBER');
    const termiiSenderId = this.configService.get<string>('TERMII_SENDER_ID');

    if (!testPhoneNumber) {
      console.warn(
        'TEST_PHONE_NUMBER not set in .env, skipping messaging examples.',
      );
      return;
    }

    // 1. Send Single Message
    try {
      console.log('\n--- Sending Single Message ---');
      const sendMessageDto: SendMessageDto = {
        to: testPhoneNumber,
        sms: 'Hello from Termii NestJS SDK! (Single)',
        from: termiiSenderId, // Can be overridden
        channel: 'generic',
      };
      const sendResult =
        await this.messagingService.sendMessage(sendMessageDto);
      console.log('Single message sent:', sendResult);
    } catch (error) {
      console.error('Error sending single message:', error.message);
    }

    // 2. Send Bulk Message
    try {
      console.log('\n--- Sending Bulk Message ---');
      const sendBulkMessageDto: SendBulkMessageDto = {
        to: [testPhoneNumber], // Add more numbers for actual bulk testing
        sms: 'Hello from Termii NestJS SDK! (Bulk)',
        from: termiiSenderId,
        channel: 'generic',
      };
      const bulkResult =
        await this.messagingService.sendBulkMessage(sendBulkMessageDto);
      console.log('Bulk message sent:', bulkResult);
    } catch (error) {
      console.error('Error sending bulk message:', error.message);
    }

    // 3. Send Template Message (Assuming WhatsApp template for now)
    try {
      console.log('\n--- Sending Template Message ---');
      // NOTE: This requires a pre-approved WhatsApp template on Termii
      // You'll need to replace 'your_template_id' and 'data' with actual values
      const sendTemplateMessageDto: SendTemplateMessageDto = {
        to: testPhoneNumber,
        from: termiiSenderId,
        template_id: 'your_template_id', // REPLACE WITH ACTUAL TEMPLATE ID
        data: {
          name: 'John Doe',
          otp: '12345',
          // ... other template variables
        },
        channel: 'whatsapp',
      };
      const templateResult = await this.messagingService.sendWithTemplate(
        sendTemplateMessageDto,
      );
      console.log('Template message sent:', templateResult);
    } catch (error) {
      console.error('Error sending template message:', error.message);
    }

    console.log('\n--- MessagingService Examples Finished ---');
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
  providers: [MessagingRunner],
})
class MessagingExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    MessagingExampleModule,
    {
      logger: new CustomLogger(),
    },
  );
  await app.close();
}

bootstrap();
