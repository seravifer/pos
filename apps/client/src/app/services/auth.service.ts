import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  authenticate(id: string, pin: string) {
    return this.httpClient.post('/api/auth', { id, pin });
  }
}
