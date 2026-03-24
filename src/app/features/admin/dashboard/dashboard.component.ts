import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../core/services/content.service';
import { ImageStorageService } from '../../../core/services/image-storage.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  private contentService = inject(ContentService);
  private imageStorage = inject(ImageStorageService);

  sidebarOpen = signal(true);
  exportMessage = signal('');
  isExporting = signal(false);

  sections = [
    { id: 'hero', label: 'Hero / Inicio', icon: 'fa-image', route: 'hero' },
    { id: 'about', label: 'Acerca de Mi', icon: 'fa-user', route: 'about' },
    { id: 'services', label: 'Servicios', icon: 'fa-concierge-bell', route: 'services' },
    { id: 'counters', label: 'Contadores', icon: 'fa-sort-numeric-up', route: 'counters' },
    { id: 'portfolio', label: 'Portafolio', icon: 'fa-th-large', route: 'portfolio' },
    { id: 'testimonials', label: 'Testimonios', icon: 'fa-comments', route: 'testimonials' },
    { id: 'current-project', label: 'Proyecto en Curso', icon: 'fa-hammer', route: 'current-project' },
    { id: 'contact', label: 'Contacto', icon: 'fa-envelope', route: 'contact' },
    { id: 'projects', label: 'Proyectos', icon: 'fa-folder-open', route: 'projects' }
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  async exportContent(): Promise<void> {
    this.isExporting.set(true);
    this.exportMessage.set('Preparando exportación...');

    try {
      const zip = new JSZip();
      const images = await this.imageStorage.getAllImagesFull();

      // Get content and replace uploaded_ IDs with real file paths
      let contentJson = this.contentService.exportContent();

      // Add uploaded images to zip and update paths in content
      const imgFolder = zip.folder('img/uploaded')!;
      const usedFileNames = new Set<string>();

      for (const image of images) {
        const ext = this.getExtension(image.type);
        let fileName = image.name || `${image.id}${ext}`;

        // Avoid filename collisions by appending a unique suffix
        if (usedFileNames.has(fileName)) {
          const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
          const fileExt = fileName.substring(fileName.lastIndexOf('.'));
          const timestamp = image.id.match(/uploaded_(\d+)/)?.[1] || Date.now().toString();
          fileName = `${baseName}_${timestamp}${fileExt}`;
        }
        usedFileNames.add(fileName);

        imgFolder.file(fileName, image.data);

        // Replace all occurrences of the uploaded ID with the real path
        contentJson = contentJson.replaceAll(image.id, `img/uploaded/${fileName}`);
      }

      // Add the updated content.json
      zip.file('content.json', contentJson);

      // Generate and download
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `sitio-export-${new Date().toISOString().slice(0, 10)}.zip`);

      this.exportMessage.set(
        images.length > 0
          ? `Exportado: content.json + ${images.length} imagen(es). Descomprime en la carpeta del proyecto y ejecuta ./deploy.sh`
          : 'Exportado: content.json. Descomprime en la carpeta del proyecto y ejecuta ./deploy.sh'
      );
      setTimeout(() => this.exportMessage.set(''), 8000);
    } catch (err) {
      this.exportMessage.set('Error al exportar');
      setTimeout(() => this.exportMessage.set(''), 3000);
    } finally {
      this.isExporting.set(false);
    }
  }

  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg'
    };
    return map[mimeType] || '.png';
  }

  importContent(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const success = this.contentService.importContent(reader.result as string);
      this.exportMessage.set(success ? 'Contenido importado correctamente' : 'Error al importar');
      setTimeout(() => this.exportMessage.set(''), 3000);
    };
    reader.readAsText(file);
    input.value = '';
  }

  resetContent(): void {
    if (confirm('¿Estás seguro de restaurar el contenido original? Se perderán todos los cambios.')) {
      this.contentService.reloadFromFile();
      this.exportMessage.set('Contenido restaurado al original');
      setTimeout(() => this.exportMessage.set(''), 3000);
    }
  }
}
