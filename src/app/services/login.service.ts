import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginCredentials } from '../interfaces/login-credentials';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor() {}
  httpClient = inject(HttpClient);
  router = inject(Router);
  toastrService = inject(ToastrService);

  API_URL = 'https://equipo-25.onrender.com/login';

  login(userCredentials: LoginCredentials) {
    return this.httpClient.post(this.API_URL, userCredentials);
  }

  isLoged(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = this.decodeToken(token);
      if (decodedToken && decodedToken.exp) {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        if (decodedToken.exp > currentTime) {
          return true;
        } else {
          this.logout();
          return false;
        }
      }
    }
    return false;
  }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.toastrService.info('Sesión cerrada');
    this.router.navigate(['/']);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
