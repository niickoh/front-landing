import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, TuiButton],
  templateUrl: './hero.html',
})
export class Hero {
  private readonly content = inject(ContentService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly hero = this.content.value.hero;
  protected readonly footer = this.content.value.footer;

  /** Text that runs around the 25th-anniversary seal. */
  protected readonly sealText = `${this.hero.eyebrow} ★ ${this.hero.proofLabel} ★ `;

  // Built once: a getter would hand the iframe a new SafeResourceUrl on every change detection.
  protected readonly youtubeEmbedUrl = this.buildYoutubeEmbedUrl();

  private buildYoutubeEmbedUrl() {
    const url = this.hero.youtubeUrl;
    const videoId = url?.match(/(?:v=|be\/)([A-Za-z0-9_-]{11})/)?.[1];
    if (!videoId) {
      return null;
    }

    const start = this.hero.startSeconds ?? 0;
    const end = start + (this.hero.playSeconds ?? 0);
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
      disablekb: '1',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
    );
  }
}
