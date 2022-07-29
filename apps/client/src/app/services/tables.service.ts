import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  constructor(private http: HttpClient) {}

  getTables() {
    return this.http.get<Table[]>(`${environment.apiUrl}/tables`);
  }

  createTable(product: Table) {
    return this.http.post<Table>(`${environment.apiUrl}/tables`, product);
  }

  getTable(id: string) {
    return this.http.get<Table>(`${environment.apiUrl}/tables/${id}`);
  }

  updateTable(product: Table) {
    return this.http.put<Table>(
      `${environment.apiUrl}/tables/${product.id}`,
      product
    );
  }

  deleteTable(product: Table) {
    return this.http.delete(`${environment.apiUrl}/tables/${product.id}`);
  }
}
