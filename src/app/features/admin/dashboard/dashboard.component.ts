import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent {
  private authService = inject(AuthService);
  private contentService = inject(ContentService);

  sidebarOpen = signal(true);
  exportMessage = signal('');

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

  exportContent(): void {
    const json = this.contentService.exportContent();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    a.click();
    URL.revokeObjectURL(url);
    this.exportMessage.set('Contenido exportado correctamente');
    setTimeout(() => this.exportMessage.set(''), 3000);
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
