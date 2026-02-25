# API Contract — Services Page

**Feature ID:** FEATURE-3
**API Version:** v1
**Base URL (Development):** `https://localhost:5001/api`
**Base URL (Production):** `https://velocityai-api.railway.app/api`

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/services` | Retrieve all active services | No |

---

## GET /api/services

Retrieves all active services ordered by display order. Used by the Services Page to dynamically render service cards.

### Request

**HTTP Method:** GET

**URL:** `/api/services`

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
      "title": "AI Voice Agent — Inbound Support",
      "icon": "phone",
      "shortDescription": "24/7 intelligent inbound call handling with sentiment detection and automatic human escalation.",
      "longDescription": "Full inbound call automation including sentiment detection to flag frustrated callers early, automatic escalation with context handoff to human agents, CRM logging, voicemail transcription, multi-language support, and daily performance summaries categorised by issue type, resolution rate, and escalation rate. GDPR/TCPA compliant with built-in consent layer.",
      "displayOrder": 1,
      "isActive": true
    },
    {
      "id": 2,
      "title": "AI Voice Agent — Outbound Collection",
      "icon": "signal",
      "shortDescription": "Automated outbound calls for information collection with full compliance built in.",
      "longDescription": "Outbound call automation for data collection and follow-ups. Includes mandatory AI disclosure, opt-out mechanism with permanent preference storage, timezone-aware call scheduling, configurable retry logic with attempt limits, and adaptive conversational branching to handle unexpected responses gracefully. Warm leads only recommended approach.",
      "displayOrder": 2,
      "isActive": true
    },
    {
      "id": 3,
      "title": "Email Management AI Agent",
      "icon": "mail",
      "shortDescription": "Intelligent email triage, classification, and response drafting with SLA tracking.",
      "longDescription": "Automated email management including triage and classification by category (support, billing, complaint, sales), draft-and-review mode before any auto-send, full thread awareness to avoid contradictions, attachment processing for invoices and documents, SLA breach alerting, and a prioritised daily brief with recommended actions and deadlines grouped by urgency.",
      "displayOrder": 3,
      "isActive": true
    },
    {
      "id": 4,
      "title": "Marketing Campaign AI Agent",
      "icon": "megaphone",
      "shortDescription": "End-to-end email marketing automation with segmentation, A/B testing, and drip sequences.",
      "longDescription": "Full email marketing automation covering audience segmentation and personalisation, A/B testing of subject lines and body copy with auto-optimisation on open and click rates, multi-touch drip sequences (welcome, nurture, re-engagement), deliverability monitoring, branded sender address management, frictionless in-email feedback collection, and full CAN-SPAM/GDPR compliance with automated unsubscribe handling.",
      "displayOrder": 4,
      "isActive": true
    },
    {
      "id": 5,
      "title": "Social Media Scheduling & Management",
      "icon": "share",
      "shortDescription": "AI-powered content drafting, scheduling, and tiered comment management across all platforms.",
      "longDescription": "Cross-platform content creation and scheduling automation with tiered comment handling — auto-reply to simple positive comments, draft responses for questions and complaints submitted for human approval. Includes real-time negative sentiment monitoring and crisis alerting, content performance analytics feeding back into content generation, and platform policy compliance checks before posting.",
      "displayOrder": 5,
      "isActive": true
    },
    {
      "id": 6,
      "title": "Paid Ads AI Agent",
      "icon": "target",
      "shortDescription": "AI-driven ad creative generation, budget optimisation, and cross-platform attribution.",
      "longDescription": "Full paid advertising automation covering ad copy and headline generation, audience targeting and lookalike audience building from existing customer data, automated budget reallocation toward better-performing ad sets, cross-platform attribution across Facebook, Google, and TikTok, and pre-submission compliance review against each platform's advertising policies.",
      "displayOrder": 6,
      "isActive": true
    },
    {
      "id": 7,
      "title": "GEO — Generative Engine Optimisation",
      "icon": "brain",
      "shortDescription": "Optimise your brand's visibility in AI-powered search engines like ChatGPT and Perplexity.",
      "longDescription": "Forward-looking brand optimisation for AI search surfaces including structured data and entity consistency audits, citation-worthy original content strategy, AI search mention monitoring across ChatGPT, Gemini, and Perplexity, and integration with traditional SEO fundamentals. GEO is additive to SEO — both are maintained in parallel.",
      "displayOrder": 7,
      "isActive": true
    },
    {
      "id": 8,
      "title": "SDLC AI Agent Suite",
      "icon": "code",
      "shortDescription": "A full team of specialised AI development agents to accelerate your software delivery pipeline.",
      "longDescription": "A coordinated suite of development sub-agents: Requirements Analyst (parses PRDs, generates acceptance criteria), Code Generator (implements features from specs), Code Reviewer (automated PR reviews and security scanning), Test Generator (unit, integration, and regression tests), Documentation Agent (maintains technical docs and changelogs), and DevOps Agent (monitors deployments, auto-rollback on failure). Humans remain in the loop for all production deployments.",
      "displayOrder": 8,
      "isActive": true
    }
  ],
  "message": "Services retrieved successfully"
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

interface Service {
  id: number;
  title: string;
  icon: string;               // Lucide icon name
  shortDescription: string;   // 1-2 sentences
  longDescription: string;    // Full paragraph
  displayOrder: number;       // Sort order (1-8)
  isActive: boolean;          // Soft delete flag
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
  "message": "An error occurred while retrieving services. Please try again later.",
  "errors": [
    "Database connection failed"
  ]
}
```

