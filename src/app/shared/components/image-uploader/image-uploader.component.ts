import { Component, inject, input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { ImageStorageService } from '../../../core/services/image-storage.service';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss'
})
export class ImageUploaderComponent implements OnInit, OnDestroy {
  private imageStorage = inject(ImageStorageService);

  currentValue = input<string>('');
  imageChanged = output<string>();

  previewUrl = signal<string | null>(null);
  isUploading = signal(false);
  isDragOver = signal(false);
  private objectUrl: string | null = null;

  async ngOnInit(): Promise<void> {
    await this.resolvePreview();
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  private async resolvePreview(): Promise<void> {
    const value = this.currentValue();
    if (!value) {
      this.previewUrl.set(null);
      return;
    }

    if (value.startsWith('uploaded_')) {
      const url = await this.imageStorage.getImageUrl(value);
      this.objectUrl = url;
      this.previewUrl.set(url);
    } else {
      this.previewUrl.set(value);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      await this.uploadFile(file);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      await this.uploadFile(file);
    }
  }

  private async uploadFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;

    this.isUploading.set(true);

    try {
      const id = await this.imageStorage.saveImage(file);
      const url = await this.imageStorage.getImageUrl(id);

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }
      this.objectUrl = url;
      this.previewUrl.set(url);
      this.imageChanged.emit(id);
    } finally {
      this.isUploading.set(false);
    }
  }

  removeImage(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.previewUrl.set(null);
    this.imageChanged.emit('');
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
