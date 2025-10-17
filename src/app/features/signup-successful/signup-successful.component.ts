import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup-successful',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './signup-successful.component.html',
  styleUrls: ['./signup-successful.component.css']
})
export class SignupSuccessfulComponent {
  private ref = inject(MatDialogRef<SignupSuccessfulComponent>);
  close() { this.ref.close(); }
}
