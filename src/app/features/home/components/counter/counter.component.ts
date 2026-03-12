import { Component, inject, ElementRef, AfterViewInit, signal } from '@angular/core';
import { ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent implements AfterViewInit {
  private contentService = inject(ContentService);
  private elementRef = inject(ElementRef);
  content = this.contentService.content;
  animatedValues = signal<Record<string, number>>({});
  private hasAnimated = false;

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(this.elementRef.nativeElement);
  }

  private animateCounters(): void {
    const counters = this.content()?.counters || [];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      const values: Record<string, number> = {};
      for (const counter of counters) {
        values[counter.id] = Math.round(counter.value * eased);
      }
      this.animatedValues.set(values);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);
  }

  getAnimatedValue(id: string, target: number): number {
    return this.animatedValues()[id] ?? 0;
  }
}
