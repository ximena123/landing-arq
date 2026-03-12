import { Component, inject, signal, effect } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { ImageStorageService } from '../../../../core/services/image-storage.service';
import { ImgComponent } from '../../../../shared/components/img/img.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ImgComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);
  content = this.contentService.content;
  bgUrl = signal<string>('');

  constructor() {
    effect(() => {
      const bg = this.content()?.hero.backgroundImage || '';
      if (bg.startsWith('uploaded_')) {
        this.imageStorage.getImageUrl(bg).then(url => this.bgUrl.set(url || ''));
      } else {
        this.bgUrl.set(bg);
      }
    });
  }

  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
