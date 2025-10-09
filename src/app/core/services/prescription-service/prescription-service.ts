import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/prescription';

  getPrescription(appointmentId: number, token: string) {
    return this.http.get(`${this.baseUrl}/${appointmentId}/${token}`);
  }

  savePrescription(prescription: any, token: string) {
    return this.http.post(`${this.baseUrl}/${token}`, prescription);
  }
}
