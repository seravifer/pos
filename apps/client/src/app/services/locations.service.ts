import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILocation } from '@pos/models';
import { environment } from '@pos/client/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  constructor(private http: HttpClient) {}

  getLocations() {
    return this.http
      .get<ILocation[]>(`${environment.apiUrl}/locations`)
      .pipe(
        map((locations) => locations.sort((a, b) => a.position - b.position))
      );
  }

  createLocation(product: Partial<ILocation>) {
    return this.http.post<ILocation>(
      `${environment.apiUrl}/locations`,
      product
    );
  }

  getLocation(id: string) {
    return this.http.get<ILocation>(`${environment.apiUrl}/locations/${id}`);
  }

  updateLocation(product: Partial<ILocation>) {
    return this.http.put<ILocation>(
      `${environment.apiUrl}/locations/${product.id}`,
      product
    );
  }

  deleteLocation(id: string) {
    return this.http.delete(`${environment.apiUrl}/locations/${id}`);
  }
}
