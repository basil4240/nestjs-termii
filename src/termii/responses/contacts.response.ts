// src/termii/responses/contacts.response.ts

export interface PhonebookItem {
  id: string;
  name: string;
  total_contacts: number;
  date_created: string;
}

export interface ListPhonebooksResponse {
  data: PhonebookItem[];
}

export interface CreatePhonebookResponse {
  message: string;
  phonebook_id: string;
}

export interface UpdatePhonebookResponse {
  message: string;
}

export interface DeletePhonebookResponse {
  message: string;
}

export interface ContactItem {
  id: string;
  phone_number: string;
  first_name?: string;
  last_name?: string;
  // Add other fields based on actual API response
}

export interface ListContactsResponse {
  data: ContactItem[];
}

export interface AddContactResponse {
  message: string;
  contact_id: string;
}

export interface AddBulkContactsResponse {
  message: string;
  added_count: number;
  // Potentially other details like errors for failed contacts
}

export interface DeleteContactResponse {
  message: string;
}
