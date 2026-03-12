import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-current-project',
  standalone: true,
  templateUrl: './current-project.component.html',
  styleUrl: './current-project.component.scss'
})
export class CurrentProjectComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
}
