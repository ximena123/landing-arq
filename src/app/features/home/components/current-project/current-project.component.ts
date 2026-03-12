import { Component, inject } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { ImgComponent } from '../../../../shared/components/img/img.component';

@Component({
  selector: 'app-current-project',
  standalone: true,
  imports: [ImgComponent],
  templateUrl: './current-project.component.html',
  styleUrl: './current-project.component.scss'
})
export class CurrentProjectComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
}
