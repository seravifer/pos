import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryWithProducts, Product } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getOnlyProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getAllProducts() {
    return this.http.get<CategoryWithProducts[]>(
      `${environment.apiUrl}/products/all`
    );
  }

  createProduct(product: Product) {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  updateProduct(product: Product) {
    return this.http.put<Product>(
      `${environment.apiUrl}/products/${product.id}`,
      product
    );
  }

  deleteProduct(product: Product) {
    return this.http.delete(`${environment.apiUrl}/products/${product.id}`);
  }
}
