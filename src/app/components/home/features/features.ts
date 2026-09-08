import { Component, inject } from '@angular/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
})
export class Features {
  private readonly content = inject(ContentService);
  protected readonly teamsSection = this.content.value.teamsSection;
}
