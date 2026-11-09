import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-cta-section',
  imports: [RouterLink, TuiButton],
  templateUrl: './cta-section.html',
})
export class CtaSection {
  private readonly content = inject(ContentService);
  protected readonly cta = this.content.value.cta;
}
