import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../../core/services/content.service';
import { ImgComponent } from '../../../../shared/components/img/img.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [RouterLink, ImgComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
}
