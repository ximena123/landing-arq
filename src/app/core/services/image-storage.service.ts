import { Injectable } from '@angular/core';

const DB_NAME = 'site_images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class ImageStorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveImage(file: File): Promise<string> {
    await this.init();
    const id = 'uploaded_' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const arrayBuffer = await file.arrayBuffer();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      store.put({
        id,
        data: arrayBuffer,
        type: file.type,
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });

      tx.oncomplete = () => resolve(id);
      tx.onerror = () => reject(tx.error);
    });
  }

  async getImageUrl(id: string): Promise<string | null> {
    if (!id.startsWith('uploaded_')) return null;

    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const record = request.result;
        if (!record) {
          resolve(null);
          return;
        }
        const blob = new Blob([record.data], { type: record.type });
        resolve(URL.createObjectURL(blob));
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllImages(): Promise<{ id: string; name: string; size: number; uploadedAt: string }[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(
          request.result.map((r: any) => ({
            id: r.id,
            name: r.name,
            size: r.size,
            uploadedAt: r.uploadedAt
          }))
        );
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getAllImagesFull(): Promise<{ id: string; name: string; type: string; data: ArrayBuffer }[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(
          request.result.map((r: any) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            data: r.data
          }))
        );
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
