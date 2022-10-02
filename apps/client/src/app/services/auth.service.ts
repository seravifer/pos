import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@pos/client/environment';
import { ILogin, ILoginUser } from '@pos/models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = !environment.production ? localStorage.getItem('token') : null;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getUsers() {
    return this.httpClient.get<ILoginUser[]>(`${environment.apiUrl}/auth/users`);
  }

  login(id: string, pin: string): Observable<ILogin> {
    return this.httpClient.post<ILogin>(`${environment.apiUrl}/auth`, { id, pin }).pipe(
      tap((login) => {
        this.token = login.token;
        if (!environment.production) {
          localStorage.setItem('token', this.token);
        }
      })
    );
  }

  logout() {
    this.token = null;
    if (!environment.production) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/onboarding']);
  }

  getToken() {
    return this.token;
  }
}
