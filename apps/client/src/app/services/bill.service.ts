import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill, BillWithProducts, BProduct } from '@pos/models';
import { environment } from '@pos/client/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private http: HttpClient) {}

  getBills() {
    return this.http
      .get<BillWithProducts[]>(`${environment.apiUrl}/bills`)
      .pipe(
        map((bills: BillWithProducts[]) => {
          return bills.map((bill: BillWithProducts) => {
            return {
              ...bill,
              products: bill.products.map((product: any) => {
                return {
                  ...product,
                  name: product.product.name,
                };
              }),
            };
          });
        })
      );
  }

  createBill(bill: Bill) {
    return this.http.post<Bill>(`${environment.apiUrl}/bills`, bill);
  }

  getBill(id: string) {
    return this.http.get<BillWithProducts>(`${environment.apiUrl}/bills/${id}`);
  }

  updateBill(bill: BillWithProducts) {
    return this.http.put<BillWithProducts>(
      `${environment.apiUrl}/bills/${bill.id}`,
      bill
    );
  }

  deleteBill(bill: BillWithProducts) {
    return this.http.delete(`${environment.apiUrl}/bills/${bill.id}`);
  }

  getBillProducts(id: string) {
    return this.http.get<BProduct[]>(
      `${environment.apiUrl}/bills/${id}/products`
    );
  }

  updateBillProduct(id: string, product: BProduct) {
    return this.http.post<Bill>(
      `${environment.apiUrl}/bills/${id}/products`,
      product
    );
  }

  deleteBillProduct(id: string, product: BProduct) {
    return this.http.delete(
      `${environment.apiUrl}/bills/${id}/products/${product.id}`
    );
  }
}
