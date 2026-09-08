import { Injectable } from '@angular/core';
import { appContent, AppContent } from '../content.config';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private content: AppContent = appContent;

  get value(): AppContent {
    return this.content;
  }

  async load(): Promise<void> {
    try {
      const response = await fetch('/content.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Content request failed with status ${response.status}`);
      }

      const remoteContent = (await response.json()) as Partial<AppContent>;
      this.content = this.mergeContent(appContent, remoteContent);
    } catch (error) {
      console.warn('No se pudo cargar /content.json. Se usará la configuración local.', error);
    }
  }

  private mergeContent(fallback: AppContent, remote: Partial<AppContent>): AppContent {
    return {
      ...fallback,
      ...remote,
      brand: { ...fallback.brand, ...remote.brand },
      header: { ...fallback.header, ...remote.header },
      hero: { ...fallback.hero, ...remote.hero },
      aboutSection: { ...fallback.aboutSection, ...remote.aboutSection },
      teamSection: { ...fallback.teamSection, ...remote.teamSection },
      valuesSection: { ...fallback.valuesSection, ...remote.valuesSection },
      cta: { ...fallback.cta, ...remote.cta },
      contactSection: { ...fallback.contactSection, ...remote.contactSection },
      footer: { ...fallback.footer, ...remote.footer },
      videos: { ...fallback.videos, ...remote.videos },
    } as AppContent;
  }
}
