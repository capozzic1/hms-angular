

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'patientAppointments',
    loadComponent: () =>
      import('./features/patient-appointments/patient-appointments.component').then(m => m.PatientAppointmentsComponent)
  },
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
      import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'doctorDashboard',
    loadComponent: () =>
      import('./features/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
    ,
    canActivate: [AuthGuard],
    data: { roles: ['doctor'] }
  },
  {
    path: 'patientDashboard',
    loadComponent: () =>
      import('./features/patient-dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