**Common Error Scenarios:**

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Database connection failure | 500 | "An error occurred while retrieving services. Please try again later." |
| EF Core query timeout | 500 | "An error occurred while retrieving services. Please try again later." |
| No services found (all inactive) | 200 | "Services retrieved successfully" (data array is empty) |

---

## Backend Implementation

### Controller

**File:** `backend/Velobiz.Api/Controllers/ServicesController.cs`

**Implementation:**

```csharp
using Microsoft.AspNetCore.Mvc;
using Velobiz.Api.DTOs;
using Velobiz.Api.Models;
using Velobiz.Api.Services;

namespace Velobiz.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ServicesController : ControllerBase
{
    private readonly IServicesService _service;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(IServicesService service, ILogger<ServicesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all active services ordered by display order
    /// </summary>
    /// <returns>List of active services</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Service>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<Service>>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ApiResponse<IEnumerable<Service>>>> GetAll()
    {
        try
        {
            var services = await _service.GetAllActiveServicesAsync();
            return Ok(ApiResponse<IEnumerable<Service>>.SuccessResponse(services, "Services retrieved successfully"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving services");
            return StatusCode(500, ApiResponse<IEnumerable<Service>>.ErrorResponse(
                "An error occurred while retrieving services. Please try again later.",
                new[] { ex.Message }
            ));
        }
    }
}
```

### Service Layer

**Interface:** `backend/Velobiz.Api/Services/IServicesService.cs`

```csharp
using Velobiz.Api.Models;

namespace Velobiz.Api.Services;

public interface IServicesService
{
    Task<IEnumerable<Service>> GetAllActiveServicesAsync();
}
```

**Implementation:** `backend/Velobiz.Api/Services/ServicesService.cs`

```csharp
using Velobiz.Api.Models;
using Velobiz.Api.Repositories;

namespace Velobiz.Api.Services;

public class ServicesService : IServicesService
{
    private readonly IServicesRepository _repository;

    public ServicesService(IServicesRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Service>> GetAllActiveServicesAsync()
    {
        return await _repository.GetAllActiveAsync();
    }
}
```

### Repository Layer

**Interface:** `backend/Velobiz.Api/Repositories/IServicesRepository.cs`

```csharp
using Velobiz.Api.Models;

namespace Velobiz.Api.Repositories;

public interface IServicesRepository
{
    Task<IEnumerable<Service>> GetAllActiveAsync();
}
```

**Implementation:** `backend/Velobiz.Api/Repositories/ServicesRepository.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Velobiz.Api.Data;
using Velobiz.Api.Models;

namespace Velobiz.Api.Repositories;

public class ServicesRepository : IServicesRepository
{
    private readonly ApplicationDbContext _context;

    public ServicesRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Service>> GetAllActiveAsync()
    {
        return await _context.Services
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .AsNoTracking()
            .ToListAsync();
    }
}
```

### Dependency Injection Registration

**File:** `backend/Velobiz.Api/Program.cs`

```csharp
// Register repository
builder.Services.AddScoped<IServicesRepository, ServicesRepository>();

// Register service
builder.Services.AddScoped<IServicesService, ServicesService>();
```

---

## Frontend Implementation

### Angular Service

