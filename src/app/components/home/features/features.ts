import { Component } from '@angular/core';
import { appContent } from '../../../content.config';

@Component({
  selector: 'app-features',
  templateUrl: './features.html',
})
export class Features {
  protected readonly teamsSection = appContent.teamsSection;
}
