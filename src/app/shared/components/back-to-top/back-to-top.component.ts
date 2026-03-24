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
      width: 42px;
      height: 42px;
      border: 1px solid rgba(58, 64, 35, 0.15);
      background: #fff;
      color: #3A4023;
      font-size: 0.8rem;
      cursor: pointer;
      z-index: 999;
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

      &:hover {
        background: #3A4023;
        border-color: #3A4023;
        color: #fff;
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