**File:** `frontend/src/app/core/services/services.service.ts`

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service } from '../models/service.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly apiUrl = `${environment.apiUrl}/services`;
  private servicesCache = signal<Service[] | null>(null);

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    // Return cached data if available
    const cached = this.servicesCache();
    if (cached) {
      return of(cached);
    }

    // Fetch from API and cache
    return this.http.get<ApiResponse<Service[]>>(this.apiUrl).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.servicesCache.set(response.data);
        }
      }),
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
```

### TypeScript Model

**File:** `frontend/src/app/core/models/service.model.ts`

```typescript
export interface Service {
  id: number;
  title: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  isActive: boolean;
}
```

---

## CORS Configuration

**Backend (Program.cs):**

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

**Configuration (appsettings.json):**

```json
{
  "Cors": {
    "AllowedOrigins": "http://localhost:4200"
  }
}
```

**Configuration (appsettings.Production.json):**

```json
{
  "Cors": {
    "AllowedOrigins": "https://velocityai.vercel.app"
  }
}
```

---

## Error Handling

### Backend Error Scenarios

| Error Type | HTTP Status | Message | Logged? |
|------------|-------------|---------|---------|
| Database connection failure | 500 | "An error occurred while retrieving services..." | Yes (Error) |
| EF Core query timeout | 500 | "An error occurred while retrieving services..." | Yes (Error) |
| Null reference exception | 500 | "An error occurred while retrieving services..." | Yes (Error) |
| No services found | 200 | "Services retrieved successfully" (empty array) | No |

### Frontend Error Handling

```typescript
// In ServicesPageComponent
loadServices(): void {
  this.loading.set(true);
  this.error.set(null);

  this.servicesService.getServices().subscribe({
    next: (services) => {
      this.services.set(services);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set(
        'Failed to load services. Please check your connection and try again.'
      );
      this.loading.set(false);
      console.error('Services fetch error:', err);
    }
  });
}
```

---

## Performance Considerations

### Backend Optimizations

1. **AsNoTracking():** EF Core query uses `AsNoTracking()` since data is read-only
2. **Indexed columns:** DisplayOrder and IsActive should have database indexes
3. **Response caching:** Consider adding response caching middleware (future enhancement)

**Suggested index (migration):**

```csharp
modelBuilder.Entity<Service>()
    .HasIndex(s => new { s.IsActive, s.DisplayOrder });
```

### Frontend Optimizations

1. **Signal-based caching:** Services fetched once per session, stored in signal
2. **Lazy-loaded route:** Services page route is lazy-loaded to reduce initial bundle size
3. **OnPush change detection:** ServiceCardComponent uses OnPush strategy
4. **HTTP interceptor caching:** Consider adding HTTP cache interceptor (future enhancement)

---

## Testing

### Backend API Tests

**Integration Test (xUnit + WebApplicationFactory):**

```csharp
[Fact]
public async Task GetServices_ReturnsOkWithServices()
{
    // Arrange
    var client = _factory.CreateClient();

    // Act
    var response = await client.GetAsync("/api/services");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.OK);

    var content = await response.Content.ReadAsStringAsync();
    var apiResponse = JsonSerializer.Deserialize<ApiResponse<List<Service>>>(content);

    apiResponse.Should().NotBeNull();
    apiResponse!.Success.Should().BeTrue();
    apiResponse.Data.Should().NotBeNull();
    apiResponse.Data.Should().HaveCount(8);
    apiResponse.Data![0].DisplayOrder.Should().BeLessThanOrEqualTo(apiResponse.Data[1].DisplayOrder);
}
```

### Frontend Service Tests

**Unit Test (Jasmine + HttpClientTestingModule):**

```typescript
it('should fetch services from API', (done) => {
  const mockServices: Service[] = [
    { id: 1, title: 'Test Service', icon: 'phone', shortDescription: 'Test', longDescription: 'Test long', displayOrder: 1, isActive: true }
  ];

  const mockResponse: ApiResponse<Service[]> = {
    success: true,
    data: mockServices,
    message: 'Success'
  };

  service.getServices().subscribe(services => {
    expect(services).toEqual(mockServices);
    done();
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/services`);
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});
```

---

## API Documentation (Swagger)

**Swagger UI URL (Development):** https://localhost:5001/swagger

**Endpoint appears as:**

```
GET /api/services
Get all active services ordered by display order

Responses:
  200 - Success (ApiResponse<IEnumerable<Service>>)
  500 - Internal Server Error (ApiResponse<IEnumerable<Service>>)
```

**Swagger Configuration (Program.cs):**

```csharp
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Velobiz API",
        Version = "v1",
        Description = "API for Velobiz marketing website"
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});
```

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
_logger.LogInformation("Fetching all active services");
_logger.LogError(ex, "Error retrieving services from database");
```

### Frontend Error Tracking

```typescript
console.error('Services fetch error:', err);
// Future: Send to error tracking service (Sentry, LogRocket, etc.)
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-20 | Initial API contract for Feature 3 |
