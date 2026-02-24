import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ✅ Positive scenario: GET request returns unwrapped data
  describe('GET request', () => {
    it('should unwrap ApiResponse and return data on successful GET', (done) => {
      const mockData = { id: 1, name: 'Test' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: mockData,
        message: 'Success'
      };

      service.get<any>('/test').subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          done();
        },
        error: () => fail('Expected success, but got error')
      });

      const req = httpMock.expectOne(`${baseUrl}/test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    // ❌ Negative scenario: GET request handles API error
    it('should handle API error response on GET', (done) => {
      const mockResponse: ApiResponse<any> = {
        success: false,
        data: null,
        message: 'Resource not found'
      };

      service.get<any>('/test').subscribe({
        next: () => fail('Expected error, but got success'),
        error: (error) => {
          expect(error.message).toContain('Resource not found');
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test`);
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
    });

    // 🚫 Edge case: GET request handles network error
    it('should handle network error on GET', (done) => {
      service.get<any>('/test').subscribe({
        next: () => fail('Expected error, but got success'),
        error: (error) => {
          expect(error.message).toContain('Server error');
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test`);
      req.error(new ProgressEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });
    });
  });

  // ✅ Positive scenario: POST request returns unwrapped data
  describe('POST request', () => {
    it('should unwrap ApiResponse and return data on successful POST', (done) => {
      const mockData = { id: 1, name: 'Created' };
      const requestBody = { name: 'Test' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: mockData
      };

      service.post<any>('/test', requestBody).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          done();
        },
        error: () => fail('Expected success, but got error')
      });

      const req = httpMock.expectOne(`${baseUrl}/test`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(requestBody);
      req.flush(mockResponse);
    });

    // ❌ Negative scenario: POST request handles validation error
    it('should handle validation error on POST', (done) => {
      const mockResponse: ApiResponse<any> = {
        success: false,
        data: null,
        errors: ['Name is required', 'Email is invalid']
      };

      service.post<any>('/test', {}).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (error) => {
          expect(error.message).toContain('Name is required');
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/test`);
      req.flush(mockResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  // ✅ Positive scenario: PUT request returns unwrapped data
  describe('PUT request', () => {
    it('should unwrap ApiResponse and return data on successful PUT', (done) => {
      const mockData = { id: 1, name: 'Updated' };
      const requestBody = { name: 'Updated' };
      const mockResponse: ApiResponse<any> = {
        success: true,
        data: mockData
      };

      service.put<any>('/test/1', requestBody).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          done();
        },
        error: () => fail('Expected success, but got error')
      });

      const req = httpMock.expectOne(`${baseUrl}/test/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(requestBody);
      req.flush(mockResponse);
    });
  });

  // ✅ Positive scenario: DELETE request returns unwrapped data
  describe('DELETE request', () => {
    it('should unwrap ApiResponse and return data on successful DELETE', (done) => {
      const mockResponse: ApiResponse<boolean> = {
        success: true,
        data: true,
        message: 'Deleted successfully'
      };

      service.delete<boolean>('/test/1').subscribe({
        next: (data) => {
          expect(data).toBe(true);
          done();
        },
        error: () => fail('Expected success, but got error')
      });

      const req = httpMock.expectOne(`${baseUrl}/test/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    // 🚫 Edge case: DELETE request with empty endpoint
    it('should handle DELETE request with empty endpoint gracefully', (done) => {
      const mockResponse: ApiResponse<boolean> = {
        success: true,
        data: true
      };

      service.delete<boolean>('').subscribe({
        next: (data) => {
          expect(data).toBe(true);
          done();
        },
        error: () => fail('Expected success, but got error')
      });

      const req = httpMock.expectOne(`${baseUrl}`);
      req.flush(mockResponse);
    });
  });
});
