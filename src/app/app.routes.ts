

import { Routes } from '@angular/router';

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
      import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  {
    path: 'doctorDashboard',
    loadComponent: () =>
      import('./features/doctor-dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
  },
  {
    path: 'patientDashboard',
    loadComponent: () =>
      import('./features/patient-dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
