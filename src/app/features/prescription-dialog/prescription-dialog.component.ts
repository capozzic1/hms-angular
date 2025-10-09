import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PrescriptionService } from '../../core/services/prescription-service/prescription-service';

@Component({
  selector: 'app-prescription-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './prescription-dialog.component.html',
  styleUrls: ['./prescription-dialog.component.scss']
})
export class PrescriptionDialogComponent {
  form: FormGroup;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PrescriptionDialogComponent>,
    private prescriptionService: PrescriptionService,
    @Inject(MAT_DIALOG_DATA) public data: { appointmentId: number }
  ) {
    this.form = this.fb.group({
      patientName: [{ value: '', disabled: true }],
      medication: [''],
      dosage: [''],
      doctorNotes: ['']
    });
    this.loadPrescription();
  }

  loadPrescription() {
    const token = localStorage.getItem('token') || '';
    this.prescriptionService.getPrescription(this.data.appointmentId, token).subscribe((res: any) => {
      const p = res.pDtos?.[0] || {};
      this.form.patchValue({
        patientName: p.patientName || '',
        medication: p.medication || '',
        dosage: p.dosage || '',
        doctorNotes: p.doctorNotes || ''
      });
      this.loading = false;
    });
  }

  onSave() {
    const token = localStorage.getItem('token') || '';
    const payload = {
      ...this.form.getRawValue(),
      appointmentId: this.data.appointmentId
    };
    this.prescriptionService.savePrescription(payload, token).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
