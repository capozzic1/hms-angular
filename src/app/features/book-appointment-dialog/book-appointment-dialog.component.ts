import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {  MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { AppointmentsService } from '../../core/services/appointments-service/appointments-service';

@Component({
  selector: 'app-book-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule
  ],
    providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  templateUrl: './book-appointment-dialog.component.html',
  styleUrls: ['./book-appointment-dialog.component.scss']
})
export class BookAppointmentDialogComponent {
  form: FormGroup;
  times = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00'
  ];
    appointmentsService = inject(AppointmentsService);

  constructor(
    private dialogRef: MatDialogRef<BookAppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      patientName: [data?.patientName || '', Validators.required],
      doctorName: [data?.doctorName || '', Validators.required],
      specialty: [data?.specialty || ''],
      email: [data?.email || ''],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });

    // If doctor has availableTimes, use them
    if (data?.doctorData?.availableTimes) {
      this.times = data.doctorData.availableTimes;
    }
  }

  confirm() {
    if (this.form.valid) {
      // Prepare body for backend using ids passed in data
      const formValue = this.form.value;
      const body = {
        doctor: { id: this.data?.doctorId ?? formValue.doctorId ?? null },
        patient: { id: this.data?.patientId ?? formValue.patientId ?? null },
        appointmentTime: this.combineDateAndTime(formValue.date, formValue.time),
        status: 0
      };

      // use provided token for testing (replace with localStorage token in production)
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzYwNjI3NDAxLCJleHAiOjE3NjEyMzIyMDF9.zsM0-YsL0XEaFF53ekfYoq0CH1fTjiembQ-GIF0X4Mw';

      this.appointmentsService.createAppointment(token, body).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error('Booking failed', err);
          this.dialogRef.close();
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  combineDateAndTime(date: Date, time: string): string {
    if (!date || !time) return '';
    const d = new Date(date);
    const startTime = time.split('-')[0];
    const [h, m] = startTime.split(':');
    d.setHours(Number(h), Number(m), 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mins}:${secs}`;
  }
}
