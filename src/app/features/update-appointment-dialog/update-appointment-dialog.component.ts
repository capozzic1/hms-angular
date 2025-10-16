import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-appointment-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  templateUrl: './update-appointment-dialog.component.html',
  styleUrls: ['./update-appointment-dialog.component.scss'],
  
})
export class UpdateAppointmentDialogComponent {
  form: FormGroup;
  times: string[] = [];
  dialogRef = inject<MatDialogRef<UpdateAppointmentDialogComponent>>(
    MatDialogRef<UpdateAppointmentDialogComponent>,
  );
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      patientName: [{ value: data.patientName, disabled: true }],
      doctorName: [{ value: data.doctorName, disabled: true }],
      date: [data.date ? new Date(data.date) : '', Validators.required],
      time: [data.time, Validators.required]
    });
    // Set times from injected doctorData if available
    if (data.doctorData && Array.isArray(data.doctorData.availableTimes)) {
      this.times = data.doctorData.availableTimes;
    } else {
      this.times = [];
    }
  }

  onUpdate() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.data,
        date: this.form.value.date,
        time: this.form.value.time
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
