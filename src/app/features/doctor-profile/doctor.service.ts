import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);

  getProfile(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get<any>('http://localhost:8080/doctor/profile', { headers });
  }

  updateProfile(payload: any): Observable<any> {
    const url = 'http://localhost:8080/doctor/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkci5qb2huc29uQGV4YW1wbGUuY29tIiwicm9sZSI6ImRvY3RvciIsImlhdCI6MTc2MDA0NDcwMSwiZXhwIjoxNzYwNjQ5NTAxfQ.18-0fdYM2E5Y6bFWzhh8fva2MJbr2u8NonRlUXMCCyc';
    return this.http.put(url, payload);
  }
}
