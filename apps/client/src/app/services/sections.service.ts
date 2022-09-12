import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@pos/client/environment';
import { SectionWithProducts } from '@pos/models';

@Injectable({ providedIn: 'root' })
export class SectionsService {
  constructor(private http: HttpClient) {}

  getSections() {
    return this.http.get<SectionWithProducts[]>(
      `${environment.apiUrl}/sections`
    );
  }

  createSection(section: Partial<SectionWithProducts>) {
    return this.http.post<SectionWithProducts>(
      `${environment.apiUrl}/sections`,
      section
    );
  }

  getSection(id: string) {
    return this.http.get<SectionWithProducts>(
      `${environment.apiUrl}/sections/${id}`
    );
  }

  updateSection(section: Partial<SectionWithProducts>) {
    return this.http.put<SectionWithProducts>(
      `${environment.apiUrl}/sections/${section.id}`,
      section
    );
  }

  deleteSection(id: string) {
    return this.http.delete(`${environment.apiUrl}/sections/${id}`);
  }
}
