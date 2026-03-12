import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { BackToTopComponent } from './shared/components/back-to-top/back-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, BackToTopComponent],
  template: `
    <app-navbar />
    <router-outlet />
    <app-back-to-top />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {}
