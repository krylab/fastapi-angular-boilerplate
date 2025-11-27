import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { httpErrorInterceptor } from './common/interceptors';
import { AppErrorHandler } from './common/services/app-error-handler.service';
import { ErrorHandlerService } from './common/services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    ErrorHandlerService,
    provideHttpClient(withInterceptors([httpErrorInterceptor])),
  ],
};
