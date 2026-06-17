import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideRouter, withInMemoryScrolling, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { apiInterceptor } from './core/services/api-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideRouter(
    //   routes,
    //   withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    // ),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient(
      withInterceptors([authInterceptor, apiInterceptor])
    )
  ]
};