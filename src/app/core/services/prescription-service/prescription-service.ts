import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  getPrescription(appointmentId: number, token: string) {
    return this.http.get(`${this.apiBase}/prescription/${appointmentId}/${token}`);
  }

  savePrescription(prescription: any, token: string) {
    return this.http.post(`${this.apiBase}/prescription/${token}`, prescription);
  }
}
