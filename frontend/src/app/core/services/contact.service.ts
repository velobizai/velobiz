import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ContactRequest, Contact } from '../models/contact-request.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `/api/contact`;

  constructor(private http: HttpClient) {}

  submit(request: ContactRequest): Observable<Contact> {
    return this.http.post<ApiResponse<Contact>>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }
}
