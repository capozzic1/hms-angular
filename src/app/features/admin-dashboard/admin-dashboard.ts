import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardActions } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DoctorsList } from '../doctors-list/doctors-list';
import { Doctor, DoctorsResponse } from '../../shared/models/doctor.model';
import { DoctorService } from '../../core/services/doctor-service/doctor-service';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatLabel, MatFormFieldModule, MatInputModule, DoctorsList, Header],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  private doctorService = inject(DoctorService);
  public data = signal<Doctor[]>([]);

  ngOnInit(): void {
    this.doctorService.getAllDoctors().subscribe((res: any) => {
      this.data.set(res);
    }
    )
  }

    onDeleteDoctor(doctorId: string) {
    this.doctorService.deleteDoctor(doctorId).subscribe({
      next: () => {
        // Optionally refresh list or show notification
        console.log(`Doctor with ID ${doctorId} deleted successfully.`);
        this.data.set(this.data().filter(d => d.id !== Number(doctorId)));
      },
      error: err => {
        console.error('Delete failed', err);
      }
    });
  }

  onNameChanged(event: any) {
    
    const name = event.target.value;
    if (!name || name.length === 0) {
      this.doctorService.getAllDoctors().subscribe((res: any) => {
        this.data.set(res);});
      return;
    }
    this.doctorService.getDoctorsByName(name).subscribe((res: any) => {
      if (res.doctors) {
        this.data.set(res.doctors);
      }
    });
  }

  onTimeChanged(event: any) {
    const time = event.target.value;
    
    this.doctorService.getDoctorsByTime(time).subscribe((res: any) => {
      if (res.doctors) {
        this.data = res.doctors;
      }
    });
  }

  onSpecialtyChanged(event: any) {
    const specialty = event.target.value;
    if (specialty === 'getAll') {
      this.doctorService.getAllDoctors().subscribe((res: any) => {
        this.data.set(res);
      });
      return;
    }
    this.doctorService.getDoctorsBySpecialty(specialty).subscribe((res: any) => {
      if (res.doctors) {
        this.data.set(res.doctors);
      }
    });
  }

}
