import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  protected readonly menuOpen = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Quiénes Somos', path: '/quienes-somos' },
    { label: 'Contacto', path: '/contacto' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
