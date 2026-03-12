import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { SiteContent } from '../../../core/models/content.model';
import { ImageUploaderComponent } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-edit-section',
  standalone: true,
  imports: [FormsModule, ImageUploaderComponent],
  templateUrl: './edit-section.component.html',
  styleUrl: './edit-section.component.scss'
})
export class EditSectionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  sectionKey = '';
  sectionTitle = '';
  saved = signal(false);
  editData: any = null;

  private imageFields = new Set([
    'image', 'backgroundImage', 'logo', 'thumbnail'
  ]);

  private sectionTitles: Record<string, string> = {
    hero: 'Hero / Inicio',
    about: 'Acerca de Mi',
    services: 'Servicios',
    counters: 'Contadores',
    portfolio: 'Portafolio',
    testimonials: 'Testimonios',
    'current-project': 'Proyecto en Curso',
    contact: 'Contacto'
  };

  private sectionMap: Record<string, keyof SiteContent> = {
    hero: 'hero',
    about: 'about',
    services: 'services',
    counters: 'counters',
    portfolio: 'portfolio',
    testimonials: 'testimonials',
    'current-project': 'currentProject',
    contact: 'contact'
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sectionKey = params.get('section') || '';
      this.sectionTitle = this.sectionTitles[this.sectionKey] || this.sectionKey;
      this.loadData();
    });
  }

  private loadData(): void {
    const content = this.contentService.content();
    if (!content) return;
    const key = this.sectionMap[this.sectionKey];
    if (key) {
      this.editData = JSON.parse(JSON.stringify(content[key]));
    }
  }

  save(): void {
    const key = this.sectionMap[this.sectionKey];
    if (!key || !this.editData) return;
    this.contentService.updateSection(key, this.editData);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  isArray(): boolean {
    return Array.isArray(this.editData);
  }

  isImageField(key: string): boolean {
    return this.imageFields.has(key);
  }

  onImageChanged(key: string, newValue: string, item?: any): void {
    if (item) {
      item[key] = newValue;
    } else {
      this.editData[key] = newValue;
    }
  }

  addItem(): void {
    if (!Array.isArray(this.editData)) return;
    const template = this.editData[0];
    if (!template) return;
    const newItem: any = {};
    for (const key of Object.keys(template)) {
      if (key === 'id') {
        newItem[key] = 'new_' + Date.now();
      } else if (key === 'images') {
        newItem[key] = [];
      } else if (typeof template[key] === 'number') {
        newItem[key] = 0;
      } else {
        newItem[key] = '';
      }
    }
    this.editData.push(newItem);
  }

  removeItem(index: number): void {
    if (!Array.isArray(this.editData)) return;
    this.editData.splice(index, 1);
  }

  getObjectKeys(obj: any): string[] {
    if (!obj) return [];
    return Object.keys(obj).filter(k => k !== 'id');
  }

  getFieldType(value: any): string {
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && value.length > 100) return 'textarea';
    return 'text';
  }

  getFieldLabel(key: string): string {
    const labels: Record<string, string> = {
      title: 'Título', subtitle: 'Subtítulo', description: 'Descripción',
      text: 'Texto', name: 'Nombre', image: 'Imagen',
      backgroundImage: 'Imagen de Fondo', icon: 'Icono', logo: 'Logo',
      value: 'Valor', prefix: 'Prefijo', label: 'Etiqueta',
      category: 'Categoría', link: 'Enlace', url: 'URL',
      location: 'Ubicación', phone: 'Teléfono', email: 'Email',
      instagram: 'Instagram', instagramUrl: 'URL Instagram',
      linkedin: 'LinkedIn', linkedinUrl: 'URL LinkedIn',
      tagline: 'Eslogan', highlightText: 'Texto Destacado',
      year: 'Año', thumbnail: 'Miniatura', cols: 'Columnas', alt: 'Texto Alt'
    };
    return labels[key] || key;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
