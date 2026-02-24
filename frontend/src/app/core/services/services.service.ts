import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly apiUrl = `${environment.apiUrl}/services`;
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
        return throwError(() => new Error('Failed to load services'));
      })
    );
  }

  clearCache(): void {
    this.servicesCache.set(null);
  }
}
