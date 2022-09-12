import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@pos/models';
import { environment } from '@pos/client/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  constructor(private http: HttpClient) {}

  getLocations() {
    return this.http.get<Location[]>(`${environment.apiUrl}/locations`);
  }

  createLocation(product: Partial<Location>) {
    return this.http.post<Location>(`${environment.apiUrl}/locations`, product);
  }

  getLocation(id: string) {
    return this.http.get<Location>(`${environment.apiUrl}/locations/${id}`);
  }

  updateLocation(product: Location) {
    return this.http.put<Location>(
      `${environment.apiUrl}/locations/${product.id}`,
      product
    );
  }

  deleteLocation(product: Location) {
    return this.http.delete(`${environment.apiUrl}/locations/${product.id}`);
  }
}
