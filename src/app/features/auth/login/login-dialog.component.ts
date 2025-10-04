import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


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


    loading = signal(false);
    error = signal<string | null>(null);


    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });


    async submit() {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        try {
            this.ref.close({ email: this.form.value.email, ok: true });
        } catch (e: any) {
            this.error.set(e?.message ?? 'Login failed');
            this.loading.set(false);
        }
    }


    close() { this.ref.close(null); }
}