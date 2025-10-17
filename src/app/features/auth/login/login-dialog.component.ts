import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'app-login-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
    private fb = inject(FormBuilder);
    private ref = inject<MatDialogRef<LoginDialogComponent>>(MatDialogRef);
    private auth = inject(AuthService);
    private router = inject(Router);
    private data = inject(MAT_DIALOG_DATA) as { role?: 'admin' | 'doctor' | 'patient' };

    loading = signal(false);
    error = signal<string | null>(null);


    form = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });


    submit() {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        const username = String(this.form.value.username ?? '');
        const password = String(this.form.value.password ?? '');

        const role = this.data?.role ?? 'admin';
        let login$;
        if (role === 'doctor') login$ = this.auth.loginDoctor(username, password);
        else if (role === 'patient') login$ = this.auth.loginPatient(username, password);
        else login$ = this.auth.loginAdmin(username, password);

        login$.subscribe({
            next: () => {
                this.ref.close({ ok: true, role });
                const route = role === 'doctor' ? '/doctorDashboard' : role === 'patient' ? '/patientDashboard' : '/adminDashboard';
                this.router.navigate([route]);
            },
            error: (e: any) => {
                this.error.set(e?.error?.message ?? e?.message ?? 'Login failed');
                this.loading.set(false);
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }


    close() { this.ref.close(null); }
}