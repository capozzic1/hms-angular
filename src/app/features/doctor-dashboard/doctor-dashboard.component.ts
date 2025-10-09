import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog.component';
import { AppointmentsService } from '../../core/services/appointments-service/appointments-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    Header
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent {

  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'name', 'phone', 'email', 'prescription'];
  dataSource = signal<any[]>([]); // Use signal for data source
  selectedDate = new Date();

  private appointmentsService = inject(AppointmentsService);
  doctorName = '';

  openPrescriptionDialog(appointmentId: any) {
    this.dialog.open(PrescriptionDialogComponent, {
      data: { appointmentId }
    });
  }
  
  onDateChange(date: Date) {
    this.selectedDate = date;
    const dateStr = date.toISOString().split('T')[0];
    this.appointmentsService.getAppointments(dateStr, this.doctorName || '').subscribe((res: any) => {
      // Map API response to table data
      this.dataSource.set((res.appointments || []).map((appt: any) => ({
        id: appt.patientId,
        name: appt.patientName,
        phone: appt.patientPhone,
        email: appt.patientEmail,
        prescription: '',
        appointmentId: appt.id
      })));
    });
  }

  onDoctorNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.doctorName = input.value;
    if (this.doctorName.trim().length === 0) return;
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.appointmentsService.getAppointments(dateStr, this.doctorName).subscribe((res: any) => {
      this.dataSource.set((res.appointments || []).map((appt: any) => ({
        id: appt.patientId,
        name: appt.patientName,
        phone: appt.patientPhone,
        email: appt.patientEmail,
        prescription: '',
        appointmentId: appt.id
      })));
    });
  }

  onTodaysAppointments() {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    this.appointmentsService.getAppointments(dateStr, this.doctorName || '').subscribe((res: any) => {
      this.dataSource.set((res.appointments || []).map((appt: any) => ({
        id: appt.patientId,
        name: appt.patientName,
        phone: appt.patientPhone,
        email: appt.patientEmail,
        prescription: '',
        appointmentId: appt.id
      })));
    });
  }

  
// http://localhost:8080/appointments/2025-04-07/a/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkci5qb2huc29uQGV4YW1wbGUuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTc1OTg1MDE4NiwiZXhwIjoxNzYwNDU0OTg2fQ.J7dx49k-75vRq3qk89FPtZoLnuvtmRjBwkFc3bt-xGw
}
