import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'proyecto/:id',
    loadComponent: () => import('./features/projects/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'hero',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/admin/edit-project/edit-project.component').then(m => m.EditProjectComponent)
      },
      {
        path: ':section',
        loadComponent: () => import('./features/admin/edit-section/edit-section.component').then(m => m.EditSectionComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
