import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ServicesComponent } from './components/services/services.component';
import { CounterComponent } from './components/counter/counter.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CurrentProjectComponent } from './components/current-project/current-project.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ServicesComponent,
    CounterComponent,
    PortfolioComponent,
    TestimonialsComponent,
    CurrentProjectComponent,
    FooterComponent
  ],
  template: `
    <app-hero />
    <app-about />
    <app-services />
    <app-counter />
    <app-portfolio />
    <app-testimonials />
    <app-current-project />
    <app-footer />
  `
})
export class HomeComponent {}
