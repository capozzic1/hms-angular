import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/appointments';

  getAppointments(date: string, doctorName: string): any {
    const token = localStorage.getItem('token');

    if (doctorName == null || doctorName.trim() === '') {
      doctorName = 'null'; // or any default value your API expects
    }
    // doctorName param is not used in the sample URL, but you can append as needed
    // Example: `${this.baseUrl}/${date}/${doctorName}/${token}`
    return this.http.get(`${this.baseUrl}/${date}/${doctorName}/${token}`);
  }
}
