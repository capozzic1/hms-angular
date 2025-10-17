import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DoctorService } from '../../core/services/doctor-service/doctor-service';
import { PatientService } from '../../core/services/patient-service/patient-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookAppointmentDialogComponent } from '../book-appointment-dialog/book-appointment-dialog.component';
import { LoginRequiredDialogComponent } from '../login-required-dialog/login-required-dialog.component';
import { AuthService } from '../../core/services/auth-service/auth-service';
import { Header } from '../../shared/components/header/header';


@Component({
    selector: 'app-patient-dashboard',
    standalone: true,
    imports: [
        CommonModule,
    MatInputModule,
    MatDialogModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        Header
    ],
    templateUrl: './patient-dashboard.component.html',
    styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
    patient = signal<any | null>(null);
    private patientService = inject(PatientService);
    private auth = inject(AuthService);
    private dialog = inject(MatDialog);
    doctors = signal<any[]>([]);
    searchControl = new FormControl('');
    timeFilter = new FormControl('');
    specialtyFilter = new FormControl('');
    specialties: string[] = [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Pediatrician',
        'Orthopedic',
        'Gynecologist',
        'Psychiatrist',
        'Dentist',
        'Ophthalmologist',
        'ENT Specialist',
        'Urologist',
        'Oncologist',
        'Gastroenterologist',
        'General Physician'
    ];
        times: string[] = [
            'AM',
            'PM'
        ];
    form!: FormGroup;
    private fb = inject(FormBuilder);
    private doctorService = inject(DoctorService);

    ngOnInit(): void {
        // Group all controls in a FormGroup
        this.form = this.fb.group({
            search: this.searchControl,
            time: this.timeFilter,
            specialty: this.specialtyFilter
        });
        this.doctorService.getAllDoctors().subscribe((data: any) => {
            const docs = data || [];
            this.doctors.set(docs);
        });

        this.searchControl.valueChanges.subscribe((name: string | null) => {
            const searchName = name || '';
            if (searchName) {
                this.doctorService.getDoctorsByName(searchName).subscribe((data: any) => {
                    this.doctors.set(data.doctors || []);
                });
            } else {
                this.doctorService.getAllDoctors().subscribe((data: any) => {
                    this.doctors.set(data || []);
                });
            }
        });

        this.timeFilter.valueChanges.subscribe((time: string | null) => {
            const searchTime = time || '';
            if (searchTime) {
                this.doctorService.getDoctorsByTime(searchTime).subscribe((data: any) => {
                    this.doctors.set(data.doctors || []);
                });
            } else {
                this.doctorService.getAllDoctors().subscribe((data: any) => {
                    this.doctors.set(data || []);
                });
            }
        });

        this.specialtyFilter.valueChanges.subscribe((specialty: string | null) => {
            const searchSpecialty = specialty || '';
            if (searchSpecialty) {
                this.doctorService.getDoctorsBySpecialty(searchSpecialty).subscribe((data: any) => {
                    this.doctors.set(data.doctors || []);
                });
            } else {
                this.doctorService.getAllDoctors().subscribe((data: any) => {
                    this.doctors.set(data || []);
                });
            }
        });

        // Load patient info for prefilling bookings
        this.patientService.getPatientInfo().subscribe(info => {
            const p = info?.patient || null;
            this.patient.set(p);
        });
    }

    openBookDialog(doc: any) {
        if (!this.auth.isLoggedIn()) {
            this.dialog.open(LoginRequiredDialogComponent, { width: '320px' });
            return;
        }

        const dialogRef = this.dialog.open(BookAppointmentDialogComponent, {
            data: {
            patientName: this.patient()?.name || '',
            patientId: this.patient()?.id || null,
            doctorName: doc.name,
            doctorId: doc.id,
            specialty: doc.specialty,
            email: doc.email,
            doctorData: doc
            },
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // handle booking confirmation (call backend, show toast, etc.)
                console.log('Booking confirmed', result);
            }
        });
    }

    formatTimeRange(range: string): string {
        const [start, end] = range.split('-');
        return `${this.formatTime(start)} – ${this.formatTime(end)}`;
    }

    private formatTime(time: string): string {
        const [hourStr, minute] = time.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        if (hour === 0) hour = 12;
        else if (hour > 12) hour -= 12;
        return `${hour}:${minute} ${ampm}`;
    }
}
