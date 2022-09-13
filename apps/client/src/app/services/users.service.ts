import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  createUser(user: User) {
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  getUser(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateUser(user: User) {
    return this.http.put<User>(`${environment.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(user: User) {
    return this.http.delete(`${environment.apiUrl}/users/${user.id}`);
  }
}
