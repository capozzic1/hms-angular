import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/patient';

  getAppointmentsByPastOrFuture(type: 'past' | 'future' | 'null', token: string): Observable<any> {
    // type should be 'past' or 'future'
    return this.http.get<any>(`${this.baseUrl}/filter/${type}/null/${token}`);
  }

  // Calls http://localhost:8080/patient to get patient info (including id), with Authorization header
  getPatientInfo(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return this.http.get<any>(`${this.baseUrl}`, {
      headers: { Authorization: token }
    });
  }

  // Calls http://localhost:8080/patient/{id} to get appointments for a patient, with Authorization header
  getAppointmentsByPatientId(id: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return this.http.get<any>(`${this.baseUrl}/${id}`, {
      headers: { Authorization: token }
    });
  }
}
