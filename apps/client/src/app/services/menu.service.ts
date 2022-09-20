import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@pos/client/environment';
import { ID, IMenu, INewMenu } from '@pos/models';

@Injectable({ providedIn: 'root' })
export class MenusService {
  constructor(private http: HttpClient) {}

  getMenus(params?: { isActive?: boolean }) {
    params = params ? params : {};
    return this.http.get<IMenu[]>(`${environment.apiUrl}/menus`, {
      params,
    });
  }

  getMenu(id: string) {
    return this.http.get<IMenu>(`${environment.apiUrl}/menus/${id}`);
  }

  createMenu(menu: INewMenu) {
    return this.http.post<IMenu>(`${environment.apiUrl}/menus`, menu);
  }

  updateMenu(menu: INewMenu & ID) {
    return this.http.put<IMenu>(`${environment.apiUrl}/menus/${menu.id}`, menu);
  }

  deleteMenu(id: string) {
    return this.http.delete(`${environment.apiUrl}/menus/${id}`);
  }
}
