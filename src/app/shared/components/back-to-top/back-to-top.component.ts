import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  template: `
    @if (isVisible()) {
      <button class="back-to-top" (click)="scrollToTop()" aria-label="Volver arriba">
        <i class="fa-solid fa-chevron-up"></i>
      </button>
    }
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 45px;
      height: 45px;
      border: none;
      border-radius: 50%;
      background: #3A4023;
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      z-index: 999;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);

      &:hover {
        background: #697446;
        transform: translateY(-3px);
      }
    }
  `]
})
export class BackToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
