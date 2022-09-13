import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@pos/client/environment';
import { ID, Menu, MenuDto } from '@pos/models';

@Injectable({ providedIn: 'root' })
export class MenusService {
  constructor(private http: HttpClient) {}

  getMenus() {
    return this.http.get<Menu[]>(`${environment.apiUrl}/menus`);
  }

  getMenu(id: string) {
    return this.http.get<MenuDto & ID>(`${environment.apiUrl}/menus/${id}`);
  }

  createMenu(menu: MenuDto) {
    return this.http.post<Menu>(`${environment.apiUrl}/menus`, menu);
  }

  updateMenu(menu: MenuDto & ID) {
    return this.http.put<Menu>(`${environment.apiUrl}/menus/${menu.id}`, menu);
  }

  deleteMenu(id: string) {
    return this.http.delete(`${environment.apiUrl}/menus/${id}`);
  }
}
