import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
  }

  createUser(user: IUser) {
    return this.http.post<IUser>(`${environment.apiUrl}/users`, user);
  }

  getUser(id: string) {
    return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
  }

  updateUser(user: IUser) {
    return this.http.put<IUser>(`${environment.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(user: IUser) {
    return this.http.delete(`${environment.apiUrl}/users/${user.id}`);
  }
}
