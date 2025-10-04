import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
    {
    path: 'adminDashboard',
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
