import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../core/services/content.service';
import { ImageStorageService } from '../../../core/services/image-storage.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);
  content = this.contentService.content;
  currentYear = new Date().getFullYear();
  logoUrl = signal<string>('');

  constructor() {
    effect(() => {
      const logo = this.content()?.hero.logo || '';
      if (logo.startsWith('uploaded_')) {
        this.imageStorage.getImageUrl(logo).then(url => this.logoUrl.set(url || ''));
      } else {
        this.logoUrl.set(logo);
      }
    });
  }
}
