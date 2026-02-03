import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de-CH';
import { routes } from './app.routes';

registerLocaleData(localeDeCh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    
    { provide: LOCALE_ID, useValue: 'de-CH' },
    
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
