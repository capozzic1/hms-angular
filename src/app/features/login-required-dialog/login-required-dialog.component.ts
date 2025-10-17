import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-required-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './login-required-dialog.component.html',
  styleUrls: ['./login-required-dialog.component.css']
})
export class LoginRequiredDialogComponent {
  private ref = inject(MatDialogRef<LoginRequiredDialogComponent>);
  close() { this.ref.close(); }
}
