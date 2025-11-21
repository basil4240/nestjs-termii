import { NestFactory } from '@nestjs/core';
import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TermiiModule } from '@termii-sdk/termii.module';
import { ContactsService } from '@termii-sdk/contacts.service';
import { LoggerInterface } from '@termii-sdk/interfaces/logger.interface';
import {
  CreatePhonebookDto,
  UpdatePhonebookDto,
  AddContactDto,
  AddBulkContactsDto,
} from '@termii-sdk/dtos/contacts.dto';

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
class ContactsRunner implements OnModuleInit {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    console.log('--- Running ContactsService Examples ---');

    let phonebookId: string;
    let contactId: string;
    const testPhoneNumber =
      this.configService.get<string>('TEST_PHONE_NUMBER') || '2348012345678';

    // 1. Create Phonebook
    try {
      console.log('\n--- Creating Phonebook ---');
      const createDto: CreatePhonebookDto = {
        phonebook_name: `TestPhonebook-${Date.now()}`,
      };
      const result = await this.contactsService.createPhonebook(createDto);
      phonebookId = result.phonebook_id;
      console.log('Created Phonebook:', result);
    } catch (error) {
      console.error('Error creating phonebook:', error.message);
    }

    if (phonebookId) {
      // 2. List Phonebooks
      try {
        console.log('\n--- Listing Phonebooks ---');
        const phonebooks = await this.contactsService.listPhonebooks();
        console.log('Phonebooks:', phonebooks);
      } catch (error) {
        console.error('Error listing phonebooks:', error.message);
      }

      // 3. Update Phonebook
      try {
        console.log('\n--- Updating Phonebook ---');
        const updateDto: UpdatePhonebookDto = {
          phonebook_name: `Updated-${phonebookId}`,
        };
        const result = await this.contactsService.updatePhonebook(
          phonebookId,
          updateDto,
        );
        console.log('Updated Phonebook:', result);
      } catch (error) {
        console.error('Error updating phonebook:', error.message);
      }

      // 4. Add Contact to Phonebook
      try {
        console.log('\n--- Adding Contact ---');
        const addContactDto: AddContactDto = {
          phone_number: testPhoneNumber,
          first_name: 'Example',
          last_name: 'Contact',
        };
        const result = await this.contactsService.addContact(
          phonebookId,
          addContactDto,
        );
        contactId = result.contact_id;
        console.log('Added Contact:', result);
      } catch (error) {
        console.error('Error adding contact:', error.message);
      }

      // 5. List Contacts in Phonebook
      try {
        console.log('\n--- Listing Contacts ---');
        const contacts = await this.contactsService.listContacts(phonebookId);
        console.log('Contacts in Phonebook:', contacts);
      } catch (error) {
        console.error('Error listing contacts:', error.message);
      }

      // 6. Add Bulk Contacts
      try {
        console.log('\n--- Adding Bulk Contacts ---');
        const addBulkContactsDto: AddBulkContactsDto = {
          contacts: [
            {
              phone_number: '2348012345670',
              first_name: 'Bulk',
              last_name: 'One',
            },
            {
              phone_number: '2348012345671',
              first_name: 'Bulk',
              last_name: 'Two',
            },
          ],
        };
        const result = await this.contactsService.addBulkContacts(
          phonebookId,
          addBulkContactsDto,
        );
        console.log('Added Bulk Contacts:', result);
      } catch (error) {
        console.error('Error adding bulk contacts:', error.message);
      }

      // 7. Delete Contact (if a contact was added)
      if (contactId) {
        try {
          console.log(`\n--- Deleting Contact: ${contactId} ---`);
          const result = await this.contactsService.deleteContact(contactId);
          console.log('Deleted Contact:', result);
        } catch (error) {
          console.error(`Error deleting contact ${contactId}:`, error.message);
        }
      } else {
        console.warn(
          'Skipping delete contact example as no contactId was obtained.',
        );
      }

      // 8. Delete Phonebook (clean up)
      try {
        console.log(`\n--- Deleting Phonebook: ${phonebookId} ---`);
        const result = await this.contactsService.deletePhonebook(phonebookId);
        console.log('Deleted Phonebook:', result);
      } catch (error) {
        console.error(
          `Error deleting phonebook ${phonebookId}:`,
          error.message,
        );
      }
    } else {
      console.warn(
        'Skipping phonebook and contact examples as no phonebookId was obtained.',
      );
    }

    console.log('\n--- ContactsService Examples Finished ---');
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
  providers: [ContactsRunner],
})
class ContactsExampleModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    ContactsExampleModule,
    {
      logger: new CustomLogger(),
    },
  );
  await app.close();
}

bootstrap();
