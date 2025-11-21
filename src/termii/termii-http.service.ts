import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { catchError, map, retry, throwError, firstValueFrom } from 'rxjs';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import {
  TermiiApiKeyInvalidException,
  TermiiGeneralException,
  TermiiInsufficientBalanceException,
  TermiiNotFoundException,
} from './exceptions/termii.exceptions';
import { TermiiModuleOptions } from './interfaces/termii-options.interface';
import { LoggerInterface } from './interfaces/logger.interface';

@Injectable()
export class TermiiHttpService {
  private readonly logger?: LoggerInterface;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly timeout: number;
  private readonly retryAttempts: number;

  constructor(
    private readonly httpService: HttpService,
    @Inject(TERmii_MODULE_OPTIONS)
    private readonly options: TermiiModuleOptions,
  ) {
    this.logger = this.options.logger;
    this.baseUrl = this.options.baseUrl || 'https://api.ng.termii.com';
    this.apiKey = this.options.apiKey;
    this.senderId = this.options.senderId;
    this.timeout = this.options.timeout || 30000;
    this.retryAttempts = this.options.retryAttempts || 3;
  }

  private preparePayload<T>(payload: T): T & { api_key: string } {
    return {
      ...payload,
      api_key: this.apiKey,
    };
  }

  public async post<T, R>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const fullUrl = `${this.baseUrl}/${url}`;
    const preparedPayload = this.preparePayload(payload);
    this.logger?.log(
      `[Termii-SDK] POST ${fullUrl}, payload: ${JSON.stringify(preparedPayload)}`,
    );

    const request = this.httpService
      .post<R>(fullUrl, preparedPayload, {
        ...config,
        timeout: this.timeout,
      })
      .pipe(
        map((response) => response.data),
        retry(this.retryAttempts),
        catchError((error) => {
          this.logger?.error(`[Termii-SDK] Error on POST ${fullUrl}:`, error);
          this.handleError(error);
          return throwError(() => error);
        }),
      );

    return firstValueFrom(request);
  }

  public async get<T, R>(
    url: string,
    payload?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const fullUrl = `${this.baseUrl}/${url}`;
    const params = payload
      ? this.preparePayload(payload)
      : { api_key: this.apiKey };
    this.logger?.log(
      `[Termii-SDK] GET ${fullUrl}, params: ${JSON.stringify(params)}`,
    );

    const request = this.httpService
      .get<R>(fullUrl, {
        ...config,
        params,
        timeout: this.timeout,
      })
      .pipe(
        map((response) => response.data),
        retry(this.retryAttempts),
        catchError((error) => {
          this.logger?.error(`[Termii-SDK] Error on GET ${fullUrl}:`, error);
          this.handleError(error);
          return throwError(() => error);
        }),
      );

    return firstValueFrom(request);
  }

  private handleError(error: any): void {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || 'An unknown error occurred';

      switch (status) {
        case 401:
          throw new TermiiApiKeyInvalidException(message);
        case 402:
          throw new TermiiInsufficientBalanceException(message);
        case 404:
          throw new TermiiNotFoundException(message);
        default:
          throw new TermiiGeneralException(message, status);
      }
    }
    throw new TermiiGeneralException(error.message, error.status);
  }
}
