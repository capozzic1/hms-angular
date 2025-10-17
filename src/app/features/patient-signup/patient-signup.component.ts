import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PatientService } from '../../core/services/patient-service/patient-service';
import { MatDialog } from '@angular/material/dialog';
import { SignupSuccessfulComponent } from '../signup-successful/signup-successful.component';

@Component({
  selector: 'app-patient-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.scss']
})
export class PatientSignupComponent {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private dialog = inject(MatDialog);
  private ref = inject<MatDialogRef<PatientSignupComponent>>(MatDialogRef);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: [''],
    address: ['']
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const v: any = this.form.value || {};
    const payload = {
      name: String(v.name || ''),
      email: String(v.email || ''),
      password: String(v.password || ''),
      phone: v.phone ? String(v.phone) : undefined,
      address: v.address ? String(v.address) : undefined
    };
    this.patientService.createPatient(payload).subscribe({
      next: (res) => {
        this.ref.close({ ok: true, patient: res });
        // open success dialog
        setTimeout(() => {
          this.dialog.open(SignupSuccessfulComponent, { width: '360px' });
        }, 10);
        
      },
      error: (err) => {
        this.error.set(err?.error?.message || err?.message || 'Signup failed');
        this.loading.set(false);
      }
    });
  }

  cancel() { this.ref.close(null); }
}
