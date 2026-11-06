import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TuiAppearance, TuiCell, TuiIcon, TuiNotification, TuiTitle } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-videos',
  imports: [TuiAppearance, TuiCell, TuiIcon, TuiNotification, TuiTitle, TuiChip, TuiCardLarge],
  templateUrl: './videos.html',
})
export class Videos {
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  // Cached so change detection doesn't hand iframes a new URL object (which reloads them).
  private readonly embedUrls = new Map<string, SafeResourceUrl>();

  protected readonly videos = this.content.value.videos;
  protected readonly selectedEventId = signal<string>(this.videos.events[0]?.id ?? '');
  protected readonly videoError = signal(false);

  protected readonly selectedEvent = computed(
    () =>
      this.videos.events.find((event) => event.id === this.selectedEventId()) ??
      this.videos.events[0],
  );

  protected selectEvent(eventId: string): void {
    this.selectedEventId.set(eventId);
    this.videoError.set(false);
  }

  protected getVideoEmbedUrl(url: string): SafeResourceUrl {
    const cached = this.embedUrls.get(url);
    if (cached) {
      return cached;
    }

    const videoId = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/)?.[1];
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      autoplay: '0',
      controls: '1',
      playsinline: '1',
    });
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      videoId ? `https://www.youtube.com/embed/${videoId}?${params.toString()}` : '',
    );

    this.embedUrls.set(url, safeUrl);
    return safeUrl;
  }

  protected markVideoError(): void {
    this.videoError.set(true);
  }
}
