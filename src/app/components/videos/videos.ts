import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import type { AppContent } from '../../content.config';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-videos',
  imports: [NgClass],
  templateUrl: './videos.html',
})
export class Videos {
  private readonly content = inject(ContentService);
  protected readonly videos = this.content.value.videos;
  protected selectedEventId: string = this.videos.events[0]?.id ?? '';
  protected readonly videoError = signal(false);

  constructor(private readonly sanitizer: DomSanitizer) {}

  protected get selectedEvent(): AppContent['videos']['events'][number] | undefined {
    return (
      this.videos.events.find((event) => event.id === this.selectedEventId) ?? this.videos.events[0]
    );
  }

  protected selectEvent(eventId: string): void {
    this.selectedEventId = eventId;
    this.videoError.set(false);
  }

  protected getVideoEmbedUrl(url: string) {
    const match = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match?.[1];

    if (!videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      autoplay: '0',
      controls: '1',
      playsinline: '1',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
    );
  }

  protected markVideoError(): void {
    this.videoError.set(true);
  }
}
