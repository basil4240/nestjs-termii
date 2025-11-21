import { Injectable } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import {
  CreatePhonebookDto,
  UpdatePhonebookDto,
  AddContactDto,
  AddBulkContactsDto,
} from './dtos/contacts.dto';
import {
  ListPhonebooksResponse,
  CreatePhonebookResponse,
  UpdatePhonebookResponse,
  DeletePhonebookResponse,
  ListContactsResponse,
  AddContactResponse,
  AddBulkContactsResponse,
  DeleteContactResponse,
} from './responses/contacts.response';

@Injectable()
export class ContactsService {
  constructor(private readonly httpService: TermiiHttpService) {}

  // Phonebook Methods
  async listPhonebooks(): Promise<ListPhonebooksResponse> {
    return this.httpService.get<any, ListPhonebooksResponse>('api/phonebooks');
  }

  async createPhonebook(
    createPhonebookDto: CreatePhonebookDto,
  ): Promise<CreatePhonebookResponse> {
    return this.httpService.post<CreatePhonebookDto, CreatePhonebookResponse>(
      'api/phonebooks',
      createPhonebookDto,
    );
  }

  async updatePhonebook(
    phonebookId: string,
    updatePhonebookDto: UpdatePhonebookDto,
  ): Promise<UpdatePhonebookResponse> {
    return this.httpService.post<UpdatePhonebookDto, UpdatePhonebookResponse>(
      `api/phonebooks/${phonebookId}`,
      updatePhonebookDto,
    );
  }

  async deletePhonebook(phonebookId: string): Promise<DeletePhonebookResponse> {
    // Termii API might use POST with _method=DELETE or a DELETE request
    // Assuming POST for now as Termii often uses POST for actions
    return this.httpService.post<any, DeletePhonebookResponse>(
      `api/phonebooks/${phonebookId}/delete`, // Assuming delete endpoint format
      {},
    );
  }

  // Contact Methods
  async listContacts(phonebookId: string): Promise<ListContactsResponse> {
    return this.httpService.get<any, ListContactsResponse>(
      `api/phonebooks/${phonebookId}/contacts`,
    );
  }

  async addContact(
    phonebookId: string,
    addContactDto: AddContactDto,
  ): Promise<AddContactResponse> {
    return this.httpService.post<AddContactDto, AddContactResponse>(
      `api/phonebooks/${phonebookId}/contacts`,
      addContactDto,
    );
  }

  async addBulkContacts(
    phonebookId: string,
    addBulkContactsDto: AddBulkContactsDto,
  ): Promise<AddBulkContactsResponse> {
    return this.httpService.post<AddBulkContactsDto, AddBulkContactsResponse>(
      `api/phonebooks/${phonebookId}/contacts/import`, // Assuming import endpoint for bulk
      addBulkContactsDto,
    );
  }

  async deleteContact(contactId: string): Promise<DeleteContactResponse> {
    return this.httpService.post<any, DeleteContactResponse>(
      `api/contacts/${contactId}/delete`, // Assuming delete endpoint format
      {},
    );
  }
}
