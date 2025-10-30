import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;


  getAppointmentsByPastOrFuture(type: 'past' | 'future' | 'null', token: string): Observable<any> {
    // type should be 'past' or 'future'
    return this.http.get<any>(`${this.apiBase}/patient/filter/${type}/null/${token}`);
  }

  // Calls /patient to get patient info (including id), with Authorization header
  getPatientInfo(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return this.http.get<any>(`${this.apiBase}/patient`, {
      headers: { Authorization: token }
    });
  }

  // Calls /patient/{id} to get appointments for a patient, with Authorization header
  getAppointmentsByPatientId(id: number): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    return this.http.get<any>(`${this.apiBase}/patient/${id}`, {
      headers: { Authorization: token }
    });
  }

  // Create a new patient (signup)
  createPatient(payload: { name: string; email: string; password: string; phone?: string; address?: string; }): Observable<any> {
    return this.http.post<any>(`${this.apiBase}/patient`, payload);
  }
}
