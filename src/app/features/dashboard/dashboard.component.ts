import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../auth/login/login-dialog.component';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, Header],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  title = 'Dashboard';
  stats = [
    { label: 'Users', value: 1280 },
    { label: 'Sessions', value: 5320 },
    { label: 'Conversion', value: '3.7%' },
    { label: 'Revenue', value: '$12.4k' }
  ];

    private dialog = inject(MatDialog);

  openLoginDialog(role: 'admin' | 'doctor') {
    const ref = this.dialog.open(LoginDialogComponent, {
      width: '380px',
      disableClose: true,
      data: { role } // you can use this inside the dialog to customize text
    });

    ref.afterClosed().subscribe(result => {
      if (result?.ok) {
        console.log(`Logged in as ${role}:`, result.email);
        // navigate or call AuthService.login() here
      }
    });
  }
}
