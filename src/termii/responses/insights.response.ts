export interface TermiiBalance {
  balance: number;
  currency: string;
}

export interface GetBalanceResponse {
  user: TermiiBalance;
}

export interface SearchNumberResponse {
  number: string;
  network: string;
  status: string;
  ported: string; // This could be boolean, but Termii API returns string
}

export interface GetStatusResponse {
  status: string;
  message_id: string;
  sender_id: string;
}

export interface HistoryItem {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  status: string;
  date: string;
}

export interface GetHistoryResponse {
  data: HistoryItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
