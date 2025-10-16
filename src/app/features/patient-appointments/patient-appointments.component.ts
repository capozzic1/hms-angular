import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAppointmentDialogComponent } from '../update-appointment-dialog/update-appointment-dialog.component';
import { AppointmentsService } from '../../core/services/appointments-service/appointments-service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../shared/components/header/header';
import { DoctorService } from '../../core/services/doctor-service/doctor-service';
import { PatientService } from '../../core/services/patient-service/patient-service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss']
})
export class PatientAppointmentsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private appointmentsService = inject(AppointmentsService);
  onEditAppointment(appointment: any) {
    this.doctorService.getAllDoctors().subscribe((res: any) => {
      const doctor = (res || []).find((d: any) => d.id === appointment.doctorId);
      const dialogRef = this.dialog.open(UpdateAppointmentDialogComponent, {
        data: {
          patientName: appointment.patientName,
          doctorName: appointment.doctorName,
          date: appointment.appointmentDate,
          time: this.formatTimeForDropdown(appointment.appointmentTimeOnly),
          id: appointment.id,
          doctorId: appointment.doctorId,
          patientId: appointment.patientId,
          doctorData: doctor
        },
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Prepare request body for PUT
          const token = localStorage.getItem('token') || '';
          const body = {
            id: result.id,
            doctor: { id: result.doctorId },
            patient: { id: result.patientId },
            appointmentTime: this.combineDateAndTime(result.date, result.time),
            status: 0
          };
          this.appointmentsService.updateAppointment(token, body).subscribe(() => {
            this.loadAppointments();
          });
        }
      });
    });
  }

  formatTimeForDropdown(time: string): string {
    if (!time) return '';
    if (time.includes('-')) return time;
    const start = time.substring(0, 5);
    const hour = parseInt(start.split(':')[0], 10);
    const nextHour = (hour + 1).toString().padStart(2, '0');
    return `${start}-${nextHour}:00`;
  }

  combineDateAndTime(date: Date, time: string): string {
    if (!date || !time) return '';
    const d = new Date(date);
    const startTime = time.split('-')[0];
    const [h, m] = startTime.split(':');
    d.setHours(Number(h), Number(m), 0, 0);
    // Return a local ISO-like string (YYYY-MM-DDTHH:MM:SS) without converting to UTC.
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mins}:${secs}`;
  }
  appointments = signal<any[]>([]);
  filterControl = new FormControl('');
  searchControl = new FormControl('');
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private doctorService = inject(DoctorService);
  private patientService = inject(PatientService);
  filterOptions = [
    { value: '', label: 'All Appointments' },
    { value: 'upcoming', label: 'Upcoming Appointments' },
    { value: 'past', label: 'Past Appointments' }
  ];
  filteredAppointments = signal<any[]>([]);

  ngOnInit(): void {
    this.form = this.fb.group({
      search: this.searchControl,
      filter: this.filterControl
    });
    // Get patient info, then appointments by patient id
    this.patientService.getPatientInfo().subscribe(info => {
      const patientId = info?.patient?.id;
      if (patientId) {
        this.patientService.getAppointmentsByPatientId(patientId).subscribe(data => {
          this.appointments.set(data.appointments || []);
          this.filteredAppointments.set(this.appointments());
        });
      }
    });
    this.filterControl.valueChanges.subscribe(() => this.applyFilters());
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
  }

  // Loads appointments based on filter (past/future/all)
  // (No longer used for initial load)
  loadAppointments() {
    const filter = this.filterControl.value;
    const token = localStorage.getItem('token') || '';
    if (filter === 'past') {
      this.patientService.getAppointmentsByPastOrFuture('past', token).subscribe(data => {
        this.appointments.set(data.appointments || []);
        this.filteredAppointments.set(this.appointments());
      });
    } else if (filter === 'upcoming') {
      this.patientService.getAppointmentsByPastOrFuture('future', token).subscribe(data => {
        this.appointments.set(data.appointments || []);
        this.filteredAppointments.set(this.appointments());
      });
    } else {
      // fallback: load all (future)
      this.patientService.getAppointmentsByPastOrFuture('null', token).subscribe(data => {
        this.appointments.set(data.appointments || []);
        this.filteredAppointments.set(this.appointments());
      });
    }
  }

  applyFilters() {
    const search = this.searchControl.value?.trim();
    const filter = this.filterControl.value;
    const token = localStorage.getItem('token') || '';

    if (search) {
      // Search by doctor name using DoctorService
      this.doctorService.getDoctorsByName(search).subscribe(res => {
        // Map doctor names to appointments (filtering appointments by doctorName)
        const doctorNames = (res.doctors || []).map((d: any) => d.name.toLowerCase());
        // Always filter appointments by current filter (past/future)
        const loadType = filter === 'past' ? 'past' : 'future';
        this.patientService.getAppointmentsByPastOrFuture(loadType, token).subscribe(data => {
          const appts = (data.appointments || []).filter((a: any) =>
            doctorNames.includes(a.doctorName.toLowerCase())
          );
          this.appointments.set(appts);
          this.filteredAppointments.set(appts);
        });
      });
    } else {
      // No search: just load by filter
      this.loadAppointments();
    }
  }
}
