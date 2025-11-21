// src/termii/dtos/contacts.dto.ts

export class CreatePhonebookDto {
  phonebook_name: string;
}

export class UpdatePhonebookDto {
  phonebook_name: string;
}

export class AddContactDto {
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

export class BulkContactItem {
  phone_number: string;
  first_name?: string;
  last_name?: string;
}

export class AddBulkContactsDto {
  contacts: BulkContactItem[];
}
