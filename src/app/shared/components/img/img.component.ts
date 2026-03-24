import { Component, inject, input, signal, effect, ViewEncapsulation } from '@angular/core';
import { ImageStorageService } from '../../../core/services/image-storage.service';

@Component({
  selector: 'app-img',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <img
      [src]="resolvedUrl()"
      [alt]="alt()"
      [loading]="loading()"
      [class]="imgClass()"
    />
  `,
  styles: [`
    app-img { display: contents; }
  `]
})
export class ImgComponent {
  private imageStorage = inject(ImageStorageService);

  src = input<string>('');
  alt = input<string>('');
  loading = input<'lazy' | 'eager'>('lazy');
  imgClass = input<string>('');

  resolvedUrl = signal<string>('');

  constructor() {
    effect(() => {
      const value = this.src();
      if (!value) {
        this.resolvedUrl.set('');
        return;
      }

      if (value.startsWith('uploaded_')) {
        this.imageStorage.getImageUrl(value).then(url => {
          this.resolvedUrl.set(url || '');
        });
      } else {
        this.resolvedUrl.set(encodeURI(value));
      }
    });
  }
}
