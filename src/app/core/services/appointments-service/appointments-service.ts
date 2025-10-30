
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;
 
  
  updateAppointment(token: string, body: any) {
    return this.http.put(`${this.apiBase}/appointments/${token}`, body);
  }
  
  createAppointment(token: string, body: any) {
    return this.http.post(`${this.apiBase}/appointments/${token}`, body);
  }
  getAppointments(date: string, doctorName: string): any {
    const token = localStorage.getItem('token');

    if (doctorName == null || doctorName.trim() === '') {
      doctorName = 'null'; // or any default value your API expects
    }
    // doctorName param is not used in the sample URL, but you can append as needed
    // Example: `${this.baseUrl}/${date}/${doctorName}/${token}`
    return this.http.get(`${this.apiBase}/appointments/${date}/${doctorName}/${token}`);
  }
}
