import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  private readonly apiBase = environment.apiBase;

  getProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<any>(`${this.apiBase}/doctor/profile`, { headers });
  }

  updateProfile(payload: any): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const url = `${this.apiBase}/doctor/${token}`;
    return this.http.put(url, payload);
  }
}
