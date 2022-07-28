import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  createCategory(product: Category) {
    return this.http.post<Category>(
      `${environment.apiUrl}/categories`,
      product
    );
  }

  getCategory(id: string) {
    return this.http.get<Category>(`${environment.apiUrl}/categories/${id}`);
  }

  updateCategory(product: Category) {
    return this.http.put<Category>(
      `${environment.apiUrl}/categories/${product.id}`,
      product
    );
  }

  deleteCategory(product: Category) {
    return this.http.delete(`${environment.apiUrl}/categories/${product.id}`);
  }
}
