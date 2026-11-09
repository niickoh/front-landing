import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTaiga } from '@taiga-ui/core';

import { routes } from './app.routes';
import { ConfigService } from './core/config/app-config';
import { ContentService } from './services/content.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // public/config/config.json (URL de la API) y public/content.json se leen antes de la primera pantalla.
    provideAppInitializer(() => {
      const config = inject(ConfigService);
      const content = inject(ContentService);
      return Promise.all([config.load(), content.load()]).then(() => undefined);
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideAnimationsAsync(),
    // Dark Taiga theme; colors are re-tinted to the crest in styles.css.
    provideTaiga({ mode: 'dark', scrollbars: 'native' }),
  ],
};
