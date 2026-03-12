import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ImgComponent } from '../../shared/components/img/img.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, FooterComponent, ImgComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
}
