import { inject, Injectable } from '@angular/core';
import { DoctorData, DoctorsResponse } from '../../../shared/models/doctor.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service/auth-service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  // ...existing code...
  deleteDoctor(doctorId: string) {
    const token = this.authService.getToken();
    return this.http.delete(`${this.baseUrl}/doctor/delete/${doctorId}/${token}`);
  }
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  public baseUrl: string = "http://localhost:8080";

  getAllDoctors() {
    return this.http.get<DoctorsResponse>(`${this.baseUrl}/doctor`);
  }
  getDoctorsByName(name: string) {
    return this.http.get<DoctorsResponse>(`${this.baseUrl}/doctor/filter/${name}/null/null`);
  }

  getDoctorsByTime(time: string) {
    return this.http.get<DoctorsResponse>(`${this.baseUrl}/doctor/filter/null/${time}/null`);
  }
  
  getDoctorsBySpecialty(specialty: string) {
    return this.http.get<DoctorsResponse>(`${this.baseUrl}/doctor/filter/null/null/${specialty}`);
  }

  addDoctor(doctor: DoctorData) {
    // http://localhost:8080/doctor/save/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTM1NzU2NCwiZXhwIjoxNzU5OTYyMzY0fQ.UNHRRklcbS02a1mreTP3ymvE5791sizoRrvAVbF1zXA
    const token = this.authService.getToken();
    return this.http.post<DoctorsResponse>(`${this.baseUrl}/doctor/save/${token}`, doctor);
  }

    // http://localhost:8080/doctor/delete/33/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1OTUyNzkxNiwiZXhwIjoxNzYwMTMyNzE2fQ.gDe1aqEnwEaID4LGsuSrIQPLpJA05TDBx8kE58PzqwQ

}
