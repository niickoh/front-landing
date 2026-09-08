import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  private readonly content = inject(ContentService);
  protected readonly menuOpen = signal(false);
  protected readonly navItems = this.content.value.navigation;
  protected readonly brand = this.content.value.brand;
  protected readonly header = this.content.value.header;

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
