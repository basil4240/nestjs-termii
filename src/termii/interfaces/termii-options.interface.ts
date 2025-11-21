import { ModuleMetadata } from '@nestjs/common';
import { LoggerInterface } from './logger.interface';

export interface TermiiModuleOptions {
  apiKey: string;
  senderId: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  logger?: LoggerInterface;
}

export interface TermiiModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<TermiiModuleOptions> | TermiiModuleOptions;
  inject?: any[];
}
