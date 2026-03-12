import { Component, inject, signal, effect } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { ImageStorageService } from '../../../../core/services/image-storage.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);
  content = this.contentService.content;
  bgUrl = signal<string>('');
  logoUrl = signal<string>('');

  constructor() {
    effect(() => {
      const hero = this.content()?.hero;
      if (!hero) return;

      this.resolveUrl(hero.backgroundImage, url => this.bgUrl.set(url));
      this.resolveUrl(hero.logo, url => this.logoUrl.set(url));
    });
  }

  private resolveUrl(value: string, setter: (url: string) => void): void {
    if (value.startsWith('uploaded_')) {
      this.imageStorage.getImageUrl(value).then(url => setter(url || ''));
    } else {
      setter(value);
    }
  }

  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }
}
