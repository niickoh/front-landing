import { Component, inject } from '@angular/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-features',
  imports: [TuiCardLarge],
  templateUrl: './features.html',
})
export class Features {
  private readonly content = inject(ContentService);
  protected readonly teamsSection = this.content.value.teamsSection;
  protected readonly header = this.content.value.header;
}
