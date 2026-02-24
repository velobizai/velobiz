# API Contract — FAQ Page

**Feature ID:** FEATURE-5
**API Version:** v1
**Base URL (Development):** `https://localhost:5001/api`
**Base URL (Production):** `https://velocityai-api.railway.app/api`

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/faqs` | Retrieve all active FAQs | No |

---

## GET /api/faqs

Retrieves all active FAQs ordered by display order. Used by the FAQ Page to dynamically render accordion items.

### Request

**HTTP Method:** GET

**URL:** `/api/faqs`

**Headers:**
```http
Accept: application/json
```

**Query Parameters:** None

**Request Body:** None

**Authentication:** None required (public endpoint)

### Response (Success)

**HTTP Status:** 200 OK

**Headers:**
```http
Content-Type: application/json; charset=utf-8
```

**Response Body:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "How long does it take to deploy an AI agent?",
      "answer": "Most single-agent deployments take 2–4 weeks from kickoff to go-live. More complex multi-agent systems typically take 6–8 weeks. We always start with a human-in-the-loop phase before granting full autonomy.",
      "displayOrder": 1,
      "isActive": true
    },
    {
      "id": 2,
      "question": "Will the AI sound robotic to my customers?",
      "answer": "No. We use the latest NLP and voice synthesis to create conversational, brand-aligned agents. We customise the tone, vocabulary, and personality to match your brand.",
      "displayOrder": 2,
      "isActive": true
    },
    {
      "id": 3,
      "question": "What happens if the AI can't handle a question?",
      "answer": "Every agent has intelligent escalation built in. If the AI detects confusion, repeated questions, or negative sentiment, it seamlessly transfers to a human agent with full context so the customer never has to repeat themselves.",
      "displayOrder": 3,
      "isActive": true
    },
    {
      "id": 4,
      "question": "Is my data secure?",
      "answer": "Yes. We follow industry-standard practices including encryption at rest and in transit, SOC 2 compliance readiness, and strict access controls. Enterprise clients can opt for on-premises deployment.",
      "displayOrder": 4,
      "isActive": true
    },
    {
      "id": 5,
      "question": "Can I start with one agent and add more later?",
      "answer": "Absolutely — that's what we recommend. Start with the highest-impact use case, prove the ROI, then expand. Every agent plugs into the same shared CRM, analytics, and compliance infrastructure.",
      "displayOrder": 5,
      "isActive": true
    },
    {
      "id": 6,
      "question": "Do you integrate with my existing CRM and tools?",
      "answer": "Yes — Salesforce, HubSpot, Zoho, Twilio, SendGrid, Slack, Google Workspace, Microsoft 365, and more. For custom systems, we build tailored API integrations.",
      "displayOrder": 6,
      "isActive": true
    }
  ],
  "message": "FAQs retrieved successfully"
}
```

**Response Schema:**

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: string[];
}

interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}
```

### Response (Error)

**HTTP Status:** 500 Internal Server Error

**Headers:**
```http
Content-Type: application/json; charset=utf-8
```

**Response Body:**

```json
{
  "success": false,
  "data": null,
  "message": "An error occurred while retrieving FAQs. Please try again later.",
  "errors": [
    "Database connection failed"
  ]
}
```

**Common Error Scenarios:**

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Database connection failure | 500 | "An error occurred while retrieving FAQs. Please try again later." |
| EF Core query timeout | 500 | "An error occurred while retrieving FAQs. Please try again later." |
| No FAQs found (all inactive) | 200 | "FAQs retrieved successfully" (data array is empty) |

---

## Backend Implementation

### Controller

**File:** `backend/VelocityAI.Api/Controllers/FaqsController.cs` (ALREADY EXISTS — needs implementation)

**Current Status:** Returns 501 with stub message

**Required Implementation:**

```csharp
using Microsoft.AspNetCore.Mvc;
using VelocityAI.Api.DTOs;
using VelocityAI.Api.Models;
using VelocityAI.Api.Services;

namespace VelocityAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FaqsController : ControllerBase
{
    private readonly IFaqService _service;
    private readonly ILogger<FaqsController> _logger;

