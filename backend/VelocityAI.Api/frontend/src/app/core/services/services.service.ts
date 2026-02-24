import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { Service } from '../models/service.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly apiUrl = 'http://localhost:5001/api/services';
  private servicesCache = signal<Service[] | null>(null);

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    const cached = this.servicesCache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<ApiResponse<Service[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(services => this.servicesCache.set(services)),
      catchError(error => {
        console.error('Error fetching services:', error);
        throw error;
      })
    );
  }

  clearCache(): void {
    this.servicesCache.set(null);
  }
}
