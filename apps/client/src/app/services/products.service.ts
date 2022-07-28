import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
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
