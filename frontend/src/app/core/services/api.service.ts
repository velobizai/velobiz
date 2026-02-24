import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET request that automatically unwraps ApiResponse<T>
   */
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<ApiResponse<T>>(url)
      .pipe(
        map(response => this.unwrapResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * POST request that automatically unwraps ApiResponse<T>
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(url, body)
      .pipe(
        map(response => this.unwrapResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * PUT request that automatically unwraps ApiResponse<T>
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(url, body)
      .pipe(
        map(response => this.unwrapResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * DELETE request that automatically unwraps ApiResponse<T>
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(url)
      .pipe(
        map(response => this.unwrapResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Unwraps ApiResponse<T> to T
   */
  private unwrapResponse<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'API request failed');
  }

  /**
   * Centralized error handling
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    // Handle errors thrown by unwrapResponse (when API returns success: false)
    if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
      errorMessage = error.message;
    } else if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Network error: ${error.error.message}`;
      } else {
        // Backend HTTP error
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors && Array.isArray(error.error.errors)) {
          errorMessage = error.error.errors.join(', ');
        } else {
          errorMessage = `Server error: ${error.status} ${error.statusText}`;
        }
      }
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
