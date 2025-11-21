import { Injectable } from '@nestjs/common';
import { TermiiHttpService } from './termii-http.service';
import { RequestSenderIdDto } from './dtos/sender-id.dto';
import { ListSenderIdsResponse, RequestSenderIdResponse } from './responses/sender-id.response';

@Injectable()
export class SenderIdService {
  constructor(private readonly httpService: TermiiHttpService) {}

  async list(): Promise<ListSenderIdsResponse> {
    return this.httpService.get<any, ListSenderIdsResponse>('api/sender-id');
  }

  async request(requestSenderIdDto: RequestSenderIdDto): Promise<RequestSenderIdResponse> {
    return this.httpService.post<RequestSenderIdDto, RequestSenderIdResponse>(
      'api/sender-id/request',
      requestSenderIdDto,
    );
  }
}
