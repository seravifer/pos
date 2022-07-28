import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  constructor(private http: HttpClient) {}

  getTables() {
    return this.http.get<Category[]>(`${environment.apiUrl}/tables`);
  }

  createCategory(product: Category) {
    return this.http.post<Category>(`${environment.apiUrl}/tables`, product);
  }

  getCategory(id: string) {
    return this.http.get<Category>(`${environment.apiUrl}/tables/${id}`);
  }

  updateCategory(product: Category) {
    return this.http.put<Category>(
      `${environment.apiUrl}/tables/${product.id}`,
      product
    );
  }

  deleteCategory(product: Category) {
    return this.http.delete(`${environment.apiUrl}/tables/${product.id}`);
  }
}
