import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { CampaignsService } from '@termii-sdk/campaigns.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import { SendCampaignDto } from '@termii-sdk/dtos/campaigns.dto';

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
class CampaignsRunner implements OnModuleInit {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running CampaignsService Examples ---');

    const testPhoneNumber = this.configService.get<string>('TEST_PHONE_NUMBER');
    const termiiSenderId = this.configService.get<string>('TERMII_SENDER_ID');

    // NOTE: This example assumes you have an active Termii account and a valid phonebook_id
    // It's highly recommended to test this with a sandbox environment or dummy data first.
    const testPhonebookId = this.configService.get<string>('TEST_PHONEBOOK_ID');

    // 1. Fetch Campaigns
    try {
      console.log('\n--- Fetching Campaigns ---');
      const campaigns = await this.campaignsService.fetchCampaigns();
      console.log('Campaigns:', campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error.message);
    }

    let sentCampaignId: string | undefined;

    // 2. Send Campaign (using recipients array)
    if (testPhoneNumber && termiiSenderId) {
      try {
        console.log('\n--- Sending Campaign (to recipients array) ---');
        const sendCampaignDto: SendCampaignDto = {
          campaign_name: `Test Campaign ${Date.now()}`,
          message: 'Hello from NestJS Termii SDK Campaign!',
          recipients: [testPhoneNumber],
          channel: 'generic',
          message_type: 'plain',
          sender_id: termiiSenderId,
        };
        const result = await this.campaignsService.sendCampaign(sendCampaignDto);
        sentCampaignId = result.campaign_id;
        console.log('Campaign sent (recipients array):', result);
      } catch (error) {
        console.error('Error sending campaign (recipients array):', error.message);
      }
    } else {
      console.warn('Skipping campaign send example (recipients array) due to missing TEST_PHONE_NUMBER or TERMII_SENDER_ID in .env');
    }

    // 3. Send Campaign (using phonebook_id - requires TEST_PHONEBOOK_ID)
    if (testPhonebookId && termiiSenderId) {
      try {
        console.log('\n--- Sending Campaign (to phonebook) ---');
        const sendCampaignDto: SendCampaignDto = {
          campaign_name: `Test Phonebook Campaign ${Date.now()}`,
          message: 'Hello to my phonebook from NestJS Termii SDK!',
          phonebook_id: testPhonebookId,
          channel: 'generic',
          message_type: 'plain',
          sender_id: termiiSenderId,
        };
        const result = await this.campaignsService.sendCampaign(sendCampaignDto);
        console.log('Campaign sent (phonebook):', result);
      } catch (error) {
        console.error('Error sending campaign (phonebook):', error.message);
      }
    } else {
      console.warn('Skipping campaign send example (phonebook) due to missing TEST_PHONEBOOK_ID or TERMII_SENDER_ID in .env');
    }


    // 4. Fetch Campaign History (if a campaign was sent)
    if (sentCampaignId) {
      try {
        console.log(`\n--- Fetching History for Campaign ID: ${sentCampaignId} ---`);
        const history = await this.campaignsService.fetchCampaignHistory({ campaign_id: sentCampaignId });
        console.log('Campaign History:', history);
      } catch (error) {
        console.error(`Error fetching history for campaign ${sentCampaignId}:`, error.message);
      }
    } else {
      console.warn('Skipping campaign history example as no campaignId was obtained.');
    }

    console.log('\n--- CampaignsService Examples Finished ---');
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
  providers: [CampaignsRunner],
})
class CampaignsExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    CampaignsExampleModule,
    {
      logger: new CustomLogger(),
    },
  );
  await app.close();
}

bootstrap();
