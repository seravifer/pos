import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Table } from '@pos/models';
import { environment } from '@pos/client/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  constructor(private http: HttpClient) {}

  getTables() {
    return this.http
      .get<Table[]>(`${environment.apiUrl}/tables`)
      .pipe(map((tables) => tables.map((item) => this.parseTable(item))));
  }

  createOrUpdateTables(item: Table[]) {
    const data = item.map((item) => this.stringifyTable(item));
    return this.http.post<Table>(`${environment.apiUrl}/tables/_bulk`, data);
  }

  deleteTables(ids: string[]) {
    return this.http.delete(`${environment.apiUrl}/tables/_bulk`, {
      body: ids,
    });
  }

  getTable(id: string) {
    return this.http
      .get<Table>(`${environment.apiUrl}/tables/${id}`)
      .pipe(map((item) => this.parseTable(item)));
  }

  updateTable(item: Table) {
    return this.http.put<Table>(
      `${environment.apiUrl}/tables/${item.id}`,
      this.stringifyTable(item)
    );
  }

  deleteTable(item: Table | string) {
    return this.http.delete(
      `${environment.apiUrl}/tables/${
        typeof item === 'string' ? item : item.id
      }`
    );
  }

  parseTable(item: Table) {
    const { options, ...data } = item;
    return {
      ...data,
      options: JSON.parse(options ?? '{}'),
    };
  }

  stringifyTable(item: Partial<Table>) {
    const { options, ...data } = item;
    return {
      ...data,
      options: JSON.stringify(options ?? {}),
    };
  }
}
