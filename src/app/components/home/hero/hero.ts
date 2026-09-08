import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Button],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly content = inject(ContentService);
  protected readonly hero = this.content.value.hero;

  constructor(private readonly sanitizer: DomSanitizer) {}

  protected get youtubeEmbedUrl() {
    const url = this.hero.youtubeUrl;
    if (!url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const match = url.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/);
    const videoId = match?.[1];
    if (!videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const start = this.hero.startSeconds ?? 0;
    const end = (this.hero.startSeconds ?? 0) + (this.hero.playSeconds ?? 0);
    const params = new URLSearchParams({
      autoplay: String(this.hero.autoplay ? 1 : 0),
      mute: String(this.hero.muted ? 1 : 0),
      loop: String(this.hero.loop ? 1 : 0),
      start: String(start),
      end: String(end),
      playlist: videoId,
      rel: '0',
      controls: '0',
      playsinline: '1',
      iv_load_policy: '3',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
    );
  }
}
