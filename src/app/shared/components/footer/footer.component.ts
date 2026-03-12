import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { ImgComponent } from '../img/img.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ImgComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
  currentYear = new Date().getFullYear();
}
