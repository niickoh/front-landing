import { Component } from '@angular/core';
import { appContent } from '../../content.config';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  protected readonly about = appContent.aboutSection;
  protected readonly team = appContent.teamSection;
  protected readonly values = appContent.valuesSection;
}
