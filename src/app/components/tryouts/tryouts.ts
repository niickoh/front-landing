import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-tryouts',
  imports: [RouterLink, TuiButton],
  templateUrl: './tryouts.html',
})
export class Tryouts {
  private readonly content = inject(ContentService);
  protected readonly tryouts = this.content.value.tryouts;
}
