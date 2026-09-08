import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { appContent } from '../../../content.config';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly navigation = appContent.navigation;
  protected readonly brand = appContent.brand;
  protected readonly footer = appContent.footer;
  protected readonly header = appContent.header;
}
