import { Injectable } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import {
  GetBalanceResponse,
  SearchNumberResponse,
  GetStatusResponse,
  GetHistoryResponse,
} from './responses/insights.response';
import {
  SearchNumberDto,
  GetStatusDto,
  GetHistoryDto,
} from './dtos/insights.dto';

@Injectable()
export class InsightsService {
  constructor(private readonly httpService: TermiiHttpService) {}

  async getBalance(): Promise<GetBalanceResponse> {
    return this.httpService.get<any, GetBalanceResponse>('api/get-balance');
  }

  async search(
    searchNumberDto: SearchNumberDto,
  ): Promise<SearchNumberResponse> {
    return this.httpService.get<SearchNumberDto, SearchNumberResponse>(
      'api/check/dnd',
      searchNumberDto,
    );
  }

  async getStatus(getStatusDto: GetStatusDto): Promise<GetStatusResponse> {
    return this.httpService.get<GetStatusDto, GetStatusResponse>(
      'api/sms/status',
      getStatusDto,
    );
  }

  async getHistory(getHistoryDto?: GetHistoryDto): Promise<GetHistoryResponse> {
    return this.httpService.get<GetHistoryDto, GetHistoryResponse>(
      'api/sms/inbox',
      getHistoryDto,
    );
  }
}