    public FaqsController(IFaqService service, ILogger<FaqsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all active FAQs ordered by display order
    /// </summary>
    /// <returns>List of active FAQs</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Faq>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Faq>>>> GetAll()
    {
        try
        {
            var faqs = await _service.GetAllActiveFaqsAsync();
            return Ok(ApiResponse<IEnumerable<Faq>>.SuccessResponse(faqs, "FAQs retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving FAQs");
            return StatusCode(500, ApiResponse<IEnumerable<Faq>>.ErrorResponse(
                "An error occurred while retrieving FAQs. Please try again later.",
                new[] { ex.Message }
            ));
        }
    }
}
```

### Service Layer

**Interface:** `backend/VelocityAI.Api/Services/IFaqService.cs` (ALREADY EXISTS)

```csharp
using VelocityAI.Api.Models;

namespace VelocityAI.Api.Services;

public interface IFaqService
{
    Task<IEnumerable<Faq>> GetAllActiveFaqsAsync();
}
```

**Implementation:** `backend/VelocityAI.Api/Services/FaqService.cs` (ALREADY EXISTS — needs implementation)

**Current Status:** Throws NotImplementedException

**Required Implementation:**

```csharp
using VelocityAI.Api.Models;
using VelocityAI.Api.Repositories;

namespace VelocityAI.Api.Services;

public class FaqService : IFaqService
{
    private readonly IFaqRepository _repository;

    public FaqService(IFaqRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Faq>> GetAllActiveFaqsAsync()
    {
        return await _repository.GetAllActiveAsync();
    }
}
```

### Repository Layer

**Interface:** `backend/VelocityAI.Api/Repositories/IFaqRepository.cs` (ALREADY EXISTS)

```csharp
using VelocityAI.Api.Models;

namespace VelocityAI.Api.Repositories;

public interface IFaqRepository
{
    Task<Faq?> GetByIdAsync(int id);
    Task<IEnumerable<Faq>> GetAllActiveAsync();
    Task<Faq> AddAsync(Faq faq);
    Task UpdateAsync(Faq faq);
    Task DeleteAsync(int id);
}
```

**Implementation:** `backend/VelocityAI.Api/Repositories/FaqRepository.cs` (ALREADY EXISTS — needs implementation)

**Current Status:** All methods throw NotImplementedException

**Required Implementation (GetAllActiveAsync only):**

```csharp
using VelocityAI.Api.Data;
using VelocityAI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace VelocityAI.Api.Repositories;

public class FaqRepository : IFaqRepository
{
    private readonly ApplicationDbContext _context;

    public FaqRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Faq>> GetAllActiveAsync()
    {
        return await _context.Faqs
            .Where(f => f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();
    }

    // Other methods remain unimplemented (not needed for this feature)
    public Task<Faq?> GetByIdAsync(int id)
    {
        throw new NotImplementedException("Will be implemented in future admin panel feature");
    }

    public Task<Faq> AddAsync(Faq faq)
    {
        throw new NotImplementedException("Will be implemented in future admin panel feature");
    }

    public Task UpdateAsync(Faq faq)
    {
        throw new NotImplementedException("Will be implemented in future admin panel feature");
    }

    public Task DeleteAsync(int id)
    {
        throw new NotImplementedException("Will be implemented in future admin panel feature");
    }
}
```

### Dependency Injection Registration

**File:** `backend/VelocityAI.Api/Program.cs` (ALREADY REGISTERED)

```csharp
// Already registered in Program.cs:
builder.Services.AddScoped<IFaqRepository, FaqRepository>();
builder.Services.AddScoped<IFaqService, FaqService>();
```

**No changes needed** — DI registration is already complete.

---

## Frontend Implementation

### Angular Service

**File:** `frontend/src/app/core/services/faq.service.ts` (NEW FILE)

```typescript
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
    // Return cached data if available
    const cached = this.faqsCache();
    if (cached) {
      return of(cached);
    }

    // Fetch from API and cache
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
```

### TypeScript Model

**File:** `frontend/src/app/core/models/faq.model.ts` (NEW FILE)

```typescript
export interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
}
```

---

## CORS Configuration

**Backend (Program.cs):** (ALREADY CONFIGURED)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:4200"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// ...

app.UseCors("AllowFrontend");
```

**No changes needed** — CORS is already configured for all `/api/*` endpoints.

---

## Error Handling

### Backend Error Scenarios

| Error Type | HTTP Status | Message | Logged? |
|------------|-------------|---------|---------|
| Database connection failure | 500 | "An error occurred while retrieving FAQs..." | Yes (Error) |
| EF Core query timeout | 500 | "An error occurred while retrieving FAQs..." | Yes (Error) |
| Null reference exception | 500 | "An error occurred while retrieving FAQs..." | Yes (Error) |
| No FAQs found | 200 | "FAQs retrieved successfully" (empty array) | No |

### Frontend Error Handling

```typescript
// In FaqPageComponent
loadFaqs(): void {
  this.loading.set(true);
  this.error.set(null);

  this.faqService.getFaqs().subscribe({
    next: (faqs) => {
      this.faqs.set(faqs);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set(
        'Failed to load FAQs. Please check your connection and try again.'
      );
      this.loading.set(false);
      console.error('FAQ fetch error:', err);
    }
  });
}
```

---

## Performance Considerations

### Backend Optimizations

1. **AsNoTracking():** EF Core query uses `AsNoTracking()` since data is read-only
2. **Indexed columns:** DisplayOrder and IsActive should have database indexes (already configured in Feature 0)
3. **Response caching:** Consider adding response caching middleware (future enhancement)

**Existing index (from Feature 0):**

```sql
KEY `IX_Faqs_IsActive_DisplayOrder` (`IsActive`, `DisplayOrder`)
```

### Frontend Optimizations

1. **Signal-based caching:** FAQs fetched once per session, stored in signal
2. **Lazy-loaded route:** FAQ page route is lazy-loaded (if not already done)
3. **OnPush change detection:** FaqPageComponent uses OnPush strategy
4. **HTTP interceptor caching:** Consider adding HTTP cache interceptor (future enhancement)

---

## Testing

### Backend API Tests (Deferred per user instruction)

**Integration Test (xUnit + WebApplicationFactory):**

```csharp
[Fact]
public async Task GetFaqs_ReturnsOkWithFaqs()
{
    // Arrange
    var client = _factory.CreateClient();

    // Act
    var response = await client.GetAsync("/api/faqs");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var content = await response.Content.ReadAsStringAsync();
    var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Faq>>>(content);

    apiResponse.Should().NotBeNull();
    apiResponse!.Success.Should().BeTrue();
    apiResponse.Data.Should().NotBeNull();
    apiResponse.Data.Should().HaveCount(6);
    apiResponse.Data![0].DisplayOrder.Should().BeLessThanOrEqualTo(apiResponse.Data[1].DisplayOrder);
}
```

### Frontend Service Tests (Deferred per user instruction)

**Unit Test (Jasmine + HttpClientTestingModule):**

```typescript
it('should fetch FAQs from API', (done) => {
  const mockFaqs: Faq[] = [
    { id: 1, question: 'Test Question', answer: 'Test Answer', displayOrder: 1, isActive: true }
  ];

  const mockResponse: ApiResponse<Faq[]> = {
    success: true,
    data: mockFaqs,
    message: 'Success'
  };

  service.getFaqs().subscribe(faqs => {
    expect(faqs).toEqual(mockFaqs);
    done();
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/faqs`);
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});
```

---

## API Documentation (Swagger)

**Swagger UI URL (Development):** https://localhost:5001/swagger

**Endpoint appears as:**

```
GET /api/faqs
Get all active FAQs ordered by display order

Responses:
  200 - Success (ApiResponse<IEnumerable<Faq>>)
  500 - Internal Server Error (ApiResponse<IEnumerable<Faq>>)
```

**Swagger Configuration:** (ALREADY CONFIGURED in Program.cs)

---

## Security Considerations

1. **No authentication required:** Public endpoint, no sensitive data exposed
2. **CORS restrictions:** Production API only accessible from Vercel domain
3. **Rate limiting:** Consider adding rate limiting middleware (future enhancement)
4. **SQL injection:** Protected by EF Core parameterized queries
5. **XSS protection:** Angular sanitizes HTML by default

---

## Monitoring and Logging

### Backend Logging

```csharp
_logger.LogInformation("Fetching all active FAQs");
_logger.LogError(ex, "Error retrieving FAQs from database");
```

### Frontend Error Tracking

```typescript
console.error('FAQ fetch error:', err);
// Future: Send to error tracking service (Sentry, LogRocket, etc.)
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-20 | Initial API contract for Feature 5 |
```

---