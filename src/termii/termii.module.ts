import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  TermiiModuleAsyncOptions,
  TermiiModuleOptions,
} from './interfaces/termii-options.interface';
import { TERmii_MODULE_OPTIONS } from './termii.constants';
import { TermiiHttpService } from './termii-http.service';

@Global()
@Module({})
export class TermiiModule {
  static forRoot(options: TermiiModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: TERmii_MODULE_OPTIONS,
        useValue: options,
      },
      TermiiHttpService,
    ];

    return {
      module: TermiiModule,
      imports: [HttpModule],
      providers: providers,
      exports: [TermiiHttpService],
    };
  }

  static forRootAsync(options: TermiiModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: TERmii_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      TermiiHttpService,
    ];

    return {
      module: TermiiModule,
      imports: [...(options.imports || []), HttpModule],
      providers: providers,
      exports: [TermiiHttpService],
    };
  }
}
