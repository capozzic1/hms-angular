import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DoctorAddDialogComponent } from '../../../features/add-doctor/doctor-add-dialog.component';
import { LoginDialogComponent } from '../../../features/auth/login/login-dialog.component';
import { PatientSignupComponent } from '../../../features/patient-signup/patient-signup.component';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',

})
export class Header {
  private dialog = inject(MatDialog);
  public auth = inject(AuthService) as AuthService;
  private router = inject(Router) as Router;
  public openAddDoctorDialog() {
    this.dialog.open(DoctorAddDialogComponent, {
      width: '400px'
    });
  }
  public openPatientLogin() {
    const ref = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      data: { role: 'patient' }
    });
    // Optionally act on close
    ref.afterClosed().subscribe(result => {
      if (result && result.success) {
        // stay on patient dashboard or navigate if needed
        if (!this.isPatientRoute()) {
          this.router.navigate(['/patientDashboard']);
        }
      }
    });
  }
  public openPatientSignup() {
    const ref = this.dialog.open(PatientSignupComponent, { width: '520px' });
    ref.afterClosed().subscribe(result => {
      if (result && result.ok) {
        // optionally navigate or show message
        console.log('Patient signed up', result.patient);
      }
    });
  }
  public goToProfile() {
    this.router.navigate(['/profile']);
  }
  public goToAppointments() {
    this.router.navigate(['/patientAppointments']);
  }
  public isPatientRoute(): boolean {
    return this.router.url === '/patientDashboard' || this.router.url.startsWith('/patientDashboard');
  }
  public goToHome() {
    this.router.navigate(['/patientDashboard']);
  }

  public logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
