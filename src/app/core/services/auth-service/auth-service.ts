import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080';
  // signal to represent login state for template bindings
  isLoggedIn = signal<boolean>(typeof window !== 'undefined' && !!localStorage.getItem('token'));
  // signal to hold the user's role (extracted from JWT)
  userRole = signal<string | null>(null);

  constructor() {
    this.initFromStorage();
  }

  // initialize userRole from existing token (if present)
  private initFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        const role = this.extractRoleFromToken(token);
        if (role) this.userRole.set(role);
      }
    }
  }

  // POST { username, password } to /admin/login, store token in localStorage
  loginAdmin(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post<{ token?: string; accessToken?: string }>(`${this.baseUrl}/admin/login`, body)
      .pipe(
        tap(res => {
          const token = res?.token ?? res?.accessToken;
          if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            this.isLoggedIn.set(true);
            const role = this.extractRoleFromToken(token);
            this.userRole.set(role);
          }
        })
      );
  }

  // POST { email, password } to /doctor/login, store token in localStorage
  loginDoctor(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<{ token?: string; accessToken?: string }>(`${this.baseUrl}/doctor/login`, body)
      .pipe(
        tap(res => {
          const token = res?.token ?? res?.accessToken;
          if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            this.isLoggedIn.set(true);
            const role = this.extractRoleFromToken(token);
            this.userRole.set(role);
          }
        })
      );
  }

  // POST { email, password } to /patient/login, store token in localStorage
  loginPatient(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<{ token?: string; accessToken?: string }>(`${this.baseUrl}/patient/login`, body)
      .pipe(
        tap(res => {
          const token = res?.token ?? res?.accessToken;
          if (token && typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            this.isLoggedIn.set(true);
            const role = this.extractRoleFromToken(token);
            this.userRole.set(role);
          }
        })
      );
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  // return the current user role
  getUserRole(): string | null {
    return this.userRole();
  }

  // helper to check if the user is a doctor (normalizes ROLE_ prefixes)
  isDoctor(): boolean {
    const r = this.userRole();
    if (!r) return false;
    return String(r).toLowerCase().includes('doctor');
  }

  // extract a role claim from a JWT token payload
  private extractRoleFromToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      // common claim names
      if (payload.role && typeof payload.role === 'string') return payload.role;
      if (Array.isArray(payload.roles) && payload.roles.length) return String(payload.roles[0]);
      if (Array.isArray(payload.authorities) && payload.authorities.length) return String(payload.authorities[0]);
      if (payload.authority && typeof payload.authority === 'string') return payload.authority;
      // fallback: subject or scope
      if (payload.sub && typeof payload.sub === 'string') return payload.sub;
    } catch (e) {
      // ignore parse errors
    }
    return null;
  }

  // logout locally (clear token) and optionally notify backend
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    // NOTE: optionally call backend logout endpoint here if available
    this.isLoggedIn.set(false);
    this.userRole.set(null);
  }

}
