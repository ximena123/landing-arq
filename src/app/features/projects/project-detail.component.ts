import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ImgComponent } from '../../shared/components/img/img.component';
import { ImageStorageService } from '../../core/services/image-storage.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, FooterComponent, ImgComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);

  lightboxImage = signal<string | null>(null);

  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.contentService.content()?.projects.find(p => p.id === id) ?? null;
  });

  async openLightbox(imageUrl: string): Promise<void> {
    if (imageUrl.startsWith('uploaded_')) {
      const resolved = await this.imageStorage.getImageUrl(imageUrl);
      this.lightboxImage.set(resolved);
    } else {
      this.lightboxImage.set(imageUrl);
    }
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  getColClass(cols?: number): string {
    const c = cols || 4;
    return `col-lg-${c} col-md-6`;
  }
}
