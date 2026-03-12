import { Component, inject, signal, effect } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
import { ImageStorageService } from '../../../../core/services/image-storage.service';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);
  content = this.contentService.content;
  resolvedBgs = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      const services = this.content()?.services || [];
      const bgs: Record<string, string> = {};

      services.forEach(async s => {
        if (s.backgroundImage.startsWith('uploaded_')) {
          const url = await this.imageStorage.getImageUrl(s.backgroundImage);
          bgs[s.id] = url || '';
          this.resolvedBgs.set({ ...bgs });
        } else {
          bgs[s.id] = s.backgroundImage;
          this.resolvedBgs.set({ ...bgs });
        }
      });
    });
  }

  getBgUrl(serviceId: string, fallback: string): string {
    return this.resolvedBgs()[serviceId] || fallback;
  }
}
