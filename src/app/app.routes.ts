
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/doctor-profile/doctor-profile.component').then(m => m.DoctorProfileComponent),
  },
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
  {
    path: 'doctorDashboard',
    loadComponent: () =>
      import('./features/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
