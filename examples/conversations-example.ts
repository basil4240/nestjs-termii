import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { ConversationsService } from '@termii-sdk/conversations.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import { SendConversationMessageDto, ToggleReadStatusDto } from '@termii-sdk/dtos/conversations.dto';

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
class ConversationsRunner implements OnModuleInit {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running ConversationsService Examples ---');

    // NOTE: For a real-world scenario, you would have active conversations
    // to interact with. This example uses placeholder IDs.
    let testConversationId = this.configService.get<string>('TEST_CONVERSATION_ID') || 'some_test_conversation_id';

    // 1. List Conversations
    try {
      console.log('\n--- Listing Conversations ---');
      const conversations = await this.conversationsService.listConversations();
      console.log('Conversations:', conversations);
      if (conversations.data && conversations.data.length > 0) {
        // Use an actual conversation ID if available
        testConversationId = conversations.data[0].id;
        console.log(`Using first conversation ID for further examples: ${testConversationId}`);
      }
    } catch (error) {
      console.error('Error listing conversations:', error.message);
    }

    if (testConversationId && testConversationId !== 'some_test_conversation_id') {
      // 2. Toggle Read Status to Unread
      try {
        console.log(`\n--- Toggling Conversation ${testConversationId} to Unread ---`);
        const toggleDto: ToggleReadStatusDto = { is_read: false };
        const result = await this.conversationsService.toggleReadStatus(testConversationId, toggleDto);
        console.log('Toggle Read Status Result:', result);
      } catch (error) {
        console.error(`Error toggling read status for ${testConversationId}:`, error.message);
      }

      // 3. Send Message within a Conversation
      try {
        console.log(`\n--- Sending Message in Conversation ${testConversationId} ---`);
        const messageDto: SendConversationMessageDto = { message: `Hello from SDK! (Timestamp: ${Date.now()})` };
        const result = await this.conversationsService.sendConversationMessage(testConversationId, messageDto);
        console.log('Send Message Result:', result);
      } catch (error) {
        console.error(`Error sending message in conversation ${testConversationId}:`, error.message);
      }

      // 4. Toggle Read Status to Read
      try {
        console.log(`\n--- Toggling Conversation ${testConversationId} to Read ---`);
        const toggleDto: ToggleReadStatusDto = { is_read: true };
        const result = await this.conversationsService.toggleReadStatus(testConversationId, toggleDto);
        console.log('Toggle Read Status Result:', result);
      } catch (error) {
        console.error(`Error toggling read status for ${testConversationId}:`, error.message);
      }

    } else {
      console.warn('Skipping conversation interaction examples as no valid TEST_CONVERSATION_ID was obtained or set in .env');
    }

    console.log('\n--- ConversationsService Examples Finished ---');
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
  providers: [ConversationsRunner],
})
class ConversationsExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    ConversationsExampleModule,
    {
      logger: new CustomLogger(),
    },
  );
  await app.close();
}

bootstrap();
