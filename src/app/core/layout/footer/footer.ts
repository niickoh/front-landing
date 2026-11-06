import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiCell, TuiIcon, TuiLink, TuiTitle } from '@taiga-ui/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TuiCell, TuiIcon, TuiLink, TuiTitle],
  templateUrl: './footer.html',
})
export class Footer {
  private readonly content = inject(ContentService);
  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly navigation = this.content.value.navigation;
  protected readonly brand = this.content.value.brand;
  protected readonly footer = this.content.value.footer;
  protected readonly header = this.content.value.header;
}
