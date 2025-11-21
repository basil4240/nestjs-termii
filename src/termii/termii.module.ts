import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  TermiiModuleAsyncOptions,
  TermiiModuleOptions,
} from './interfaces/termii-options.interface';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiHttpService } from './termii-http.service';
import { InsightsService } from './insights.service';
import { MessagingService } from './messaging.service';
import { TokenService } from './token.service';
import { SenderIdService } from './sender-id.service';
import { ContactsService } from './contacts.service';
import { CampaignsService } from './campaigns.service';
import { ConversationsService } from './conversations.service'; // Import ConversationsService

@Global()
@Module({})
export class TermiiModule {
  static forRoot(options: TermiiModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: TERmii_MODULE_OPTIONS,
        useValue: options,
      },
      TermiiHttpService,
      InsightsService,
      MessagingService,
      TokenService,
      SenderIdService,
      ContactsService,
      CampaignsService,
      ConversationsService, // Add ConversationsService
    ];

    return {
      module: TermiiModule,
      imports: [HttpModule],
      providers: providers,
      exports: [
        InsightsService,
        MessagingService,
        TokenService,
        SenderIdService,
        ContactsService,
        CampaignsService,
        ConversationsService, // Export ConversationsService
      ],
    };
  }

  static forRootAsync(options: TermiiModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: TERmii_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      TermiiHttpService,
      InsightsService,
      MessagingService,
      TokenService,
      SenderIdService,
      ContactsService,
      CampaignsService,
      ConversationsService, // Add ConversationsService
    ];

    return {
      module: TermiiModule,
      imports: [...(options.imports || []), HttpModule],
      providers: providers,
      exports: [
        InsightsService,
        MessagingService,
        TokenService,
        SenderIdService,
        ContactsService,
        CampaignsService,
        ConversationsService, // Export ConversationsService
      ],
    };
  }
}
