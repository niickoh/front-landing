import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-tryouts-banner',
  imports: [RouterLink, TuiButton],
  templateUrl: './tryouts-banner.html',
})
export class TryoutsBanner {
  private readonly content = inject(ContentService);
  protected readonly banner = this.content.value.tryouts.banner;
}
