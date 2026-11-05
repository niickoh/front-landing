import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { ContentService } from './services/content.service';

/** Aura re-tinted to the UPAC crest: warm black surfaces and the club red as primary. */
const UpacPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}',
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#fbf7f6',
          100: '#f1e6e6',
          200: '#dcc8c9',
          300: '#cdb9ba',
          400: '#a88b8d',
          500: '#7d6264',
          600: '#5a3f42',
          700: '#4a1f22',
          800: '#2f0e11',
          900: '#23090c',
          950: '#120607',
        },
        primary: {
          color: '#e3121b',
          contrastColor: '#ffffff',
          hoverColor: '#c20f17',
          activeColor: '#a10b12',
        },
        highlight: {
          background: 'color-mix(in srgb, #e3121b, transparent 80%)',
          focusBackground: 'color-mix(in srgb, #e3121b, transparent 70%)',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(ContentService).load()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideAnimationsAsync(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: UpacPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
  ],
};
