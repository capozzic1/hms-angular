import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Add authentication logic here
  constructor() {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
