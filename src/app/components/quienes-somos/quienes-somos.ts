import { Component, inject } from '@angular/core';
import { TuiChip } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-quienes-somos',
  imports: [TuiChip, TuiCardLarge],
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  private readonly content = inject(ContentService);
  protected readonly about = this.content.value.aboutSection;
  protected readonly team = this.content.value.teamSection;
  protected readonly values = this.content.value.valuesSection;
  protected readonly header = this.content.value.header;
}
