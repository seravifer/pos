import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBill, IBillItem, INewBill, INewBillProduct } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private http: HttpClient) {}

  getBills() {
    return this.http.get<IBill[]>(`${environment.apiUrl}/bills`);
  }

  getBill(id: string) {
    return this.http.get<IBill>(`${environment.apiUrl}/bills/${id}`);
  }

  createBill(bill: INewBill | Partial<INewBill>) {
    return this.http.post<IBill>(`${environment.apiUrl}/bills`, bill);
  }

  updateBill(bill: INewBill) {
    return this.http.put<IBill>(`${environment.apiUrl}/bills/${bill.id}`, bill);
  }

  deleteBill(id: string) {
    return this.http.delete(`${environment.apiUrl}/bills/${id}`);
  }

  // Bill Items
  getBillItems(id: string) {
    return this.http.get<IBillItem[]>(`${environment.apiUrl}/bills/${id}/items`);
  }

  updateBillItem(id: string, product: INewBillProduct | IBillItem) {
    return this.http.post<IBill>(`${environment.apiUrl}/bills/${id}/items`, product);
  }

  deleteBillItem(id: string, product: IBillItem) {
    return this.http.delete(`${environment.apiUrl}/bills/${id}/items/${product.id}`);
  }
}
