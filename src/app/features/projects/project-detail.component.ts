import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  lightboxImage = signal<string | null>(null);

  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.contentService.content()?.projects.find(p => p.id === id) ?? null;
  });

  openLightbox(imageUrl: string): void {
    this.lightboxImage.set(imageUrl);
  }

  closeLightbox(): void {
    this.lightboxImage.set(null);
  }

  getColClass(cols?: number): string {
    const c = cols || 4;
    return `col-lg-${c} col-md-6`;
  }
}
