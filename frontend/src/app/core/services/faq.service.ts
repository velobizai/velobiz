import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Faq } from '../models/faq.model';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly apiUrl = `${environment.apiUrl}/faqs`;
  private faqsCache = signal<Faq[] | null>(null);

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    const cached = this.faqsCache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<ApiResponse<Faq[]>>(this.apiUrl).pipe(
      map(response => response.data || []),
      tap(faqs => this.faqsCache.set(faqs)),
      catchError(error => {
        console.error('Error fetching FAQs:', error);
        return throwError(() => new Error('Failed to load FAQs'));
      })
    );
  }

  clearCache(): void {
    this.faqsCache.set(null);
  }
}
