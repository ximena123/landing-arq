import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

const AUTH_KEY = 'admin_auth';
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'admin123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authenticatedSignal = signal(false);
  readonly isAuthenticated = computed(() => this.authenticatedSignal());

  constructor(private router: Router) {
    this.authenticatedSignal.set(localStorage.getItem(AUTH_KEY) === 'true');
  }

  login(username: string, password: string): boolean {
    const storedUser = localStorage.getItem('admin_username') || DEFAULT_USER;
    const storedPass = localStorage.getItem('admin_password') || DEFAULT_PASS;

    if (username === storedUser && password === storedPass) {
      this.authenticatedSignal.set(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticatedSignal.set(false);
    localStorage.removeItem(AUTH_KEY);
    this.router.navigate(['/admin/login']);
  }

  changeCredentials(username: string, password: string): void {
    localStorage.setItem('admin_username', username);
    localStorage.setItem('admin_password', password);
  }
}
