import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '@pos/models';
import { environment } from '@pos/client/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private http: HttpClient) {}

  getItems() {
    return this.http
      .get<Item[]>(`${environment.apiUrl}/items`)
      .pipe(map((items) => items.map((item) => this.parseItem(item))));
  }

  createOrUpdateItems(item: Item[]) {
    const data = item.map((item) => this.stringifyItem(item));
    return this.http.post<Item>(`${environment.apiUrl}/items/_bulk`, data);
  }

  deleteItems(ids: string[]) {
    return this.http.delete(`${environment.apiUrl}/items/_bulk`, {
      body: ids,
    });
  }

  getItem(id: string) {
    return this.http
      .get<Item>(`${environment.apiUrl}/items/${id}`)
      .pipe(map((item) => this.parseItem(item)));
  }

  updateItem(item: Item) {
    return this.http.put<Item>(
      `${environment.apiUrl}/items/${item.id}`,
      this.stringifyItem(item)
    );
  }

  deleteItem(item: Item | string) {
    return this.http.delete(
      `${environment.apiUrl}/items/${typeof item === 'string' ? item : item.id}`
    );
  }

  parseItem(item: Item) {
    const { options, ...data } = item;
    return {
      ...data,
      options: JSON.parse(options ?? '{}'),
    };
  }

  stringifyItem(item: Partial<Item>) {
    const { options, ...data } = item;
    return {
      ...data,
      options: JSON.stringify(options ?? {}),
    };
  }
}
