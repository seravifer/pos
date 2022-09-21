import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID, INewProduct, IProduct } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  getOnlyProducts() {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`);
  }

  getProduct(id: string) {
    return this.http.get<IProduct>(`${environment.apiUrl}/products/${id}`);
  }
  createProduct(product: INewProduct) {
    return this.http.post<IProduct>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(product: INewProduct) {
    return this.http.put<IProduct>(`${environment.apiUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${environment.apiUrl}/products/${id}`);
  }
}
