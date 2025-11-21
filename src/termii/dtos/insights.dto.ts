export class GetBalanceDto {
  api_key?: string; // Handled by the http service, but included for clarity
}

export class SearchNumberDto {
  phone_number: string;
  api_key?: string; // Handled by the http service
}

export class GetStatusDto {
  message_id: string;
  api_key?: string; // Handled by the http service
}

export class GetHistoryDto {
  page?: number;
  per_page?: number;
  api_key?: string; // Handled by the http service
}
