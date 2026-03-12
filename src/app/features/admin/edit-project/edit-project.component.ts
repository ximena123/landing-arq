import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../../core/services/content.service';
import { ProjectDetail, ProjectImage } from '../../../core/models/content.model';

@Component({
  selector: 'app-edit-projects',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent {
  private contentService = inject(ContentService);

  projects: ProjectDetail[] = [];
  saved = signal(false);
  expandedProject = signal<string | null>(null);

  constructor() {
    this.loadProjects();
  }

  private loadProjects(): void {
    const content = this.contentService.content();
    if (content) {
      this.projects = JSON.parse(JSON.stringify(content.projects));
    }
  }

  toggleProject(id: string): void {
    this.expandedProject.update(v => v === id ? null : id);
  }

  addProject(): void {
    this.projects.push({
      id: 'project_' + Date.now(),
      title: 'Nuevo Proyecto',
      year: new Date().getFullYear().toString(),
      thumbnail: '',
      description: '',
      images: []
    });
  }

  removeProject(index: number): void {
    if (confirm('¿Eliminar este proyecto?')) {
      this.projects.splice(index, 1);
    }
  }

  addImage(project: ProjectDetail): void {
    project.images.push({
      url: '',
      alt: '',
      cols: 4
    });
  }

  removeImage(project: ProjectDetail, index: number): void {
    project.images.splice(index, 1);
  }

  save(): void {
    this.contentService.updateSection('projects', this.projects);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
