import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SiteContent } from '../models/content.model';
import { firstValueFrom } from 'rxjs';

const STORAGE_KEY = 'site_content';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private contentSignal = signal<SiteContent | null>(null);
  readonly content = computed(() => this.contentSignal());
  readonly isLoaded = computed(() => this.contentSignal() !== null);

  constructor(private http: HttpClient) {}

  async loadContent(): Promise<void> {
    try {
      const timestamp = new Date().getTime();
      const data = await firstValueFrom(
        this.http.get<SiteContent>(`data/content.json?v=${timestamp}`)
      );
      this.contentSignal.set(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.contentSignal.set(JSON.parse(stored));
      }
    }
  }

  updateContent(content: SiteContent): void {
    this.contentSignal.set(content);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }

  updateSection<K extends keyof SiteContent>(key: K, value: SiteContent[K]): void {
    const current = this.contentSignal();
    if (!current) return;
    const updated = { ...current, [key]: value };
    this.updateContent(updated);
  }

  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.contentSignal.set(null);
  }

  async reloadFromFile(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    const timestamp = new Date().getTime();
    const data = await firstValueFrom(
      this.http.get<SiteContent>(`data/content.json?v=${timestamp}`)
    );
    this.contentSignal.set(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  exportContent(): string {
    return JSON.stringify(this.contentSignal(), null, 2);
  }

  importContent(json: string): boolean {
    try {
      const data = JSON.parse(json) as SiteContent;
      this.updateContent(data);
      return true;
    } catch {
      return false;
    }
  }
}
