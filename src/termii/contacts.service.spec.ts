import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { TermiiHttpService } from './termii-http.service';
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
import {
  CreatePhonebookDto,
  UpdatePhonebookDto,
  AddContactDto,
  AddBulkContactsDto,
} from './dtos/contacts.dto';

describe('ContactsService', () => {
  let service: ContactsService;
  let httpService: TermiiHttpService;

  const mockTermiiHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: TermiiHttpService,
          useValue: mockTermiiHttpService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    httpService = module.get<TermiiHttpService>(TermiiHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Phonebook Methods', () => {
    it('should list phonebooks', async () => {
      const result: ListPhonebooksResponse = { data: [{ id: 'pb1', name: 'Test PB', total_contacts: 1, date_created: 'today' }] };
      mockTermiiHttpService.get.mockResolvedValue(result);
      expect(await service.listPhonebooks()).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/phonebooks');
    });

    it('should create a phonebook', async () => {
      const dto: CreatePhonebookDto = { phonebook_name: 'New PB' };
      const result: CreatePhonebookResponse = { message: 'Created', phonebook_id: 'pb2' };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.createPhonebook(dto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/phonebooks', dto);
    });

    it('should update a phonebook', async () => {
      const dto: UpdatePhonebookDto = { phonebook_name: 'Updated PB' };
      const result: UpdatePhonebookResponse = { message: 'Updated' };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.updatePhonebook('pb1', dto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/phonebooks/pb1', dto);
    });

    it('should delete a phonebook', async () => {
      const result: DeletePhonebookResponse = { message: 'Deleted' };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.deletePhonebook('pb1')).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/phonebooks/pb1/delete', {});
    });
  });

  describe('Contact Methods', () => {
    it('should list contacts in a phonebook', async () => {
      const result: ListContactsResponse = { data: [{ id: 'c1', phone_number: '23480', first_name: 'Test' }] };
      mockTermiiHttpService.get.mockResolvedValue(result);
      expect(await service.listContacts('pb1')).toEqual(result);
      expect(httpService.get).toHaveBeenCalledWith('api/phonebooks/pb1/contacts');
    });

    it('should add a contact to a phonebook', async () => {
      const dto: AddContactDto = { phone_number: '23480', first_name: 'New' };
      const result: AddContactResponse = { message: 'Added', contact_id: 'c2' };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.addContact('pb1', dto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/phonebooks/pb1/contacts', dto);
    });

    it('should add bulk contacts to a phonebook', async () => {
      const dto: AddBulkContactsDto = { contacts: [{ phone_number: '23480', first_name: 'Bulk' }] };
      const result: AddBulkContactsResponse = { message: 'Bulk Added', added_count: 1 };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.addBulkContacts('pb1', dto)).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/phonebooks/pb1/contacts/import', dto);
    });

    it('should delete a contact', async () => {
      const result: DeleteContactResponse = { message: 'Contact Deleted' };
      mockTermiiHttpService.post.mockResolvedValue(result);
      expect(await service.deleteContact('c1')).toEqual(result);
      expect(httpService.post).toHaveBeenCalledWith('api/contacts/c1/delete', {});
    });
  });
});
