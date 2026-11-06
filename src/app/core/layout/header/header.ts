import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiPopup } from '@taiga-ui/core';
import { TuiDrawer } from '@taiga-ui/kit';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TuiButton, TuiPopup, TuiDrawer],
  templateUrl: './header.html',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  private readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT);
  protected readonly menuOpen = signal(false);
  protected readonly navItems = this.content.value.navigation;
  protected readonly brand = this.content.value.brand;
  protected readonly header = this.content.value.header;

  constructor() {
    // Lock page scroll while the mobile drawer is open.
    effect(() => {
      this.document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** The drawer's backdrop is a pseudo-element of the host, so a click on the host itself means "outside". */
  protected onDrawerClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeMenu();
    }
  }
}
