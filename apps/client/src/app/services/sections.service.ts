import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@pos/client/environment';
import { ISection } from '@pos/models';

@Injectable({ providedIn: 'root' })
export class SectionsService {
  constructor(private http: HttpClient) {}

  getSections() {
    return this.http.get<ISection[]>(`${environment.apiUrl}/sections`);
  }

  createSection(section: Partial<ISection>) {
    return this.http.post<ISection>(`${environment.apiUrl}/sections`, section);
  }

  getSection(id: string) {
    return this.http.get<ISection>(`${environment.apiUrl}/sections/${id}`);
  }

  updateSection(section: Partial<ISection>) {
    return this.http.put<ISection>(`${environment.apiUrl}/sections/${section.id}`, section);
  }

  deleteSection(id: string) {
    return this.http.delete(`${environment.apiUrl}/sections/${id}`);
  }
}
