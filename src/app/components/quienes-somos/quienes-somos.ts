import { Component, inject } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  private readonly content = inject(ContentService);
  protected readonly about = this.content.value.aboutSection;
  protected readonly team = this.content.value.teamSection;
  protected readonly values = this.content.value.valuesSection;
}
