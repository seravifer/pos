import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<ICategory[]>(`${environment.apiUrl}/categories`);
  }

  getAllProducts() {
    return this.http.get<ICategory[]>(`${environment.apiUrl}/categories/products`);
  }

  createCategory(product: ICategory) {
    return this.http.post<ICategory>(`${environment.apiUrl}/categories`, product);
  }

  getCategory(id: string) {
    return this.http.get<ICategory>(`${environment.apiUrl}/categories/${id}`);
  }

  updateCategory(product: ICategory) {
    return this.http.put<ICategory>(`${environment.apiUrl}/categories/${product.id}`, product);
  }

  deleteCategory(product: ICategory) {
    return this.http.delete(`${environment.apiUrl}/categories/${product.id}`);
  }
}
