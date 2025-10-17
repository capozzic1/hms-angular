import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(route?: ActivatedRouteSnapshot): boolean | UrlTree {
    debugger;
    const token = this.auth.getToken();
    if (!token) {
      return this.router.parseUrl('/');
    }

    // decode JWT payload (naive base64 decode)
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return this.router.parseUrl('/');
      const payload = JSON.parse(atob(parts[1]));
      const role = payload?.role || payload?.roles || payload?.authorities || payload?.sub;

      // Determine allowed roles from route data, default to ['admin'] for backwards compatibility
      const allowed: string[] = (route && route.data && route.data['roles']) || ['admin'];

      const roleArray = Array.isArray(role) ? role : [role];

      for (const r of allowed) {
        if (roleArray.includes(r)) return true;
      }
    } catch (e) {
      // fallthrough to redirect
    }

    return this.router.parseUrl('/');
  }
}
