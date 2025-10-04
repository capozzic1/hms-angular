import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DoctorAddDialogComponent } from '../../../features/add-doctor/doctor-add-dialog.component';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule,MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
 
})
export class Header {
  private dialog = inject(MatDialog);
  public openAddDoctorDialog() {
    this.dialog.open(DoctorAddDialogComponent, {
      width: '400px'
    });
  }
}
