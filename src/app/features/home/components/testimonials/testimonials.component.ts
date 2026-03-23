import { Component, inject, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';
@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  private contentService = inject(ContentService);
  content = this.contentService.content;
  currentIndex = signal(0);

  next(): void {
    const testimonials = this.content()?.testimonials || [];
    this.currentIndex.update(i => (i + 1) % testimonials.length);
  }

  prev(): void {
    const testimonials = this.content()?.testimonials || [];
    this.currentIndex.update(i => (i - 1 + testimonials.length) % testimonials.length);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}
